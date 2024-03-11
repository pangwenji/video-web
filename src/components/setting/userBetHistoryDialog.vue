<script setup>
import { ref, onBeforeMount, onMounted, toRefs, watch } from "vue";
import user from "@/api/user";
import game from "@/api/game";
import CardSimpleImg from "../CardSimpleImg.vue";
import { ElMessage } from "element-plus";

const visible = ref(false);
const loading = ref(false)
const open = async (row) => {
  betCalcNum.value = 0;
  betTotalNum.value = 0;
  await getBetHistory();
  visible.value = true;
};
const pageOpts = ref({
  perPage: 10,
  totalNum: 0,
  pageNum: 0,
});

const selectorDropdownRef = ref();

const dateSelectOpts = [
  {
    label: "今天",
    itemIdx: 0,
    value: "today",
  },
  {
    label: "昨天",
    itemIdx: 1,
    value: "yesterday",
  },
  {
    label: "最近7天",
    itemIdx: 2,
    value: "sevenday",
  },
];

const selectedDate = ref({
  label: "今天",
  itemIdx: 0,
  value: "today",
});
const betConvertNum = ref(2000); // 转码总计
const betCalcNum = ref(0); // 派彩总计
const betTotalNum = ref(0); // 投注总计
const userBetHistoryList = ref([]); // 投注列表
onBeforeMount(async () => {});

watch(selectedDate, async (val) => {
  await getBetHistory();
});

// 列表 每条数据的一个 卡牌 弹框
const betHistoryCardShowList = ref({});

function cellHoverEventEnter(row) {
  if (row.round_id)
    betHistoryCardShowList.value[`${row.round_id}_${row.id}`] = true;
}
function cellHoverEventLeave(row) {
  if (row.round_id)
    betHistoryCardShowList.value[`${row.round_id}_${row.id}`] = false;
}

function switchDateSelect(item) {
  selectedDate.value = item;
  betCalcNum.value = 0;
  betTotalNum.value = 0;
  selectorDropdownRef.value.handleClose();
}

const enmuGameIdx = {
  1: {
    en: "banker",
    zh: "庄",
  },
  2: {
    en: "player",
    zh: "闲",
  },
  3: {
    en: "tie",
    zh: "和",
  },
  4: {
    en: "bankerPair",
    zh: "庄对",
  },
  5: {
    en: "playerPair",
    zh: "闲对",
  },
  6: {
    en: "Super6",
    zh: "Super6",
  },
};

// 订单状态
const enmuBetStatus = {
  0: "未派彩",
  1: "自动派彩",
  2: "手动派彩",
  3: "取消投注",
  4: "已退款",
};

function getBetHistory() {
  userBetHistoryList.value = [];
  loading.value = true
  return new Promise((resolve, reject) => {
    game
      .betHistory({
        timeType: selectedDate.value.value,
        page: pageOpts.value.pageNum,
        pageSize: pageOpts.value.perPage,
      })
      .then((res) => {
        if (res.code === 200) {
          const { items, pageInfo } = res.data;
          pageOpts.value = {
            ...pageOpts.value,
            pageNum: pageInfo.currentPage,
            totalNum: pageInfo.total,
          };
          betCalcNum.value = pageInfo.total_profit;
          betTotalNum.value = pageInfo.total_bet;
          dataListProcess(items);
          resolve(userBetHistoryList);
        } else {
          throw res.message || res.code;
        }
      })
      .catch((err) => {
        console.log("获取投注记录报错", err);
        reject(err);
      }).finally(() => {
        loading.value = false
      })
  });
}

// 处理投注列表
function dataListProcess(item) {
  if (item && item.length) {
    for (let i in item) {
      const {
        created_at,
        round_id,
        table_code,
        original_data,
        bet,
        profit,
        win,
        game_play,
        banker,
        player,
        bet_status,
        id,
      } = item[i];
      let result = "等待结算";
      if (original_data?.length) {
        const convert_original_data = JSON.parse(original_data);
        result = `庄(${convert_original_data.banker_pointer})闲(${convert_original_data.player_pointer})`;
      }
      userBetHistoryList.value.push({
        bet_status,
        id,
        created_at,
        round_id,
        table_code,
        result,
        bet,
        win,
        banker,
        player,
        profit,
        selectedPlayer: enmuGameIdx[game_play].zh,
      });
      betHistoryCardShowList.value[`${round_id}_${id}`] = false;
    }
  }
}

