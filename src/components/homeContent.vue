<template>
  <div class="homeContent">
    <div class="content-wrap">
      <div class="content-table-setting" v-if="false">
        <div class="table-filter-menu">
          <el-dropdown trigger="click" size="mini" placement="bottom-end" class="dropbox-default-class"
            popper-class="dropdown-select-menu-casino">
            <el-button color="#0f0f0f" style="min-width: 150px;"
              :class="{ noDefault: defaultCasinoSelected.itemIdx !== 0 }">{{ defaultCasinoSelected.label }}<el-icon
                class="el-icon--right"><el-icon>
                  <ArrowDown />
                </el-icon></el-icon>
            </el-button>
            <template #dropdown>
              <ul class="casino-selecter">
                <li class="casino-item" v-for="item in casinoSelectList" :key="item.itemIdx"
                  :class="{ casino_selected: item.itemIdx === defaultCasinoSelected.itemIdx }"
                  @click="switchCasino(item)">
                  <div class="content-img">
                    <div class="img-part">
                      <img :src="item.bgImg" alt="">
                    </div>
                  </div>
                  <div class="item-logo" v-if="item.itemLogo">
                    <img :src="item.itemLogo" alt="">
                  </div>
                  <div class="item-name" v-else>{{ item.label }}</div>
                </li>
              </ul>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" size="mini" class="dropbox-default-class" popper-class="dropdown-type-select-menu">
            <el-button color="#0f0f0f" style="min-width: 150px;" :class="{ noDefault: defaultType.itemIdx !== 0 }">{{
              defaultType.label }}<el-icon class="el-icon--right"><el-icon>
                  <ArrowDown />
                </el-icon></el-icon>
            </el-button>
            <template #dropdown>
              <ul class="type-selector">
                <li v-for="item in baccarat_type_list" :key="item.itemIdx"
                  :class="{ typeSelected: item.itemIdx === defaultType.itemIdx }" @click="switchTableType(item)">{{
                    item.label }}</li>
              </ul>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" size="mini" class="dropbox-default-class"
            popper-class="dropdown-range-select-menu">
            <el-button color="#0f0f0f" style="min-width: 150px;"
              :class="{ noDefault: default_range_selected.itemIdx !== 0 }">
              {{ default_range_selected.label }}<el-icon class="el-icon--right"><el-icon>
                  <ArrowDown />
                </el-icon></el-icon>
            </el-button>
            <template #dropdown>
              <ul class="range-selecter">
                <li v-for="item in table_range_select_list" :key="item.itemIdx"
                  :class="{ rangeSelected: item.itemIdx === default_range_selected.itemIdx }"
                  @click="switchTableRange(item)">{{ item.label }}</li>
              </ul>
            </template>
          </el-dropdown>
        </div>
        <div class="setting-table-card">
          <ul>
            <li class="table_num"><img :src="baseImages.table_icon" alt="">总桌台数{{ table_num }}</li>
            <!-- <li>
              <IconCardNum4 :class="[cardSelected === 4 && 'card-selected']" @click="switchTableDisplay(4)" />
            </li>
            <li>
              <IconCardNum9 :class="[cardSelected === 9 && 'card-selected']" @click="switchTableDisplay(9)" />
            </li>
            <li>
              <IconCardNum16 :class="[cardSelected === 16 && 'card-selected']" @click="switchTableDisplay(16)" />
            </li> -->
          </ul>
        </div>
      </div>
      <div class="content-table-box">
        <div class="casino-table"
          :class="{ 'grid-4': cardSelected === 4, 'grid-9': cardSelected === 9, 'grid-16': cardSelected === 16 }">
          <tableBoxFabric class="li-table" v-for="table in tableList" v-bind="table" :key="table.table_id"
            :table_rank_data="table_rank_data[table.code]" @click="toRoom(table)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeMount, ref, watch } from 'vue'
import game from '@/api/game'
import { useUserStore, useWsInfoStore } from '@/store'
import { useRouter } from 'vue-router'

import tableBoxFabric from './Lobby/tableBoxFabric.vue'
import baseImages from '@/utils/baseImages'
// import IconCardNum4 from '@/components/icons/IconCardNum4.vue'
// import IconCardNum9 from '@/components/icons/IconCardNum9.vue'
// import IconCardNum16 from '@/components/icons/IconCardNum16.vue'

import img_casino_all from '@/assets/images/img_casino_all.jpg'
import img_casino_resortworld from '@/assets/images/img_casino_resortworld.jpg'
import img_casino_sl from '@/assets/images/img_casino_sl.jpg'
import img_casino_wm from '@/assets/images/img_casino_wm.jpg'

const userStore = useUserStore()
const wsInfoStore = useWsInfoStore()
const router = useRouter()

import tool from '@/utils/tool'

// 大厅的基本信息

// 牌桌数量
const table_num = ref(0)
// 设置的 大厅牌桌显示的每行的数量
const cardSelected = ref(4)

// 切换 列表排列
function switchTableDisplay(num) {
  cardSelected.value = num
}

