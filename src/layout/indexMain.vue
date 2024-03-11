<template>
  <div class="lobby">
    <homeHeader />
    <homeContent />
  </div>
</template>
<script setup>
import { onMounted, ref, reactive, onBeforeMount } from 'vue';
import homeHeader from '@/components/homeHeader.vue'
import homeContent from '@/components/homeContent.vue'
import routeMap from '@/components/routeMaps/index.vue'
const mapList = ref([])
const routeMapRef = ref(null)

onBeforeMount(() => {
  // mapList.value = []
})
onMounted(() => {

})

function reDraw() {
  mapList.value = [{
    winner: "Player",
    isPair: "Banker",
    color: "#f00",
    text: "闲"
  },]
  routeMapRef.value.reDrawCanvas()
}

</script>
<style scoped lang="less">
.lobby {
  width: 100%;
  // min-height: 768px;

  .casino-select {
    display: flex;
    flex-wrap: wrap;
    width: 430px;
  }

  .casino-item {
    width: 200px;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      vertical-align: -webkit-baseline-middle;
    }

    .item-logo .item-name {
      display: flex;
      position: absolute;
      color: #fff;
      font-size: 12px;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 70px;
      height: 50px;
    }

    &::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background-image: linear-gradient(0deg, rgba(153, 102, 6, .52), #fffbf5 51%, hsla(30, 60%, 79%, .4));
      z-index: -1;
      opacity: 0;
      border-radius: 4px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: -70px;
      bottom: 0;
      background-image: linear-gradient(90deg, transparent 35%, #000 60%, #000);
      border-radius: 4px;
    }
  }
}
</style>
