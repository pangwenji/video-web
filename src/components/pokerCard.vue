<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
const props = defineProps({
  cardInfo: Object,
  idx: Number
})

const cardNum = {
  "1": "diamond",
  "2": "club",
  "3": "spade",
  "4": "heart"
}

const thisRef = ref()

async function loadSvg(svgName) {
  try {
    const module = await import(`@/assets/pokerCard/${svgName}.svg`)
    return module.default.replace(/^\/@fs/, '')
  } catch (error) {
    return ""
  }
}

const { cardType, cardRank, cardPoint } = toRefs(props).cardInfo.value
// const idx = toRefs(props).idx
// cardType
// 1 方块
// 2 梅花
// 3 黑桃
// 4 红桃
// bankerCard": "4-8-8|4-9-9", 花色-牌号-点数
const cardName = ref(`${cardNum[cardType]}-${cardRank}`)
const cardPath = ref('')
const cardBg = ref('')
const bgName = ''; // 扑克牌背面
// 是否需要将卡片水平放置
const scaleCard = ref()
onMounted(async () => {
  cardPath.value = await loadSvg(cardName.value)
  cardBg.value = await loadSvg(`poker-bg-${bgName || 1}`)
  scaleCard.value = `transform: scale(${Math.min(thisRef.value.parentNode.clientWidth/thisRef.value.clientWidth, thisRef.value.parentNode.clientHeight, thisRef.value.clientWidth)}); transform-origin: left top;`
})
const isRotate = ref(false)
// 正反旋转
function rotate() {
  isRotate.value = !isRotate.value
}
function setRef(el) {
  if(el && !thisRef.value) {
    thisRef.value = el
  }
}
defineExpose({ rotate })
</script>

<template>
  <div class="card" :style="scaleCard" :ref="el=> setRef(el)" :class="{ rotateCard: isRotate}">
    <div class="card-face card-front">
      <img :src="cardPath" :data-cardName="cardPath" :alt="cardPath">
    </div>
    <div class="card-face card-back">
      <img :src="cardBg" class="" alt="card-bg">
    </div>
  </div>
</template>

<style scoped lang="less">
.card {
  width: 234px;
  height: 333px;
  perspective: 1000px;

  &.horizontal {
    transform: rotate(90deg);
  }
}

/* 正面和背面的共同样式 */
.card-face {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  /* 隐藏翻转的背面 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s;
}

/* 正面样式 */
.card-front {
  background: white;
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
}

.rotateCard {
  .card-front {
    transform: rotateY(-180deg);
  }

  .card-back {
    transform: rotateY(0deg);
  }
}
</style>
