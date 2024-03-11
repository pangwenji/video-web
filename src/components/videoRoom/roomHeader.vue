<script setup>
import { reactive, toRefs, ref, watch, onBeforeMount, onMounted } from 'vue';
// import baseImages from '@/utils/baseImages'
import baccaratLivePlayer from '../baccaratLivePlayer.vue';
import { useWsInfoStore } from '@/store'
import tool from '@/utils/tool';
const wsInfoStore = useWsInfoStore()
const props = defineProps({
  roomDetail: Object,
  userList: Array,
  ontimeTableInfo: Object,
  tablePlayExplain: Array,
  headLeft: Object
})

// 当前搜索下注信息的字段
const betInfoStringType = ref("")

// 桌台直播播放器
const tableLivePlayerRef = ref()

// 展示桌台玩法
const showTableExplain = ref(false)

const searchBetInfos = ref([])

const betInfoShow = ref({
  banker_winner: false,
  tie: false, // 和
  banker_pair: false,
  player_pair: false,
  player_winner: false
})
const { headLeft, userList, ontimeTableInfo, tablePlayExplain, limit_red_rules, roomDetail } = toRefs(props)

// marquee 配置
const marqueeOptions = ref({
  direction: "normal", // reverse
  duration: 20, // 秒
  delay: 0, // 秒
  loop: 0, // 
  // gradient: false, 
  // gradientColor: [20,50,55], // 渐变色
  // gradientLength: '200px',
  pause: false,
  pauseOnHover: false,
  pauseOnClick: false,
})

const headLeftCopy = ref({})
const table_red_limit_rules = ref({})
const self_red_limit_rules = ref({})
const public_red_limit_rules = ref({})
const tableLimitData = ref([])
const showRoomLimitRed = ref(false)

// const tableUserList = ref(userList.value || [])

watch(headLeft, val => {
  headLeftCopy.value = val
})

watch(wsInfoStore.$state.msgList, val => {
  if (val && val.search_bet && val.search_bet.length) {
    searchBetInfos.value = val.search_bet
    betInfoShow.value[betInfoStringType.value] = true
  }
})

watch(ontimeTableInfo, val => {
  // console.log('room-header-tableInfo', val);
  // const { number, table_id, total_people, winner, bet_money, count_people } = val
  if (ontimeTableInfo.value.winner && Object.keys(ontimeTableInfo.value.winner).length) {
    betInfo.value = ontimeTableInfo.value.winner
  }
})

// 左侧的 房间内的用户列表
const roomUserList = ref([])

// 右侧的下注信息
const betInfo = ref({
  tie: {
    bet_amount: 0,
    total_people: 0,
  },
  banker_winner: {
    bet_amount: 0,
    total_people: 0,
  },
  banker_pair: {
    bet_amount: 0,
    total_people: 0,
  },
  player_pair: {
    bet_amount: 0,
    total_people: 0,
  },
  player_winner: {
    bet_amount: 0,
    total_people: 0,
  },
  super_six: {
    bet_amount: 0,
    total_people: 0,
  }
})

function betInfoHover(searchType) {
  betInfoStringType.value = searchType
  searchBetInfo(searchType)
}

const showRoomUserList = ref(false)

// 当前桌台列表
function searchTableUserList() {
  const { code, round_id } = roomDetail.value
  if (!code || !round_id) {
    return
  }
  wsInfoStore.send(JSON.stringify({
    event: "search_table_user",
    data: {
      table_code: roomDetail.value.code,
      number: roomDetail.value.round_id
    }
  }))
}

// 查找用户信息
watch(() => wsInfoStore.msgList.search_table_user, (newVal, oldVal) => {
  headLeftCopy.value = {
    ...headLeft.value,
    total_money: newVal.money
  }
  if (userList.value && userList.value.length) {
    showRoomUserList.value = true
  }
})

// 查询下注信息
function searchBetInfo(betString) {
  const { number, table_id } = ontimeTableInfo.value
  wsInfoStore.send(JSON.stringify({
    event: "search_bet",
    data: {
      code: betString,
      number: number,
      table_code: table_id
    }
  }))
}

// 桌面 区域背景闪烁
function addAreaBreathAnimate(eleId) {
  if (eleId) {
    const ele = document.getElementById(eleId)
    if (ele && ele.children) {
      ele.children[0].classList.add('breath-light')
    }
  }
}

