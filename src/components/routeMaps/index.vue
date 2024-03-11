<script setup>
import { ref, onMounted, toRefs, watch, onBeforeMount, nextTick } from 'vue'
import { fabric } from 'fabric'
import Roadmap from '@/components/routeMaps/js/Roadmap'

const props = defineProps({
  mapList: Array,
  mapId: String,
})

const { mapList, mapId } = toRefs(props)

const roadMap = ref()

const copyMapList = ref([])

// 画布元素缓存
const canvasCacheObj = ref([])

watch(mapList, (val) => {
  if (mapList.value && Array.isArray(mapList.value)) {
    copyMapList.value = mapList.value
    init()
  }
})

function init() {
  const convertedData = convertOriginalData()
  roadMap.value = new Roadmap({
    results: convertedData
  })
  if (mainCanvas.value) {
    roadMap.value.update()
  }
  draw()
}

// 转换原始数据
function convertOriginalData() {
  // console.log('init-即将处理的数据', copyMapList.value, mapList.value);
  const dataList = copyMapList.value.length ? copyMapList.value : mapList.value
  let arr = new Array()
  for (let i in dataList) {
    if (dataList[i].original_data) {
      const original_data = JSON.parse(dataList[i].original_data)
      const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark]
      const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark]
      arr.push({
        // ...original_data,
        winner: winnerEnumInfo.name,
        isPair: isPairEnumInfo,
        color: colorRec[winnerEnumInfo.name],
        text: winnerEnumInfo.text,
      })
    }
  }
  return arr
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

const mainCanvas = ref(null)

// 珠盘路
const beadPlateRect = ref(null)
const beadPlateOptions = ref({
  rowNum: 6,
  columnNum: 6,
  gridSize: 54
})

// 大路
const bigRoadRect = ref(null)
const bigRoadOptions = ref({
  rowNum: 6,
  columnNum: 20,
  gridSize: 27
})

// 大眼路
const bigEyeRect = ref(null)
const bigEyeOptions = ref({
  rowNum: 3,
  columnNum: 20,
  gridSize: 27
})

// 小路
const smallRoadRect = ref(null)
const smallRoadOptions = ref({
  rowNum: 3,
  columnNum: 10,
  gridSize: 27
})

// 小强路
const cockroachRoadRect = ref(null)
const cockroachRoadOptions = ref({
  rowNum: 3,
  columnNum: 10,
  gridSize: 27
})

function createBeadPlateBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = beadPlateOptions.value
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: j * gridSize,
        top: i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createBigRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createBigEyeBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigEyeOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const topBase = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createSmallRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createCockroachRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum
  const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}


// 画整个格子
function createMapPlaces() {
  createBeadPlateBlock()
  createBigRoadBlock()
  createBigEyeBlock()
  createSmallRoadBlock()
  createCockroachRoadBlock()
}

function fillBeadPlateData(beadPlateMatrixData) {
  const { matrix } = beadPlateMatrixData
  if (!matrix || matrix.length === 0) {
    return
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[j] && matrix[j][i]) {
        const { winner, isPair, text } = matrix[j][i]
        // 创建图形
        const shape = new fabric.Circle({
          radius: 20,
          top: j * 53.3,
          left: i * 53.3,
          width: 53.3,
          height: 53.3,
          fill: colorRec[winner],
        });
        const winnerText = new fabric.Text(`${matrix[j][i].text}`)
        winnerText.textAlign = 'center';
        winnerText.textBaseline = 'middle';
        winnerText.fill = '#fff'
        winnerText.fontSize = '26'
        winnerText.centerX = shape.left + shape.width / 2
        winnerText.centerY = shape.top + shape.height / 2
        winnerText.left = winnerText.centerX - winnerText.width / 2 + 7 // 设置了文本大小 修改位移
        winnerText.top = winnerText.centerY - winnerText.height / 2 + 8
        mainCanvas.value.add(shape);
        mainCanvas.value.add(winnerText);
        canvasCacheObj.value.push(shape)
        canvasCacheObj.value.push(winnerText)
        // 检查 是否对子 庄对子/闲对子 位置左上角
        if (isPair.indexOf('Banker') >= 0) {
          // 闲家是对子
          const bankerPairCircle = new fabric.Circle({
            radius: 5,
            top: j * 53 + 6,
            left: i * 53 + 6,
            stroke: '#fff',
            fill: colorRec["Banker"]
          })
          mainCanvas.value.add(bankerPairCircle)
          canvasCacheObj.value.push(bankerPairCircle)
        }

        if (isPair.indexOf('Player') >= 0) {
          // 闲家是对子  位置右下角
          const playerPairCircle = new fabric.Circle({
            radius: 5,
            top: shape.top + shape.height - 16,
            left: shape.left + shape.width - 16,
            stroke: '#fff',
            fill: colorRec["Player"]
          })
          mainCanvas.value.add(playerPairCircle)
          canvasCacheObj.value.push(playerPairCircle)
        }
      }
    }
  }
}

