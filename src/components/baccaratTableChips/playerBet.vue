<script setup>
// P_Q_B 闲 区域 投注
import { onMounted, ref, toRefs, watch } from 'vue';
import ChipSvg from '../ChipSvg.vue';
const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000]
const props = defineProps({
  P2: Object,
  P3: Object,
  P5: Object,
  P6: Object,
  P7: Object,
  P8: Object,
  P9SB: Object,
})
const { P2, P3, P5, P6, P7, P8, P9SB } = toRefs(props)

const P9SBRef = ref()

const P2Show = ref(false)
const P3Show = ref(false)
const P5Show = ref(false)
const P6Show = ref(false)
const P7Show = ref(false)
const P8Show = ref(false)
const P9SBShow = ref(false)

// 各个区域 总金额
const P2Amount = ref(0)
const P3Amount = ref(0)
const P5Amount = ref(0)
const P6Amount = ref(0)
const P7Amount = ref(0)
const P8Amount = ref(0)
const P9SBAmount = ref(0)

// 各个区域筹码列表
const P2List = ref([])
const P3List = ref([])
const P5List = ref([])
const P6List = ref([])
const P7List = ref([])
const P8List = ref([])
const P9SBList = ref([])

// 
const P2TextPostion = ref({ x: 2, y: 2 })
const P3TextPostion = ref({ x: 2, y: 2 })
const P5TextPostion = ref({ x: 2, y: 2 })
const P6TextPostion = ref({ x: 2, y: 2 })
const P7TextPostion = ref({ x: 2, y: 2 })
const P8TextPostion = ref({ x: 2, y: 2 })
const P9SBTextPostion = ref({ x: 2, y: 2 })

function arrLastItem(arr) {
  if (arr.length === 1) return arr[0]
  return arr[arr.length - 1]
}

watch(P2, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P2.value.chips, 2)
  } else {
    P2List.value = []
    P2Amount.value = 0
  }

})
watch(P3, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P3.value.chips, 3)
  } else {
    P3List.value = []
    P3Amount.value = 0
  }
})
watch(P5, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P5.value.chips, 5)
  } else {
    P5List.value = []
    P5Amount.value = 0
  }
})
watch(P6, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P6.value.chips, 6)
  } else {
    P6List.value = []
    P6Amount.value = 0
  }
})
watch(P7, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P7.value.chips, 7)
  } else {
    P7List.value = []
    P7Amount.value = 0
  }
})
watch(P8, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P8.value.chips, 8)
  } else {
    P8List.value = []
    P8Amount.value = 0
  }
})
watch(P9SB, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(P9SB.value.chips, 9)
  } else {
    P9SBList.value = []
    P9SBAmount.value = 0
  }
})

async function convertChipListToImgList(chips, seat) {
  const chipList = preProcessChipList(chips)
  let arr = []
  let keys = Object.keys(chipList)
  if (keys.length === 0) return
  let baseY = 32
  const offset = 6
  for (let i in keys) {
    for (let k = 1; k <= chipList[keys[i]]; k++) {
      baseY = baseY - offset
      arr.push({
        src: keys[i],
        x: 5,
        y: baseY
      })
    }
  }
  switch (seat) {
    case 2:
      P2List.value = arr
      P2Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P2Show.value = arr.length ? true : false
      P2TextPostion.value = {
        y: arrLastItem(P2List.value).y + offset
      }
      break;
    case 3:
      P3List.value = arr
      P3Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P3Show.value = arr.length ? true : false
      P3TextPostion.value = {
        y: arrLastItem(P3List.value).y + offset
      }
      break;
    case 5:
      P5List.value = arr
      P5Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P5Show.value = arr.length ? true : false
      P5TextPostion.value = {
        y: arrLastItem(P5List.value).y + offset
      }
      break;
    case 6:
      P6List.value = arr
      P6Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P6Show.value = arr.length ? true : false
      P6TextPostion.value = {
        y: arrLastItem(P6List.value).y + offset
      }
      break;
    case 7:
      P7List.value = arr
      P7Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P7Show.value = arr.length ? true : false
      P7TextPostion.value = {
        y: arrLastItem(P7List.value).y + offset
      }
      break;
    case 8:
      P8List.value = arr
      P8Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P8Show.value = arr.length ? true : false
      P8TextPostion.value = {
        y: arrLastItem(P8List.value).y + offset
      }
      break;
    case 9:
      P9SBList.value = arr
      P9SBAmount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      P9SBShow.value = arr.length ? true : false
      P9SBTextPostion.value = {
        y: arrLastItem(P9SBList.value).y
      }
      break;

    default:
      break;
  }
}