function removeAreaBreathAnimate(eleId) {
  if (eleId) {
    const ele = document.getElementById(eleId)
    if (ele && ele.children) {
      ele.children.classList.remove('breath-light')
    }
  }
}
function playStyleDict(content) {
  if (content === "1") {
    return "庄/闲"
  }
  if (content === "2") {
    return "对子"
  }
  if (content === "3") {
    return "和"
  }
  if (content === "4") {
    return "Super6"
  }
}
onBeforeMount(() => {
  const local_room_detail = roomDetail.value || tool.local.get("roomDetail")
  try {
    table_red_limit_rules.value = local_room_detail.table_red_limit_rules
    self_red_limit_rules.value = local_room_detail.self_red_limit_rules
    public_red_limit_rules.value = local_room_detail.public_red_limit_rules
    tableLimitData.value = []
    const playStyleKeys = Object.keys(table_red_limit_rules.value)
    for (let i in playStyleKeys) {
      tableLimitData.value.push({
        play_style_name: playStyleDict(playStyleKeys[i]),
        table_red: table_red_limit_rules.value[playStyleKeys[i]],
        self_red: self_red_limit_rules.value[playStyleKeys[i]],
        public_red: public_red_limit_rules.value[playStyleKeys[i]]
      })
    }
  } catch (error) {
    console.log('没有桌台信息', error);
  }
})

</script>