function fillBigRoadData(bigRoadMatrixData) {
  const { matrix, cols, rows } = bigRoadMatrixData
  if (!matrix || matrix.length === 0) {
    return;
  }
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = 0
  const { gridSize, columnNum, rowNum } = bigRoadOptions.value
  for (let i = 0; i < matrix.length; i++) {
    // let tieNum = 0
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j];
      if (item) {
        let winner = item.winner;
        let isTie = item.isTie || false;
        // 创建图形
        const shape = new fabric.Circle({
          radius: 10,
          top: i * gridSize,
          left: j * gridSize + baseLeft,
          width: gridSize,
          height: gridSize,
          // strokeWidth: 2, // 圆环的宽度
          stroke: colorRec[winner], // 圆环的颜色
          fill: 'transparent', // 内部填充透明
        });
        mainCanvas.value.add(shape);
        canvasCacheObj.value.push(shape)

        // 添加 是否 有对子
        if (item.isPair) {
          if (item.isPair.indexOf("Banker") >= 0) {
            const bankerPairCircle = new fabric.Circle({
              radius: 5,
              top: i * 27,
              left: baseLeft + j * 27,
              stroke: "#fff",
              fill: colorRec['Banker']
            })
            mainCanvas.value.add(bankerPairCircle)
            canvasCacheObj.value.push(bankerPairCircle)
          }

          if (item.isPair.indexOf("Player") >= 0) {
            const playerPairCircle = new fabric.Circle({
              radius: 5,
              top: shape.top + shape.height - 10,
              left: baseLeft + 27 * (j + 1) - 10,
              stroke: "#fff",
              fill: colorRec['Player']
            })
            mainCanvas.value.add(playerPairCircle)
            canvasCacheObj.value.push(playerPairCircle)
          }
        }

        // 如果有和局，添加和局标记
        if (isTie) {
          // tieNum += 1
          const tieText = new fabric.Text(`${item.tie_count}`, {
            fontSize: 16,
            fill: '#1d8919',
            left: shape.left + shape.width / 2 - 4,
            top: shape.top + shape.height / 2 - 9
          });
          mainCanvas.value.add(tieText)
          canvasCacheObj.value.push(tieText)
          // 计算线的起始和结束点
          const lineStartX = shape.left + shape.width / 2;
          const lineStartY = shape.top + shape.height;
          const lineEndX = shape.left + shape.width;
          const lineEndY = shape.top + shape.height / 2;
          const tieLine = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
            stroke: "#1d8919",
            strokeWidth: 2
          });
          mainCanvas.value.add(tieLine);
          canvasCacheObj.value.push(tieLine)
          // tieNum = 0
        }
      }
    }
  }
}

function fillBigEyeRoadData(bigEyeMatrixData) {
  const { matrix, cols, rows } = bigEyeMatrixData
  if (!matrix || matrix.length === 0) {
    return
  }
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          stroke: item.eyeColor,
          fill: 'transparent',
        })
        mainCanvas.value.add(sharp)
        canvasCacheObj.value.push(sharp)
      }
    }
  }
}

function fillSmallRoadData(smallMatrixData) {
  const { matrix, cols, rows } = smallMatrixData
  if (!matrix || matrix.length === 0) {
    return
  }
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          fill: item.smallRoadColor
        })
        mainCanvas.value.add(sharp)
        canvasCacheObj.value.push(sharp)
      }
    }
  }
}

function fillCockroachRoadData(CockroachRoadMatrixData) {
  const { matrix, cols, rows } = CockroachRoadMatrixData
  if (!matrix || matrix.length === 0) {
    return
  }
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          fill: item.cockroachColor
        })
        const lineStartX = sharp.left
        const lineStartY = sharp.top + sharp.height * .8
        const lineEndX = sharp.left + sharp.width * .8
        const lineEndY = sharp.top
        const line = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
          stroke: item.cockroachColor,
          strokeWidth: 2,
        });
        mainCanvas.value.add(line)
        canvasCacheObj.value.push(line)
      }
    }
  }
}

function draw() {
  // 画格子
  createMapPlaces()
  roadMap.value.update()
  // 填入 珠盘图 矩阵数据
  roadMap.value && fillBeadPlateData(roadMap.value.breadplate)
  // 填入 大路图 数据
  roadMap.value && fillBigRoadData(roadMap.value.bigroad)
  // 填入 大眼图 数据
  roadMap.value && fillBigEyeRoadData(roadMap.value.bigeyeboy)
  // 填入 小路图 数据
  roadMap.value && fillSmallRoadData(roadMap.value.smallroad)
  // 填入 小强路 数据
  roadMap.value && fillCockroachRoadData(roadMap.value.cockroachPig)
}

function updateMapList(round_item) {
  if (round_item) {
    roadMap.value.push(round_item)
    roadMap.value.update()
    if (mainCanvas && mainCanvas.value) {
      mainCanvas.value.clear()
      draw()
    }
  }
}

// 清空画布缓存
function clearCache() {
  if (canvasCacheObj.value && canvasCacheObj.value.length) {
    for (let i = 0; i < canvasCacheObj.value.length; i++) {
      mainCanvas.value.remove(canvasCacheObj.value[i])
    }
    canvasCacheObj.value = []
  }
}

function reDrawCanvas(list) {
  if (mainCanvas && mainCanvas.value) {
    mainCanvas.value.clear()
    clearCache()
    if (list && list.length) {
      copyMapList.value = list
    }
    init()
    // draw()
  }
}

onMounted(() => {
  // mainCanvas.value = new fabric.Canvas(document.querySelector(`[data-set='${mapId.value}']`))
  mainCanvas.value = new fabric.StaticCanvas(document.querySelector(`[data-set='${mapId.value}']`))
  nextTick(() => {
    init()
    draw()
  })
})

defineExpose({
  draw,
  reDrawCanvas,
  updateMapList
})

</script>

<template>
  <canvas id="route-map" class="route-map" :data-set="mapId" width="864" height="324"></canvas>
</template>

<style scoped lang="less">
#route-map {
  will-change: transform;
  transform-origin: top left;
}
</style>
