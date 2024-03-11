<script setup>
import { toRefs, ref, onMounted } from 'vue';
const props = defineProps({
  chipOpt: {
    type: Object,
    required: true
  }
})
const { chipOpt } = toRefs(props)
const chipPath = ref()
onMounted(async () => {
  if(!chipOpt.value.chipType) {
    chipPath.value = await loadSvg(`icon_chips_${chipOpt.value.path}`)
  }else {
    chipPath.value = await loadSvg(`${chipOpt.value.chipType}/icon_chips_${chipOpt.value.path}`)
  }
})
async function loadSvg(chip) {
  const module = await import(`@/assets/images/svgFiles/${chip}.svg`)
  return module.default.replace(/^\/@fs/, '')
}

</script>

<template>
  <image data-v-c443f642="" :x="chipOpt.x" :y="chipOpt.y" width="30" height="16"
    :xlink:href="chipPath"></image>
</template>

<style scoped lang="less">
</style>
