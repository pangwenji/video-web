<script setup>
import { ref, onMounted, toRefs, watch, nextTick } from 'vue'
import Roadmap from '@/components/routeMaps/js/Roadmap'

// 庄问路 Asking for Roads for Banker
// 闲问路 Asking for Roads for Player

// 在结果是庄或闲的情况下 得到下三路的颜色 并显示
const props = defineProps({
  mapList: Array,
  roundId: String,
})

const { mapList, roundId } = toRefs(props)

watch(mapList, (newVal, oldVal) => {
  init()
})

// 设置 庄闲和对应的颜色
const colorRec = {
  "Player": "#2033d9",
  "Banker": "#d9202c",
  "Tie": "#21d924",
}

const enumInfoList = {
  winner: {
    '1': {
      name: "Player",
      text: "闲",
    },
    "2": {
      name: "Tie",
      text: "和"
    },
    "3": {
      name: "Banker",
      text: "庄",
    }
  },
  pair: {
    "1": "", // 没有对子
    "2": "Player", // 闲家对子
    "3": "Banker", //庄家对子
    "4": "Player,Banker", // 庄家闲家都是对子
  }
}

function isBankerWin() {
  let newList = translatePossibleResultList({
    table_id: "",
    round_id: roundId.value,
    original_data: `{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"player_pointer\":4,\"banker_pointer\":0,\"bureau_number\":\"${roundId.value}\"}`
  })
  const bannerWinRoadMapResults = new Roadmap({
    results: newList
  })
  bannerWinRoadMapResults.update()
  const threeRoadData = getRouteAttr(bannerWinRoadMapResults)
  // console.log('庄为结果的下三路的数据的颜色', threeRoadData);
  return threeRoadData
}

function isPlayerWin() {
  let newList = translatePossibleResultList({
    table_id: "",
    round_id: roundId,
    original_data: `{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"player_pointer\":6,\"banker_pointer\":6,\"bureau_number\":\"${roundId.value}\"}`
  })
  const playerWinRoadMapResults = new Roadmap({
    results: newList
  })
  playerWinRoadMapResults.update()
  const threeRoadData = getRouteAttr(playerWinRoadMapResults)
  // console.log('闲为结果的下三路的数据的颜色', threeRoadData);
  return threeRoadData
}

function translatePossibleResultList(possible_data) {
  let arr = new Array()
  const preMapList = JSON.parse(JSON.stringify(mapList.value))
  preMapList.push(possible_data)
  for (let i in preMapList) {
    if(preMapList[i].original_data) {
      const original_data = JSON.parse(preMapList[i].original_data)
      const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark]
      const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark]
      arr.push({
        ...original_data,
        winner: winnerEnumInfo.name,
        isPair: isPairEnumInfo,
        color: colorRec[winnerEnumInfo.name],
        text: winnerEnumInfo.text,
      })
    }
  }
  return arr
}

// 从roadmap中取 下三路的图 并取最后一个有值的项
function getRouteAttr(route_map) {
  const routeArr = {
    lastBigEyeItem: {},
    lastSmallItem: {},
    lastCockroachItem: {},
  }
  const { bigeyeboy, smallroad, cockroachPig } = route_map
  routeArr.lastBigEyeItem = bigeyeboy.lastBigEyeItem
  routeArr.lastSmallItem = smallroad.lastSmallItem
  routeArr.lastCockroachItem = cockroachPig.lastCockroachItem
  return routeArr
}

// 从结果矩阵中的下三路结果中 取最新更新的值 
function findLastValueInLastNonEmptyColumn(matrix) {
  let lastNonEmptyColumn = -1
  matrix.forEach(row => {
    row.forEach((item, index) => {
      if (item !== null && item !== undefined && item !== 0) {
        lastNonEmptyColumn = Math.max(lastNonEmptyColumn, index)
      }
    })
  })
  if (lastNonEmptyColumn === -1) {
    return null
  }
  let lastValue = null
  let lastValueRow = -1
  matrix.forEach((row, rowIndex) => {
    const item = row[lastNonEmptyColumn]
    if (item !== null && item !== undefined && item !== 0) {
      lastValue = item
      lastValueRow = rowIndex
    }
  })

  if (lastValue !== null) {
    return lastValue
  } else {
    return null
  }
}
const isBankerWinThreeRoad = ref({})
const isPlayerWinThreeRoad = ref({})
function init() {
  isBankerWinThreeRoad.value = isBankerWin()
  isPlayerWinThreeRoad.value = isPlayerWin()
}

function clear() {
  isBankerWinThreeRoad.value = {}
  isPlayerWinThreeRoad.value = {}
}

onMounted(() => {
  nextTick(() => {
    init()
  })
})

defineExpose({ init, clear })

</script>

<template>
  <div class="ask-for-road">
    <div class="ask-road banker">
      <span class="banker-name">庄</span>
      <span class="big-eye-ask">
        <u v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.lastBigEyeItem"
          :style="{ borderColor: isBankerWinThreeRoad.lastBigEyeItem.eyeColor }"></u>
      </span>
      <span class="small-ask">
        <b v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.lastSmallItem"
          :style="{ backgroundColor: isBankerWinThreeRoad.lastSmallItem.smallRoadColor }"></b>
      </span>
      <span class="cock-ask">
        <i v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.lastCockroachItem"
          :style="{ borderColor: isBankerWinThreeRoad.lastCockroachItem.cockroachColor }"></i>
      </span>
    </div>
    <div class="ask-road player">
      <span class="player-name">闲</span>
      <span class="big-eye-ask">
        <u v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.lastBigEyeItem"
          :style="{ borderColor: isPlayerWinThreeRoad.lastBigEyeItem.eyeColor }"></u>
      </span>
      <span class="small-ask">
        <b v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.lastSmallItem"
          :style="{ backgroundColor: isPlayerWinThreeRoad.lastSmallItem.smallRoadColor }"></b>
      </span>
      <span class="cock-ask">
        <i v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.lastCockroachItem"
          :style="{ borderColor: isPlayerWinThreeRoad.lastCockroachItem.cockroachColor }"></i>
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
.ask-for-road {
  will-change: transform;
  background-color: #fff;
  transform-origin: top left;
  margin-left: 15px;
  margin-right: 15px;
  width: 30px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: -1px 0px 4px #7c7c7c;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 3px;

  .ask-road {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      flex: 1;
      height: 28.5px;
      &.banker-name {
        color: #da202c;
        font-weight: 500;
      }
      &.player-name {
        color: #2034d9;
        font-weight: 500;
      }
    }

    u {
      display: block;
      width: 17px;
      height: 17px;
      border-radius: 17px;
      border: 1px solid;
    }

    b {
      display: block;
      width: 17px;
      height: 17px;
      border-radius: 17px;
      background-color: #0f0;
    }

    i {
      display: block;
      width: 17px;
      border: 1px solid #00f;
      transform: rotate(318deg);
    }
  }
}
</style>
