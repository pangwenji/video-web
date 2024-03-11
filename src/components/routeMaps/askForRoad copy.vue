<script setup>
import { ref, onMounted, toRefs, watch, nextTick } from 'vue'
import { fabric } from 'fabric'
import Roadmap from '@/components/routeMaps/js/Roadmap'

// 庄问路 Asking for Roads for Banker
// 闲问路 Asking for Roads for Player

// 在结果是庄或闲的情况下 得到下三路的颜色 并显示
const props = defineProps({
  mapList: Array,
  roundId: String,
})

const { mapList, roundId } = toRefs(props)

const roadCanvas = ref()

const roadSize = ref({
  width: 170,
  height: 240
})
const roadId = ref(`roadId-${roundId.value || +new Date()}`)

watch(mapList, (newVal, oldVal) => {
  reDrawCanvas()
})

const gridSize = 210 / 3
const bankerAskDataOptions = {
  bigEyeOptions: {
    top: 30 + gridSize / 7.5,
    left: gridSize / 8,
    radius: gridSize / 2.5,
    strokeWidth: 4,
    fill: 'transparent'
  },
  smallRoadOptions: {
    top: gridSize + 30,
    left: 0,
    radius: gridSize / 2.5 + 3,
  },
  cockroachOptions: {
    top: gridSize * 2.05 + 30,
    left: 7,
    width: gridSize,
    height: gridSize,
    radius: gridSize / 2,
  },
}

const playerAskDataOptions = {
  bigEyeOptions: {
    top: 30 + gridSize / 7.5,
    left: gridSize + gridSize / 7,
    radius: gridSize / 2.5,
    strokeWidth: 4,
    fill: 'transparent'
  },
  smallRoadOptions: {
    top: gridSize + 30,
    left: gridSize,
    radius: gridSize / 2.5 + 3,
  },
  cockroachOptions: {
    top: gridSize * 2.05 + 30,
    left: gridSize + gridSize / 9,
    width: gridSize / 2.5,
    height: gridSize / 2.5,
    radius: gridSize / 2,
  },
}

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

function fillBigEyeRoadData(bigEyeMatrixData, options) {
  const item = bigEyeMatrixData
  if (item && item.eyeColor) {
    const sharp = new fabric.Circle({
      ...options,
      width: 50,
      height: 50,
      stroke: item.eyeColor,
    })
    roadCanvas.value.add(sharp)
  }
}

function fillSmallRoadData(smallMatrixData, options) {
  if (smallMatrixData && smallMatrixData.smallRoadColor) {
    const sharp = new fabric.Circle({
      ...options,
      width: gridSize,
      height: gridSize,
      fill: smallMatrixData.smallRoadColor
    })
    roadCanvas.value.add(sharp)
  }
}

function fillCockroachRoadData(CockroachRoadMatrixData, options) {
  const sharp = new fabric.Circle({
    ...options,
    fill: CockroachRoadMatrixData.cockroachColor
  })
  const lineStartX = sharp.left + 4
  const lineStartY = sharp.top + sharp.height - 15
  const lineEndX = sharp.left + sharp.width - 17
  const lineEndY = sharp.top + 5
  const line = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
    stroke: CockroachRoadMatrixData.cockroachColor,
    strokeWidth: 4,
  });
  roadCanvas.value.add(line)
}