function cardString(str) {
  if (str && str.length) {
    let list = [];
    try {
      str.split("|").forEach((item, idx) => {
        if (item) {
          const detail = item.split("-");
          list.push({
            cardType: detail[0],
            cardRank: detail[1],
            cardPoint: detail[2],
          });
        }
      });
      return list;
    } catch (error) {
      return [];
    }
  }
  return [];
}

// 取消投注
function cancelBet(id) {
  game
    .betCancel({
      order_id: id,
    })
    .then((res) => {
      if (res.code === 0) {
        ElMessage.error(res.message);
      } else {
        ElMessage.success(res.message);
      }
    })
    .catch((err) => {
      ElMessage.error(res.message);
    });
}

const changePage = (page) => {
  pageOpts.value.pageNum = page
  getBetHistory()

}

defineExpose({ open });
</script>

<template>
  <el-dialog
    v-model="visible"
    width="30%"
    align-center
    append-to-body
    class="user-bet-history-dialog"
  >
    <template #header>
      <span class="title"> 投注记录 </span>
    </template>
    <div class="content">
      <div class="bet-history-tip">(以北京时区为准)/移动鼠标可查看详情</div>
      <div class="filter-wrap">
        <ul>
          <li class="date-select">
            <el-dropdown
              trigger="click"
              size="mini"
              ref="selectorDropdownRef"
              class="dropbox-date-select-bet-history-class"
              popper-class="dropdown-date-select-menu"
            >
              <el-button
                color="#0f0f0f"
                style="width: 100%"
                :class="{ noDefault: selectedDate.itemIdx !== 0 }"
              >
                {{ selectedDate.label
                }}<el-icon class="el-icon--right"
                  ><el-icon> <ArrowDown /> </el-icon
                ></el-icon>
              </el-button>
              <template #dropdown>
                <ul class="date-selector">
                  <li
                    v-for="item in dateSelectOpts"
                    :key="item.itemIdx"
                    :class="{
                      'selected-date': item.itemIdx === selectedDate.itemIdx,
                    }"
                    @click="switchDateSelect(item)"
                  >
                    {{ item.label }}
                  </li>
                </ul>
              </template>
            </el-dropdown>
          </li>
          <li class="li-item bet-total-num">
            <div class="li-name">投注总计</div>
            <div class="li-value">{{ betTotalNum }}</div>
          </li>
          <li class="li-item bet-calc-num">
            <div class="li-name">派彩总计</div>
            <div class="li-value">{{ betCalcNum }}</div>
          </li>
          <!-- <li class="li-item bet-convert-num">
            <div class="li-name">转码总计</div>
            <div class="li-value">{{ betConvertNum }}</div>
          </li> -->
        </ul>
      </div>
      <div class="table-wrap">
        <el-table
          :data="userBetHistoryList"
          style="width: 100%; background-color: transparent"
          @cell-mouse-enter="cellHoverEventEnter"
          @cell-mouse-leave="cellHoverEventLeave"
          class="record-table"
          v-loading="loading"
        >
          <template #header>
            <el-table-column
              prop="created_at"
              label="时间"
              width="180"
              class-name="table-header-col"
            />
            <el-table-column
              prop="round_id"
              label="局号"
              width="150"
              class-name="table-header-col"
            />
            <!-- <el-table-column prop="gameType" label="游戏类" class-name="table-header-col" /> -->
            <el-table-column
              prop="table_code"
              label="桌号"
              class-name="table-header-col"
            />
            <el-table-column
              prop="result"
              label="结果"
              class-name="table-header-col"
            />
            <el-table-column
              prop="selectedPlayer"
              label="玩法"
              class-name="table-header-col"
            />
            <el-table-column
              prop="bet"
              label="总投注"
              class-name="table-header-col"
            />
            <el-table-column
              prop="profit"
              label="派彩"
              class-name="table-header-col"
            />
            <!-- <el-table-column prop="bet_status" label="操作" class-name="table-header-col" /> -->
          </template>
          <el-table-column
            prop="created_at"
            label="时间"
            width="180"
            class-name="table-col"
          />
          <el-table-column
            prop="round_id"
            label="局号"
            width="150"
            class-name="table-col"
          />
          <!-- <el-table-column prop="gameType" label="游戏类" class-name="table-col" /> -->
          <el-table-column
            prop="table_code"
            label="桌号"
            class-name="table-col"
          />
          <el-table-column
            prop="result"
            label="结果"
            width="100"
            class-name="table-col"
          />
          <el-table-column
            prop="selectedPlayer"
            label="玩法"
            class-name="table-col game_play"
          >
            <template #default="scope">
              <el-popover
                :visible="
                  betHistoryCardShowList[
                    `${scope.row.round_id}_${scope.row.id}`
                  ]
                "
                placement="top"
                width="auto"
                popper-class="bet-result-dialog"
                v-if="
                  cardString(scope.row.banker).length &&
                  cardString(scope.row.player).length
                "
              >
                <template #default>
                  <table class="table-wrapper">
                    <tr>
                      <td class="banker">庄</td>
                      <td>
                        <div class="card-wrap card-wrap-banker">
                          <CardSimpleImg
                            v-for="(card, idx) in cardString(scope.row.banker)"
                            v-bind="card"
                            :rotate="idx === 2 ? 'right' : ''"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <div class="separator"></div>
                      </td>
                    </tr>
                    <tr>
                      <td class="player">闲</td>
                      <td>
                        <div class="card-wrap card-wrap-player">
                          <CardSimpleImg
                            v-for="(card, idx) in cardString(scope.row.player)"
                            v-bind="card"
                            :rotate="idx === 2 ? 'right' : ''"
                          />
                        </div>
                      </td>
                    </tr>
                  </table>
                </template>
                <template #reference>
                  {{ scope.row.selectedPlayer }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="bet" label="总投注" class-name="table-col" />
          <el-table-column prop="profit" label="派彩" class-name="table-col" />
          <el-table-column
            prop="bet_status"
            label="状态"
            class-name="table-col"
          >
            <template #default="scope">
              <span>{{ enmuBetStatus[scope.row.bet_status] }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="bet_status" label="操作" class-name="table-col">
            <template #default="scope">
              <el-button type="danger" v-if="scope.row.bet_status===0" @click="cancelBet(scope.row.id)">取消投注</el-button>
              <span v-else>本局已结束</span>
            </template>
          </el-table-column> -->

          <template #empty>
            <div class="no-bet-list">暂无投注数据</div>
          </template>
        </el-table>
      </div>
      
    </div>

    <template #footer>
      <div class="footer-pagination" v-show="pageOpts.totalNum > 0">
        <el-pagination layout="prev, pager, next" :total="pageOpts.totalNum" @current-change="changePage" />
      </div>

      <div class="dialog-footer">
        <el-button class="btn-left" @click="visible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
.dropbox-date-select-bet-history-class {
  width: 100%;
}

.dropdown-date-select-menu {
  width: 200px;
}

.date-selector {
  list-style: none;
  outline: none;
  min-width: 55px;
  display: block;
  padding-left: 0;
  z-index: 1100;
  background: #000;
  top: 38px;
  border: 1px solid transparent;
  padding-bottom: 0;
  background-image: linear-gradient(#000, #000),
    linear-gradient(
      0deg,
      rgba(153, 102, 6, 0.52),
      #fffbf5 51%,
      hsla(30, 60%, 79%, 0.4)
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 5px;
  box-shadow: none;

  li {
    font-weight: 400;
    min-width: 55px;
    color: #fff;
    font-size: 13px;
    text-align: center;
    border-bottom: 1px solid #454545;
    padding: 10px;

    &.selected-date {
      color: #bf986b;
    }

    &:hover {
      background-color: #454545;
      cursor: pointer;
    }
  }
}

.noDefault {
  color: #bf986b;
}

.bet-result-dialog {
  background-color: #020202 !important;
}

.table-wrapper {
  // padding: 18px 14px;
  tr {
    .banker {
      color: #d9202c;
      text-align: left;
      font-size: 19px;
      font-weight: 600;
    }

    .player {
      color: #2033d9;
      text-align: left;
      font-size: 19px;
      font-weight: 600;
    }

    td {
      .card-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .separator {
        width: 100%;
        height: 1px;
        margin: 8px 0;
        background: #4d4d4d;
      }
    }
  }
}

.user-bet-history-dialog {
  font-size: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  user-select: none;
  border-radius: 4px;
  background: linear-gradient(0deg, #928383, #2e2a21);
  border: 1px solid #ffe88e;
  min-width: 500px;
  width: 76%;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  background: linear-gradient(0deg, #020202, #2e2a21);

  .el-dialog__header {
    margin: 0;
    padding: 0 !important;
  }

  .el-dialog__headerbtn {
    display: none;
  }

  .title {
    margin: 0;
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 47px;
    font-size: 18px;
    color: #ffe7a3;
    background: url("../../assets/images/dialog_title_light.png") no-repeat;
    background-size: 320px;
    background-position: top;
    box-sizing: border-box;
    font-weight: 700;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-image: linear-gradient(
        270deg,
        rgba(152, 103, 45, 0),
        rgba(152, 103, 45, 0.5) 22%,
        #ffe7a3 53%,
        rgba(190, 132, 58, 0.5) 81%,
        rgba(190, 132, 58, 0)
      );
    }
  }

  .el-dialog__body {
    padding: 0;

    .content {
      color: #fff;
      font-size: 15px;
      padding: 0;
      list-style: none;
      outline: none;
      user-select: none;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-sizing: border-box;
      width: 94%;
      background-color: transparent;

      .bet-history-tip {
        text-align: center;
        height: 38px;
        line-height: 36px;
        font-size: 13px;
        color: #787878;
      }

      .filter-wrap {
        height: 30px;
        line-height: 30px;

        ul {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          list-style: none;
          padding: 0;
          justify-content: space-between;

          li {
            width: 100%;
            margin-right: 5px;
            border: 1px solid #4a4a4a;
            background-color: #020202;
            border-radius: 5px;
            color: #fff;
            padding: 0 8px;

            &.date-select {
              text-align: center;
              padding: 0;
            }

            &.li-item {
              display: flex;
              justify-content: space-between;

              .li-name {
                color: #4a4a4a;
                font-size: 14px;
              }

              .li-value {
                color: #fff;
              }
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      .table-wrap {
        margin-top: 16px;

        .table-header-col {
          background-color: #6a6a69;
          color: #fff;
          font-weight: 500;
        }

        .table-col {
          background-color: #2e2a21;
          color: #fff;
        }
      }

      .no-bet-list {
        text-align: center;
        height: 400px;
        line-height: 400px;
      }
    }
  }

  .dialog-footer {
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }

  .btn-left {
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    border: none;
    font-size: 16px;
    border-radius: 20px;
    cursor: pointer;
    color: #000;
    font-weight: 500;
    width: 140px;
    height: 40px;
    background: #dfc58c;
    margin: 0 8px;
    box-sizing: border-box;
  }

  .btn-right {
    padding: 0;
    list-style: none;
    outline: none;
    user-select: none;
    background-color: transparent;
    font-weight: 500;
    font-size: 16px;
    border-radius: 20px;
    cursor: pointer;
    color: #d2b679;
    border: 1px solid #4a4a4a;
    width: 140px;
    height: 40px;
    margin: 0 8px;
    box-sizing: border-box;
  }
}

.footer-pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .el-pager {
    li {
      background-color: transparent;
      color: #fff;

      &.is-active {
        color: #d2b679;
      }
    }
  }

  .el-pagination button.is-disabled,
  .el-pagination button:disabled {
    color: #aaa;
    background-color: transparent;
  }

  .el-pagination button {
    background-color: transparent;
    color: #fff;
  }
}

.record-table {
  height: 440px;
}
</style>
