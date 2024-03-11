<script setup>
import { ref, onMounted, toRefs, watch } from 'vue'
// 直播播放器
const props = defineProps({
  liveInfo: Object
})

const { liveInfo } = toRefs(props)


onMounted(()=> {
  
})

</script>

<template>
  <div class="player-wrap"></div>
</template>

<style scoped lang="less">
</style>