const defaultCasinoSelected = ref({
  label: "全部赌场",
  itemIdx: 0,
  bgImg: img_casino_all,
  itemLogo: '',
})

// 赌场选择
const casinoSelectList = [
  {
    label: "全部赌场",
    itemIdx: 0,
    bgImg: img_casino_all,
    itemLogo: '',
  },
  {
    label: "云顶",
    itemIdx: 1,
    bgImg: img_casino_resortworld,
    itemLogo: baseImages.logo_cl_yunding,
  },
  {
    label: "晨丽",
    itemIdx: 2,
    bgImg: img_casino_sl,
    itemLogo: baseImages.logo_cl_sl,
  },
  {
    label: "COG 完美",
    itemIdx: 3,
    bgImg: img_casino_wm,
    itemLogo: baseImages.logo_cog_wm,
  },
]

const defaultType = ref({
  label: "全部类型",
  itemIdx: 0
})

// 百家乐 类型选择
const baccarat_type_list = [
  {
    label: "全部类型",
    itemIdx: 0,
  },
  {
    label: "快速百家乐",
    itemIdx: 1,
  },
  {
    label: "直播百家乐",
    itemIdx: 2,
  }
]

// 限红 选择
const default_range_selected = ref({
  label: "不限限红",
  itemIdx: 0
})
const table_range_select_list = [
  {
    label: "不限限红",
    itemIdx: 0
  },
  {
    label: "低至高",
    itemIdx: 1
  },
  {
    label: "高至低",
    itemIdx: 2
  },
]

function switchCasino(item) {
  defaultCasinoSelected.value = item
}

function switchTableType(item) {
  defaultType.value = item
}

function switchTableRange(item) {
  default_range_selected.value = item
}

function toRoom(item) {
  tool.local.set("roomDetail", item)
  router.push({
    name: "room",
    query: {
      roomId: item.code,
      token: tool.local.get('token')
    }
  })
}

// watch
watch(defaultCasinoSelected, () => {
  updateLobbyTableList()
})
watch(defaultType, () => {
  updateLobbyTableList()
})
watch(default_range_selected, () => {
  updateLobbyTableList()
})

const table_rank_data = ref({})
watch(() => wsInfoStore.msgList.table_info, (val) => {
  const { table_id, total_money, total_people, winner } = val
  table_rank_data.value[table_id] = val
})

// 通过开奖更新大厅桌台的路图
watch(() => wsInfoStore.msgList.open_result, val => {
  const { history, new_number, table_id, total } = val
  updateMapList(history)
})

// 换靴 清空指定房间
watch(() => wsInfoStore.msgList.event_change_round, async val => {
  const { change_round, round_id, table_code, handler_change_shoe } = val
  for(let i in tableList.value) {
    if(tableList.value[i].code === table_code) {
      // 大厅-手动换靴-更新指定桌台的信息
      if(handler_change_shoe) {
        const lastTableInfo = await updateTableInfo(table_code)
        if(lastTableInfo) {
          tableList.value[i] = {
            ...tableList.value[i],
            records: lastTableInfo.records
          }
        } else {
          console.log(`获取指定桌台${table_code}信息出错`);
        }
      } else {
        tableList.value[i] = {
          ...tableList.value[i],
          records: []
        }
      }
    }
  }
})

// 接口更新 当前桌台信息
function updateTableInfo(table_code) {
    return new Promise((resolve, reject)=> {
        game.tableInfo(table_code).then(res=> {
            if(res.code === 200) {
                resolve(res.data)
            } else {
                resolve(false)
            }
        }).catch(err=> {
            reject(err)
        })
    })
}

const tableList = ref([])

// 向路图记录添加最新开奖的胜负信息
function updateMapList(open_result_history) {
  for (let i in tableList.value) {
    if (tableList.value[i].code === open_result_history[0].table_code) {
      tableList.value[i] = {
        ...tableList.value[i],
        records: processMapList(tableList.value[i].records, open_result_history)
      }
    }
  }
}

function processMapList(list1, list2) {
  // 创建一个 Set 来存储独特的 round_id
  let uniqueRoundIds = new Set();
  // 创建一个数组来存储结果
  let unionArray = [];
  const processArray = (arr) => arr.forEach(item => {
    if (!uniqueRoundIds.has(item.round_id)) {
      uniqueRoundIds.add(item.round_id);
      unionArray.push(item);
    }
  })
  processArray(list1)
  processArray(list2)
  return unionArray
}

async function updateLobbyTableList() {
  const params = {
    casino: defaultCasinoSelected.value.itemIdx,
    type: 1,// defaultType.value.itemIdx,
    range: default_range_selected.value.itemIdx,
  }
  try {
    const listRequest = await game.tableList(params)
    if (listRequest.code === 200) {
      // const { items, pageInfo } = listRequest.data
      tableList.value = listRequest.data
      // table_num.value = pageInfo.total
      table_num.value = tableList.value.length
    }
  } catch (error) {
    userStore.userStatus = 'off'
    return
  }
}

onBeforeMount(() => {
  updateLobbyTableList()
})
</script>
<style scoped lang="less">
@import url('@/assets/styles/home-content');
</style>
