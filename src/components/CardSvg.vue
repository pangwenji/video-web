<script setup>
import { toRefs, ref, onMounted } from 'vue';
const props = defineProps({
  cardOptions: {
    type: Object,
    required: true
  }
})
const { cardOptions } = toRefs(props)
onMounted(async()=> {
  console.log('onMounted-cardOptions', cardOptions);
  cardPath.value =  await loadSvg(`${cardOptions.value.type || "spade"}-${cardOptions.value.point || 'Q'}`)
})
const cardPath = ref()
async function loadSvg(svgName) {
  const module = await import(`@/assets/pokerCard/${svgName}.svg`)
  return module.default.replace(/^\/@fs/, '')
}

</script>

<template>
  <div class="card">
    <img :src="cardPath" alt="">
  </div>
</template>

<style scoped lang="less">
.card {
  width: 234px;
  height: 333px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