function createBg() {
  // 画标题
  const textHeaderRectBanker = new fabric.Rect({
    left: 0,
    top: 0,
    fill: '#efefef',
    width: gridSize,
    height: 30,
    stroke: "#dedede",
  })
  const textHeaderRectPlayer = new fabric.Rect({
    left: gridSize,
    top: 0,
    fill: '#efefef',
    width: gridSize,
    height: 30,
    stroke: "#dedede",
  })
  roadCanvas.value.add(textHeaderRectBanker)
  roadCanvas.value.add(textHeaderRectPlayer)
  // banker
  const textBanker = new fabric.Text('Banker', {
    top: 5,
    left: 170 / 12,
    fontSize: 15,
    fill: 'red',
  })
  // player
  const textPlayer = new fabric.Text('Player', {
    top: 5,
    left: 170 / 12 + (gridSize),
    fontSize: 15,
    fill: 'blue',
  })
  roadCanvas.value.add(textBanker)
  roadCanvas.value.add(textPlayer)
  // 画格子
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      roadCanvas.value.add(new fabric.Rect({
        left: j * 70,
        top: i * 70 + 30,
        fill: '#efefef',
        width: 70,
        height: 70,
        stroke: "#dedede",
      }))
    }
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
  // console.log('庄为结果的下三路的数据的颜色', `${threeRoadData.bigeyeItemData ? threeRoadData.bigeyeItemData.eyeColor : ""}==${threeRoadData.smallroadItemData ? threeRoadData.smallroadItemData.smallRoadColor : ""}==${threeRoadData.cockroachPigItemData ? threeRoadData.cockroachPigItemData.cockroachColor : ""}`);
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
  // console.log('闲为结果的下三路的数据的颜色', `${threeRoadData.bigeyeItemData ? threeRoadData.bigeyeItemData.eyeColor : ""}==${threeRoadData.smallroadItemData ? threeRoadData.smallroadItemData.smallRoadColor : ""}==${threeRoadData.cockroachPigItemData ? threeRoadData.cockroachPigItemData.cockroachColor : ""}`);
  return threeRoadData
}

function translatePossibleResultList(possible_data) {
  let arr = new Array()
  const preMapList = JSON.parse(JSON.stringify(mapList.value))
  preMapList.push(possible_data)
  for (let i in preMapList) {
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
  return arr
}

// 从roadmap中取 下三路的图 并取最后一个有值的项
function getRouteAttr(route_map) {
  const routeArr = {
    bigeyeItemData: {},
    smallroadItemData: {},
    cockroachPigItemData: {},
  }
  const { bigeyeboy, smallroad, cockroachPig } = route_map
  routeArr.bigeyeItemData = findLastValueInLastNonEmptyColumn(bigeyeboy.matrix)
  routeArr.smallroadItemData = findLastValueInLastNonEmptyColumn(smallroad.matrix)
  routeArr.cockroachPigItemData = findLastValueInLastNonEmptyColumn(cockroachPig.matrix)
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

function draw() {
  // 画格子
  createBg()
  drawBankerAsk()
  drawPlayerAsk()
}

function drawBankerAsk() {
  const { bigeyeItemData, cockroachPigItemData, smallroadItemData } = isBankerWinThreeRoad.value
  // 填入 数据
  bigeyeItemData && fillBigEyeRoadData(bigeyeItemData, bankerAskDataOptions.bigEyeOptions)
  smallroadItemData && fillSmallRoadData(smallroadItemData, bankerAskDataOptions.smallRoadOptions)
  cockroachPigItemData && fillCockroachRoadData(cockroachPigItemData, bankerAskDataOptions.cockroachOptions)
}

function drawPlayerAsk() {
  const { bigeyeItemData, cockroachPigItemData, smallroadItemData } = isPlayerWinThreeRoad.value
  // 填入数据
  bigeyeItemData && fillBigEyeRoadData(bigeyeItemData, playerAskDataOptions.bigEyeOptions)
  smallroadItemData && fillSmallRoadData(smallroadItemData, playerAskDataOptions.smallRoadOptions)
  cockroachPigItemData && fillCockroachRoadData(cockroachPigItemData, playerAskDataOptions.cockroachOptions)
}

function reDrawCanvas() {
  if (roadCanvas && roadCanvas.value) {
    roadCanvas.value.clear()
    init()
    draw()
  }
}

onMounted(() => {
  roadCanvas.value = new fabric.StaticCanvas(document.querySelector(`[data-set='${roadId.value}']`))
  nextTick(() => {
    init()
    draw()
  })
})

defineExpose({
  draw,
  reDrawCanvas,
})

</script>

<template>
  <canvas class="ask-for-road" :width="roadSize.width" :height="roadSize.height" :data-set='roadId'></canvas>
</template>

<style scoped lang="less">
.ask-for-road {
  will-change: transform;
  transform-origin: top left;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