// 当筹码的总数量为6时，将最小的且相同的筹码数量合并为一个大面值的筹码 相加合并的面值必须等于 all_chip_range 其中一个子项
function preProcessChipList(chips) {
  let totalValue = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
  let newChips = {};
  for (let i = all_chip_range.length - 1; i >= 0; i--) {
    let chipValue = all_chip_range[i];
    let count = Math.floor(totalValue / chipValue);
    if (count > 0) {
      newChips[chipValue] = Math.min(count, 5);
      totalValue -= newChips[chipValue] * chipValue;
      if (totalValue === 0) break;
    }
  }
  return newChips;
}


async function convertPlayerBetChips() {
  await convertChipListToImgList(P2.value.chips, 2)
  await convertChipListToImgList(P3.value.chips, 3)
  await convertChipListToImgList(P5.value.chips, 5)
  await convertChipListToImgList(P6.value.chips, 6)
  await convertChipListToImgList(P7.value.chips, 7)
  await convertChipListToImgList(P8.value.chips, 8)
  await convertChipListToImgList(P9SB.value.chips, 9)
}

onMounted(async () => {
  await convertPlayerBetChips()
})

</script>

<template>
  <g data-v-c443f642="" transform="translate(98,0)" class="fade-in" ref="P9SBRef" id="P9SB" v-if="P9SBAmount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_2006">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_2006)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P9SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.344000244140624" :y="P9SBTextPostion.y - 4" rx="4" ry="4" width="29.311999511718753"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P9SBTextPostion.y + 6" text-anchor="middle" font-size="10px" class="normal-text">{{
      P9SBAmount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(12,155)" class="fade-in" id="P8" v-if="P8Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_1998">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_1998)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P8List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="2.944000244140625" :y="P8TextPostion.y - 6" rx="4" ry="4" width="34.11199951171875"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P8TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P8Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(251,188)" class="fade-in" id="P7" v-if="P7Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_2014">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_2014)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P7List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="2.944000244140625" :y="P7TextPostion.y - 6" rx="4" ry="4" width="34.11199951171875"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P7TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P7Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(452,193)" class="fade-in" id="P6" v-if="P6Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_1990">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_1990)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P6List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="2.944000244140625" :y="P6TextPostion.y - 6" rx="4" ry="4" width="34.11199951171875"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P6TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P6Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(612,193)" class="fade-in" id="P5" v-if="P5Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_2054">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_2054)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P5List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="3.740002441406247" :y="P5TextPostion.y - 6" rx="4" ry="4" width="32.519995117187506"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P5TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P5Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(813,188)" class="fade-in" id="P3" v-if="P3Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_2046">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_2046)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P3List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="3.740002441406247" :y="P3TextPostion.y - 6" rx="4" ry="4" width="32.519995117187506"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P3TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P3Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(1052,155)" class="fade-in" id="P2" v-if="P2Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 34px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_1982">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_1982)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0z"></path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in P2List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="3.740002441406247" :y="P2TextPostion.y - 6" rx="4" ry="4" width="32.519995117187506"
      height="14" class="normal-rect"></rect>
    <text data-v-c443f642="" x="20" :y="P2TextPostion.y + 4" text-anchor="middle" font-size="10px" class="normal-text">{{
      P2Amount }}</text>
  </g>
</template>

<style scoped lang="less">
.normal-rect {
  fill: #fff;
  opacity: .6;
}

text {
  text-shadow: none;
  text-anchor: middle;
  font-size: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  user-select: none;
  text-shadow: none;
  fill: #000;
  box-sizing: border-box;
}

.normal-text {
  fill: #000;
}
</style> 
