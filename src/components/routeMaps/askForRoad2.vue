<script setup>
import { ref, onMounted, toRefs, watch, nextTick } from 'vue'
// import Roadmap from '@/components/routeMaps/js/Roadmap'
import RoadmapGenerator from './roadmapGenerator';
// 庄问路 Asking for Roads for Banker
// 闲问路 Asking for Roads for Player

// 在结果是庄或闲的情况下 得到下三路的颜色 并显示
const props = defineProps({
  mapList: Array,
  roundId: String,
})

const { mapList, roundId } = toRefs(props)

const painted = ref(false)

const copyMapList = ref([])

watch(mapList, val => {
  copyMapList.value = val
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
  return mapGenerator(newList)
}

function isPlayerWin() {
  let newList = translatePossibleResultList({
    table_id: "",
    round_id: roundId,
    original_data: `{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"player_pointer\":6,\"banker_pointer\":6,\"bureau_number\":\"${roundId.value}\"}`
  })
  return mapGenerator(newList)
}

// 带有坐标的数据转入二维数组（matrix）（转入不同于转换
function fillRoadData(list, row, col) {
  let listMatrix = new Array(row).fill(0).map(() => new Array(col).fill(0))
  for (let i in list) {
    const { column, row, result } = list[i]
    listMatrix[row][column] = result
  }
}

// 将一维数组转换为二维数组（主要是 下三路的数据转换） 转换之后的数据可填入路图
function convertToMatrix(dataList, col = 20) {
  let matrix = [];
  let currentColor = '';
  let currentColumn = -1;

  for (let item of dataList) {
    if (item !== currentColor || matrix[currentColumn]?.length === 6) {
      currentColor = item;
      currentColumn++;
      matrix[currentColumn] = [];
    }

    matrix[currentColumn].push(item);
  }

  matrix = matrix.map(column => {
    while (column.length < col) {
      column.push("");
    }
    return column;
  });

  let result = [];
  for (let i = 0; i < 6; i++) {
    result[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      result[i][j] = matrix[j][i];
    }
  }

  return result;
}

function mapGenerator(result_list) {
  const roadmapGenerator = new RoadmapGenerator();
  const resultList = convertGeneralResultsList(result_list)
  const bigRoadList = roadmapGenerator.bigRoad(resultList)
  // 此数据可以填入路图
  // const bigRoadListMatrix = fillRoadData(bigRoadList, 6, 20)
  const lastBigEyeReuslt = roadmapGenerator.bigEyeRoad(roadmapGenerator.bigRoad(resultList, { columns: 40, rows: 6, scroll: false }))
  const bigEyeItem = lastBigEyeReuslt[lastBigEyeReuslt.length - 1]

  // 小路处理之后的数据
  const lastSmallRoadList = roadmapGenerator.smallRoad(roadmapGenerator.bigRoad(resultList, { columns: 20, rows: 6, scroll: false }))
  // const convertedSmallMatrix = convertToMatrix(lastSmallRoadList) // 转换成 matrix 形式的数据可以填入路图
  const SmallItem = lastSmallRoadList[lastSmallRoadList.length - 1]

  // 小强路的数据
  const cockroachRoadList = roadmapGenerator.cockroachPig(roadmapGenerator.bigRoad(resultList, { columns: 20, rows: 6, scroll: false }))
  const convertedCockroachMatrix = convertToMatrix(cockroachRoadList)
  const CockroachItem = cockroachRoadList[cockroachRoadList.length - 1]
  return {
    bigEye: bigEyeItem,
    small: SmallItem,
    cockRoach: CockroachItem
  }
}

function translatePossibleResultList(possible_data) {
  let arr = new Array()
  if (copyMapList.value && copyMapList.value.length) {
    const preMapList = JSON.parse(JSON.stringify(copyMapList.value))
    preMapList.push(possible_data)
    for (let i in preMapList) {
      const original_data = JSON.parse(preMapList[i].original_data)
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

// 转换原始数据为专用的结果列表
function convertGeneralResultsList(results) {
  //   {'outcome': 'tie', 'natural': 'none', 'pair': 'none'},
  let newArr = []
  for (let i in results) {
    newArr.push({
      outcome: (results[i].winner).toLocaleLowerCase(),
      natural: "none",
      pair: enumInfoList.pair[results[i].winner_pair_mark] || "none"
    })
  }
  return newArr
}

const isBankerWinThreeRoad = ref({})
const isPlayerWinThreeRoad = ref({})
function init(list) {
  if(list && list.length) {
    copyMapList.value = list
  }
  isBankerWinThreeRoad.value = isBankerWin()
  isPlayerWinThreeRoad.value = isPlayerWin()
}

function clear() {
  isBankerWinThreeRoad.value = {}
  isPlayerWinThreeRoad.value = {}
}

onMounted(() => {
  painted.value = false
  init()
  painted.value = true
})

defineExpose({ init, clear })
</script>

<template>
  <div class="ask-for-road">
    <div class="ask-road banker">
      <span class="banker-name">庄</span>
      <span class="big-eye-ask">
        <u v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.bigEye"
          :style="{ borderColor: isBankerWinThreeRoad.bigEye }"></u>
      </span>
      <span class="small-ask">
        <b v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.small"
          :style="{ backgroundColor: isBankerWinThreeRoad.small }"></b>
      </span>
      <span class="cock-ask">
        <i v-if="isBankerWinThreeRoad && isBankerWinThreeRoad.cockRoach"
          :style="{ borderColor: isBankerWinThreeRoad.cockRoach }"></i>
      </span>
    </div>
    <div class="ask-road player">
      <span class="player-name">闲</span>
      <span class="big-eye-ask">
        <u v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.bigEye"
          :style="{ borderColor: isPlayerWinThreeRoad.bigEye }"></u>
      </span>
      <span class="small-ask">
        <b v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.small"
          :style="{ backgroundColor: isPlayerWinThreeRoad.small }"></b>
      </span>
      <span class="cock-ask">
        <i v-if="isPlayerWinThreeRoad && isPlayerWinThreeRoad.cockRoach"
          :style="{ borderColor: isPlayerWinThreeRoad.cockRoach }"></i>
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
        font-weight: 500;
        color: #2034d9;
      }

      &.cock-ask {
        position: relative;

        i {
          position: absolute;
          top: 8px;
          left: -9px;
        }
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
