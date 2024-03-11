<script setup>
import { ref, onMounted, toRefs, watch, onBeforeMount } from 'vue'
// 百家乐开奖
import pokerCard from './pokerCard.vue';
import pointerNum from './pointerNum.vue';
import winnerText from './winnerText.vue';

const props = defineProps({
  tableRankInfo: Object
})

const { tableRankInfo } = toRefs(props)
const cardRefList = ref({})
const bankerCardList = ref([])
const playerCardList = ref([])
const winnerStr = ref("")
const playerPoint = ref(0)
const bankerPoint = ref(0)

function convertCardInfo(info) {
  bankerCardList.value = cardString(info.bankerCard, 'banker')
  playerCardList.value = cardString(info.playerCard, 'player')
  const cacheItem = playerCardList.value[1]
  playerCardList.value[1] = playerCardList.value[0]
  playerCardList.value[0] = cacheItem
  winnerStr.value = whoIsWin()
  function whoIsWin() {
    const b = Number(bankerPoint.value)
    const p = Number(playerPoint.value)
    if (b > p) {
      return "Banker"
    } else if (b < p) {
      return "Player"
    } else {
      return "Tie"
    }
  }

  function cardString(str, type) {
    let list = []
    let totalPoint = 0
    str.split("|").forEach((item, idx) => {
      if (item) {
        const detail = item.split("-")
        cardRefList.value[`${type}-${idx}`] = ref()
        totalPoint = totalPoint + Number(detail[2])
        list.push({
          cardType: detail[0],
          cardRank: detail[1],
          cardPoint: detail[2]
        })
      }
    })
    if (type === 'player') {
      playerPoint.value = totalPoint % 10
    } else {
      bankerPoint.value = totalPoint % 10
    }
    totalPoint = 0
    return list
  }
}

onBeforeMount(() => {
  if (tableRankInfo.value) {
    convertCardInfo(tableRankInfo.value)
  }
})

onMounted(() => {
  rotateAllCard()
  setTimeout(() => {
    rotateAllCard()
  }, 1000);
})

// 翻转 指定 banker 或 player 的所有卡片
function toRotate(type) {
  let rotateCardList = []
  let typeStr = ""
  if (type === 1) { // player
    rotateCardList = playerCardList.value
    typeStr = "player"
  } else if (type === 3) { // banker
    rotateCardList = bankerCardList.value
    typeStr = "banker"
  }
  for (let i = 0; i < rotateCardList.length; i++) {
    cardRefList.value[`${typeStr}-${i}`].rotate()
  }
}

function rotateAllCard() {
  toRotate(1)
  toRotate(3)
}

function setCardRefList(el, idx, type) {
  if (el) {
    cardRefList.value[type + '-' + idx] = el
  }
}

defineExpose({
  toRotate,
  rotateAllCard,
})

</script>

<template>
  <div class="table-rank-draw">
    <div class="wrap">
      <div class="player">
        <ul>
          <li v-for="(player, idx) in playerCardList" :class="{ 'li-horizontal': idx === 2 }">
            <pokerCard :ref="el => setCardRefList(el, idx, 'player')" :card-info="player" :idx="idx" />
          </li>
        </ul>
        <div class="player-text">
          <div class="zh-text">闲</div>
          <div class="en-text">PLAYER</div>
        </div>
      </div>
      <div class="rank-info">
        <div class="player-left">
          <pointerNum :point="playerPoint" side="player" />
        </div>
        <div class="winner-center">
          <winnerText :winner="winnerStr" />
        </div>
        <div class="banker-right">
          <pointerNum :point="bankerPoint" side="banker" />
        </div>
      </div>
      <div class="banker">
        <ul>
          <li v-for="(banker, idx) in bankerCardList" :class="{ 'li-horizontal': idx === 2 }">
            <pokerCard :ref="el => setCardRefList(el, idx, 'banker')" :card-info="banker" :idx="idx" />
          </li>
        </ul>
        <div class="banker-text">
          <div class="zh-text">庄</div>
          <div class="en-text">BANKER</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.table-rank-draw {
  width: 100%;
  height: 242px;
  position: fixed;
  bottom: 0;
  background: rgb(58 56 56 / 62%);
  z-index: 2;

  .wrap {
    width: 90%;
    min-width: 1100px;
    height: 242px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .player {
      width: 419px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      ul {
        display: flex;
        height: 170px;
        flex-direction: row-reverse;

        li {
          width: 100px;
          height: 142px;
          margin: 17px;

          &.li-horizontal {
            transform: rotate(90deg);
            margin-top: 38px;
            margin-right: 34px;
          }
        }
      }

      .player-text {
        padding: 5px 30px;
        text-align: center;
        border-radius: 55px;
        color: #fff;
        background: linear-gradient(148deg, rgb(98 126 238), rgb(10 23 152));
        font-size: 17px;
      }
    }

    .rank-info {
      flex: 1;
      display: flex;
      height: 242px;
      padding-top: 24px;
      justify-content: space-evenly;

      .winner-center {
        border-radius: 50%;
        display: flex;
        text-align: center;
        color: #fff;
        justify-content: space-between;

        .player-win {
          background-color: blue;
        }

        .banker-win {
          background-color: red;
        }
      }
    }

    .banker {
      display: flex;
      width: 419px;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      ul {
        display: flex;
        flex-direction: row;
        height: 170px;

        li {
          width: 100px;
          height: 142px;
          margin: 17px;

          &.li-horizontal {
            transform: rotate(90deg);
            margin-top: 38px;
            margin-right: 34px;
          }
        }
      }

      .banker-text {
        padding: 5px 30px;
        text-align: center;
        color: #fff;
        background: linear-gradient(109deg, #e56969, #a31a1b);
        font-size: 17px;
      }
    }
  }
}
</style>