<template>
  <div class="header-wrap">
    <div class="left-table-info">
      <div class="room-logo">
        <img v-if="roomDetail" :src="roomDetail.cover" alt="">
        <span> {{ ontimeTableInfo.table_code || ontimeTableInfo.table_id }} </span>
      </div>
      <div class="info-detail">
        <div class="detail-1">
          <span class="table-value">局号 <i class="num-value">{{ headLeftCopy.number }}</i></span>
          <span class="table-limit" @mouseenter="showRoomLimitRed = true" @mouseleave="showRoomLimitRed = false"> 下注区间
            <i class="num-value">{{ tool.convertAmountNum(tableLimitData[0].public_red.min) }} - {{
          tool.convertAmountNum(tableLimitData[0].public_red.max) }}</i></span>
        </div>
        <div class="detail-2">
          <div class="user-list-wrap" @mouseenter="searchTableUserList"
            @mouseleave="showRoomUserList = false, betInfoStringType = ''">
            <i class="icon-people"></i><span>{{ headLeftCopy.total_people || 0 }}</span>
            <i class="icon-amount"></i><span>{{ headLeftCopy.total_money && tool.fixedNumber(headLeftCopy.total_money)
          || 0 }}</span>
            <div class="tooltip-user-list" v-if="showRoomUserList">
              <table>
                <thead>
                  <tr class="head-tr">
                    <td>座位</td>
                    <td>昵称</td>
                    <td>金额</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in userList">
                    <td class="user-seat">{{ user.seat || "-" }}</td>
                    <td class="user-name">{{ user.user_nick }}</td>
                    <td class="user-amount">{{ user.money }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="table-explain">
            <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" class="info" @mouseover="showTableExplain = true"
              @mouseleave="showTableExplain = false">
              <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.496117001">
                <g id="04-bg-/-table-/-bet_info">
                  <g id="Group">
                    <rect id="Rectangle" stroke="#FFFFFF" stroke-width="2" x="1" y="1" width="34" height="34" rx="17">
                    </rect>
                    <circle id="Oval" fill="#FFFFFF" cx="18" cy="12.5" r="2.5"></circle>
                    <rect id="Rectangle" fill="#FFFFFF" x="16.5" y="17" width="3" height="10"></rect>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div class="detail-3">
          <div class="room-welcome">
            <div class="icon-voice"></div>
            <Vue3Marquee v-bind="marqueeOptions">
              <span> {{ roomDetail && roomDetail.table_welcome_message || "欢迎光临" }} </span>
            </Vue3Marquee>
          </div>
        </div>
        <div class="border-wrapper-explain" :class="{ 'show-explain': showTableExplain }">
          <table class="base-table">
            <thead>
              <tr>
                <th class="play-type">玩法</th>
                <th class="description">说明</th>
                <th class="bet-odds">赔率</th>
              </tr>
              <tr>
                <th colspan="3" class="divider">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="play in tablePlayExplain">
                <td class="play-type">{{ play.play }}</td>
                <td class="description">{{ play.play_desc }}</td>
                <td class="bet-odds">{{ play.play_ratio }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-wrapper-limit-red" v-if="showRoomLimitRed">
          <table class="base-table">
            <thead>
              <tr>
                <th>玩法</th>
                <th>本台限红</th>
                <th>您的盘口</th>
                <th>下注区间</th>
              </tr>
              <tr>
                <th colspan="4" class="divider">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="limit in tableLimitData">
                <td>{{ limit.play_style_name }}</td>
                <td>{{ limit.table_red.min }} - {{ limit.table_red.max }}</td>
                <td>{{ limit.self_red.min }} - {{ limit.self_red.max }}</td>
                <td>{{ limit.public_red.min }} - {{ limit.public_red.max }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="live-player-block">
      <div class="player-box">
        <baccaratLivePlayer ref="tableLivePlayerRef" />
      </div>
    </div>
    <div class="right-bet-info">
      <!-- 下注信息 -->
      <ul class="bet-info-log-list">
        <li class="bet-li bet-banker" @mouseenter="betInfoHover('banker_winner')"
          @mouseleave="betInfoShow.banker_winner = false, betInfoStringType = ''">
          <div class="left">庄</div>
          <div class="right"> {{ betInfo.banker_winner.bet_amount }} / {{
          betInfo.banker_winner.total_people }} </div>
          <div class="tooltip_table tooltip-bet-banker" v-if="betInfoShow.banker_winner">
            <table>
              <thead>
                <tr>
                  <td>座位</td>
                  <td>会员名称</td>
                  <td>金额</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchBetInfos">
                  <td class="bet-seat">{{ item.user_id }}</td>
                  <td class="bet-name">{{ item.nickname }}</td>
                  <td class="bet-amount">{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li class="bet-li bet-banker-pair" @mouseenter="betInfoHover('banker_pair')"
          @mouseleave="betInfoShow.banker_pair = false, betInfoStringType = ''">
          <div class="left">庄对</div>
          <div class="right"> {{ betInfo.banker_pair.bet_amount }} / {{
          betInfo.banker_pair.total_people }} </div>
          <div class="tooltip_table tooltip-bet-banker-pair" v-if="betInfoShow.banker_pair">
            <table>
              <thead>
                <tr>
                  <td>座位</td>
                  <td>会员名称</td>
                  <td>金额</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchBetInfos">
                  <td class="bet-seat">{{ item.user_id }}</td>
                  <td class="bet-name">{{ item.nickname }}</td>
                  <td class="bet-amount">{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li class="bet-li bet-tie" @mouseenter="betInfoHover('tie')"
          @mouseleave="betInfoShow.tie = false, betInfoStringType = ''">
          <div class="left">和</div>
          <div class="right"> {{ betInfo.tie.bet_amount }} / {{
          betInfo.tie.total_people }} </div>
          <div class="tooltip_table tooltip-bet-tie" v-if="betInfoShow.tie">
            <table>
              <thead>
                <tr>
                  <td>座位</td>
                  <td>会员名称</td>
                  <td>金额</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchBetInfos">
                  <td class="bet-seat">{{ item.user_id }}</td>
                  <td class="bet-name">{{ item.nickname }}</td>
                  <td class="bet-amount">{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li class="bet-li bet-player" @mouseenter="betInfoHover('player_winner')"
          @mouseleave="betInfoShow.player_winner = false, betInfoStringType = ''">
          <div class="left">闲</div>
          <div class="right"> {{ betInfo.player_winner.bet_amount }} / {{
          betInfo.player_winner.total_people }} </div>
          <div class="tooltip_table tooltip-bet-player" v-if="betInfoShow.player_winner">
            <table>
              <thead>
                <tr>
                  <td>座位</td>
                  <td>会员名称</td>
                  <td>金额</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchBetInfos">
                  <td class="bet-seat">{{ item.user_id }}</td>
                  <td class="bet-name">{{ item.nickname }}</td>
                  <td class="bet-amount">{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li class="bet-li bet-player-pair" @mouseenter="betInfoHover('player_pair')"
          @mouseleave="betInfoShow.player_pair = false, betInfoStringType = ''">
          <div class="left">闲对</div>
          <div class="right"> {{ betInfo.player_pair.bet_amount }} / {{
          betInfo.player_pair.total_people }} </div>
          <div class="tooltip_table tooltip-bet-player-pair" v-if="betInfoShow.player_pair">
            <table>
              <thead>
                <tr class="head-tr">
                  <td>座位</td>
                  <td>会员名称</td>
                  <td>金额</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in searchBetInfos">
                  <td class="bet-seat">{{ item.user_id }}</td>
                  <td class="bet-name">{{ item.nickname }}</td>
                  <td class="bet-amount">{{ item.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li class="bet-li big-item"><span>总彩池</span> {{ ontimeTableInfo.betMoney || 0 }} / {{
          ontimeTableInfo.count_people || 0 }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.header-wrap {
  width: 1366px;
  display: flex;
  justify-content: space-between;

  .left-table-info {
    width: 393px;
    height: 90px;
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    color: #fff;
    position: relative;

    .room-logo {
      width: 100px;
      background: #000;
      padding: 6px 0;
      margin: 0 6px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;

      img {
        width: 100%;
        vertical-align: -webkit-baseline-middle;
      }

      span {
        text-align: center;
        display: inline-block;
        width: 100%;
        font-size: 14px;
      }
    }

    .info-detail {
      flex: 1;
      display: flex;
      flex-direction: column;

      .detail-1 {
        flex: 1;
        display: flex;
        font-size: 13px;
        position: relative;

        .table-value {
          flex: 1;
          color: #9a9a9a;
          min-width: 138px;
          font-size: 12px;

          .num-value {
            color: #fff;
            font-weight: 600;
            font-style: normal;
            padding-right: 5px;
          }
        }

        .table-limit {
          text-align: right;
          color: #9a9a9a;
          min-width: 138px;

          .num-value {
            color: #fff;
            font-weight: 600;
            font-style: normal;
          }
        }
      }

      .detail-2 {
        flex: 1;
        color: #fff;
        position: relative;
        display: flex;
        justify-content: space-between;

        .user-list-wrap {
          .icon-people {
            display: inline-block;
            width: 16px;
            height: 16px;
            position: relative;
            margin-right: 4px;

            &::before {
              content: "";
              position: absolute;
              bottom: 0;
              background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX3Blb3BsZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJTeW1ib2xzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDItaWMtLy1zeXN0ZW0xNi0vLXBlb3BsZSIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImljX3Blb3BsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTMiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMC4zMzMzMzMpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGVsbGlwc2UgaWQ9Ik92YWwtNCIgY3g9IjUiIGN5PSIyLjE1Mzg0NjE1IiByeD0iMi4xNDI4NTcxNCIgcnk9IjIuMTUzODQ2MTUiPjwvZWxsaXBzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTAsOS4xNjc2NTI4NiBDMCw5LjE2NzY1Mjg2IDIuMDI2NTMxNTEsNS43NDM4MTA4OSA0Ljk3NDI0NDM5LDUuNzQzNTg5NzYgQzYuNDQ4MjIzNTMsNS43NDM0NzkxOSA4LjE1MjUzNjM2LDYuMTc5MjEzNzYgOS45NDg5Nzk1OSw5LjE2NzY1Mjg2IEwwLDkuMTY3NjUyODYgWiIgaWQ9IlBhdGgtMyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
              width: 16px;
              height: 13px;
              filter: brightness(0.5);
            }
          }

          .icon-amount {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 5px;
            position: relative;
            margin-right: 4px;

            &::before {
              content: "";
              position: absolute;
              bottom: 0;
              background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX2Ftb3VudDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJTeW1ib2xzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDItaWMtLy1zeXN0ZW0xNi0vLWFtb3VudCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTUuNSwxNCBDMy4wMTQ3MTg2MywxNCAxLDExLjk4NTI4MTQgMSw5LjUgQzEsNy4wMTQ3MTg2MyAzLjAxNDcxODYzLDUgNS41LDUgQzcuOTg1MjgxMzcsNSAxMCw3LjAxNDcxODYzIDEwLDkuNSBDMTAsMTEuOTg1MjgxNCA3Ljk4NTI4MTM3LDE0IDUuNSwxNCBaIE02LDYuMjM2OTg3NzkgTDYsNS40IEw1LDUuNCBMNSw2LjIxNDIwNzY4IEM0LjQyMzU2MDY4LDYuMjU5MzE4NTMgMy45Mzg2Mzg1NCw2LjQxMjMyNzE3IDMuNTUyLDYuNjggQzMuMDg0LDYuOTkyIDIuODU2LDcuNDM2IDIuODU2LDggQzIuODU2LDguNTI4IDMuMDk2LDguOTQ4IDMuNTc2LDkuMjQ4IEMzLjg0OTA4MzI4LDkuNDMwMDU1NTIgNC4zMjcxNjAwNSw5LjYwMTMyMTkgNSw5Ljc2MTc5OTE2IEw1LDExLjY2OTY4MzggQzQuNzM3ODY0NTcsMTEuNjMzNjQ2NSA0LjUzNzY1MDczLDExLjU2MTE5MjIgNC4zOTIsMTEuNDU2IEM0LjE3NiwxMS4yODggNC4wMiwxMC45ODggMy45NDgsMTAuNTY4IEwyLjcsMTAuNTY4IEMyLjgzMDQ1MDIyLDExLjg3MjUwMjIgMy41OTExNjkzNSwxMi41OTU5NzUzIDUsMTIuNzIwNTc2NiBMNSwxMy40IEw2LDEzLjQgTDYsMTIuNzE4ODY1NiBDNy40NzcxMTY0MSwxMi41OTY2NjA5IDguMjIsMTEuOTQ0ODIyMSA4LjIyLDEwLjc3MiBDOC4yMiwxMC4yMiA3Ljk2OCw5Ljc4OCA3LjQ3Niw5LjQ3NiBDNy4xNTUzNjUyNiw5LjI2OTg3NzY3IDYuNjU5ODg5MzEsOS4wNzQ2ODI5MSA2LDguOTExMjcxNDUgTDYsNy4zMTYwOTkwNCBDNi4xMzIxOTExLDcuMzUxMjI4NjEgNi4yNDQ3OTM0LDcuMzk5MTk1NiA2LjMzNiw3LjQ2IEM2LjU0LDcuNTkyIDYuNjg0LDcuODIgNi43OCw4LjE1NiBMOC4wMTYsOC4xNTYgQzcuODkxODU0NDksNy4wMjgzNDQ5NyA3LjIxNDcyODI5LDYuMzkxMjM3MzQgNiw2LjIzNjk4Nzc5IFogTTUsNy4yNjA4ODg4OSBMNSw4LjY0MDY5MTQyIEM0Ljg1NDg2MjEsOC41OTQ5NTcyMyA0Ljc0MDY3NzQyLDguNTUzNjM0NDEgNC42NTYsOC41MTYgQzQuMzIsOC4zNiA0LjE1Miw4LjE4IDQuMTUyLDcuOTY0IEM0LjE1Miw3LjcyNCA0LjI2LDcuNTMyIDQuNDg4LDcuNDEyIEM0LjYxNiw3LjMzMiA0Ljc4NjY2NjY3LDcuMjg0IDUsNy4yNjA4ODg4OSBaIE02LDExLjY1NTAwMzEgTDYsMTAuMDE0ODUzNyBDNi4xNTkzNTAzNSwxMC4wNjM0Mzk3IDYuMjc5NjQzNTgsMTAuMTA3ODIxOCA2LjM2LDEwLjE0OCBDNi43MiwxMC4zMTYgNi45MTIsMTAuNTU2IDYuOTEyLDEwLjg1NiBDNi45MTIsMTEuMjg3MzkxIDYuNjA0MTgxNTYsMTEuNTU3NTQzOSA2LDExLjY1NTAwMzEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC43OTI5Njc1LDggTDE1LDggTDE1LDkgTDEwLjk3NzU3ODUsOSBDMTAuOTQ2NjMyMiw4LjY1NjU5MDIzIDEwLjg4NDEyMDcsOC4zMjIyODIzNiAxMC43OTI5Njc1LDggWiBNMTAuOTc3NTc4NSwxMCBMMTUsMTAgTDE1LDExIEwxMC43OTI5Njc1LDExIEMxMC44ODQxMjA3LDEwLjY3NzcxNzYgMTAuOTQ2NjMyMiwxMC4zNDM0MDk4IDEwLjk3NzU3ODUsMTAgWiBNOC42NjMwNzkxMyw1IEM3Ljc2ODQwNTQzLDQuMzY5OTcwNjkgNi42Nzc0MDgzNiw0IDUuNSw0IEM0Ljk3OTk4ODEyLDQgNC40NzY4MzE3OSw0LjA3MjE2NzE2IDQsNC4yMDcwMzI0OSBMNCw0IEwxMiw0IEwxMiw1IEw4LjY2MzA3OTEzLDUgWiBNMTAuNDAwMjkwNCwxMiBMMTUsMTIgTDE1LDEzIEw5Ljc0MjgzNzg5LDEzIEM5Ljk5NjQ2NjEsMTIuNjkyODkyMyAxMC4yMTczOTQyLDEyLjM1Nzc4MTcgMTAuNDAwMjkwNCwxMiBaIE05Ljc0MjgzNzg5LDYgTDEyLDYgTDEyLDcgTDEwLjQwMDI5MDQsNyBDMTAuMjE3Mzk0Miw2LjY0MjIxODI5IDkuOTk2NDY2MSw2LjMwNzEwNzcxIDkuNzQyODM3ODksNiBaIE00LDIgTDEyLDIgTDEyLDMgTDQsMyBMNCwyIFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+");
              width: 16px;
              height: 13px;
              filter: brightness(0.5);
            }
          }

          .tooltip-user-list {
            position: absolute;
            top: 23px;
            left: 0px;
            background: #000;
            max-height: 200px;
            overflow-y: scroll;
            font-size: 12px;
            z-index: 2;
            color: #f90;
            text-align: center;

            tr {
              word-break: keep-all;

              &.head-tr {
                font-size: 12px;
              }
            }

            tbody {
              tr {
                color: #fff;
                text-align: left;

                td.user-seat {
                  text-align: center;
                }
              }
            }
          }
        }

        .table-explain {
          font-size: 12px;
          color: #fff;
          line-height: 20px;
          white-space: nowrap;
          margin: 0;
          padding: 0;
          list-style: none;
          outline: none;
          user-select: none;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          z-index: 1;

          .info {
            font-size: 12px;
            color: #fff;
            line-height: 20px;
            white-space: nowrap;
            margin: 0;
            padding: 0;
            list-style: none;
            outline: none;
            user-select: none;
            width: 18px;
            height: 14px;
            box-sizing: border-box;
          }
        }
      }

      .detail-3 {
        color: #fff;
        font-size: 15px;
        background-color: rgba(10, 10, 10, .36);
        padding: 3px 6px;
        border-radius: 5px;

        .room-welcome {
          display: flex;
          align-items: center;

          .icon-voice {
            margin: 0 2px;
            width: 16px;
            height: 16px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAb1BMVEUAAADAmWzCn3HAmGzAmWvTp5HAmWzAmWzAmmzAmGzAmWzAmWzAmWzBmmzAmm7Bm2/En3DHqHbAmGvAmGzAmGzAmm3Bmm3DmW/AmWzAmWzAmWzAmWu/mm3AmWvAmGy/mWy/mWvAmGvBn26/n3C/mGvY/hHFAAAAJHRSTlMAgA75ygTbvFrzsZpwZjAqFArtzo1VTzfl4dSFRMOzrJg5JSBlqg0TAAAA3ElEQVRIx+2U2Q6DIBBFRXDf6la12v3+/zc2llY0GNSYponxvDAPc+CGwGg72+NQLGo3/IQs6T+aQCfok+2hBXRCTJxoIvwNEEJeAZY6vAMhhOe2SnV1eCFk7ZoExkR4IfgAzaTtc5cx5uZtCQwF43R5SLsG4ASyMH6j39CmLIwimv4i2IQzW3A/5WLhZ5HGoeDQuUIKTjpXaCg/oJn7NLSIeJ5HovHHd31qKu5sKAQArWOlYlfSByptpRGT/hct3kcyXT0EvP4t2SVgLRsztROtG2TrR6UYxjub4QW6sj1/XAXpBwAAAABJRU5ErkJggg==") no-repeat 50%;
            filter: sepia(100%);
            background-size: contain;
          }
        }
      }

      .border-wrapper-limit-red {
        font-size: 12px;
        font-family: -apple-system, Tahoma, Verdana, Arial, \\5FAE\8EDF\6B63\9ED1\9AD4Microsoft JhengHei, \\5FAE\8EDF\6B63\9ED1\9AD4 Microsoft JhengHei, Microsoft JhengHei, \\5FAE\8EDF\6B63\9ED1\9AD4, sans-serif;
        color: #fff;
        cursor: pointer;
        display: flex;
        justify-content: center;
        min-width: 115px;
        padding: 0;
        border: 1px solid #ffe7a3;
        border-radius: 4px;
        background: linear-gradient(0deg, #020202, #2e2a21);
        position: absolute;
        top: 30px;
        right: 0;
        z-index: 3;
        box-sizing: border-box;

        .base-table {
          position: relative;
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          margin: 0 6px 8px;
          font-size: 12px;
          color: #f2f2f2;
          text-align: center;

          &::before {
            position: absolute;
            z-index: -1;
            display: block;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            content: "";
            background: url('@/assets/images/dialog_title_light.png') no-repeat;
            background-position: top;
            background-size: 100%;

          }

          thead {
            color: #d7b66f;
          }

          tbody {
            tr:nth-child(odd) {
              padding: 0 11px;
            }
          }

          td {
            vertical-align: middle;
            padding: 0 6px;
          }
        }
      }

      .border-wrapper-explain {
        font-size: 12px;
        color: #fff;
        line-height: 20px;
        white-space: nowrap;
        margin: 0;
        list-style: none;
        outline: none;
        user-select: none;
        display: none;
        justify-content: center;
        min-width: 115px;
        padding: 0;
        border: 1px solid #ffe7a3;
        border-radius: 4px;
        background: linear-gradient(0deg, #020202, #2e2a21);
        position: absolute;
        z-index: 0;
        right: 5px;
        top: calc(100% + 7px);
        // width: 385px;
        width: 100%;
        box-sizing: border-box;

        &.show-explain {
          display: flex;
        }

        .base-table {
          position: relative;
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          margin: 0 6px 8px;
          font-size: 12px;
          color: #f2f2f2;
          text-align: center;

          tbody {
            td {
              &.play-type {
                text-align: left;
              }
            }
          }
        }
      }
    }
  }

  .live-player-block {
    width: 528px;
    position: relative;
    z-index: 2;

    .player-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 297px;
      cursor: pointer;
      background-image: url('data:image/png;base64,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');
      background-position: center;
      background-size: 100% 100%;
      will-change: transform;
      transform-origin: top;
      transition: transform .4s linear;

      .big-size {
        transform: scale(1.56);
      }
    }
  }

  .right-bet-info {
    width: 401px;
    min-width: 200px;
    height: 90px;
    display: flex;
    color: #fff;

    .bet-info-log-list {
      list-style: none;
      position: relative;
      margin: 8px 8px 8px 0;
      width: 100%;
      height: 100%;
      padding: 6px 10px;
      background: rgba(0, 0, 0, .35);
      border: 1px solid #1f332f;
      display: flex;
      flex-wrap: wrap;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;

      .bet-li {
        width: 33.333333%;
        height: 22px;
        padding: 0 6px;
        font-size: 13px;
        margin: 0;
        pointer-events: auto;
        display: flex;
        align-items: center;
        position: relative;

        .left {
          opacity: .8;
          pointer-events: none;
        }

        .right {
          margin-left: auto;
          pointer-events: none;
        }

        .tooltip_table {
          position: absolute;
          top: 23px;
          left: 0;
          background: #000;
          height: 100px;
          overflow-y: scroll;
          font-size: 12px;
          z-index: 2;
          color: #f90;
          text-align: center;

          table {
            tr {
              word-break: keep-all;

              &.head-tr {
                word-break: keep-all;
              }
            }

            tbody {
              color: #fff;
            }
          }
        }

        &.big-item {
          width: 100%;
          height: 22px;
          font-size: 15px;
          text-align: center;
          border-radius: 4px;
          background-color: #001614;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &:hover {
          background-color: hsla(0, 0%, 100%, .1);
          border-radius: 4px;
        }
      }
    }

    .bet-all-amount {
      width: 96%;
      margin: 0 auto;

      span {
        display: inline-block;
        width: 100%;
        height: 22px;
        font-size: 15px;
        text-align: center;
        border-radius: 4px;
        background-color: #001614;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
