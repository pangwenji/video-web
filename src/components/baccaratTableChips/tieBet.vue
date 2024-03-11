<script setup>
// T_Q_B 和 区域 投注
import { onMounted, ref, toRefs, watch } from 'vue';
import ChipSvg from '../ChipSvg.vue';
const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000]
const props = defineProps({
  T1: Object,
  T2: Object,
  T3: Object,
  T5: Object,
  T6: Object,
  T7: Object,
  T8: Object,
  T9SB: Object,
})
const { T1, T2, T3, T5, T6, T7, T8, T9SB } = toRefs(props)
const T1Show = ref(false)
const T2Show = ref(false)
const T3Show = ref(false)
const T5Show = ref(false)
const T6Show = ref(false)
const T7Show = ref(false)
const T8Show = ref(false)
const T9SBShow = ref(false)

// 各个区域 总金额
const T1Amount = ref(0)
const T2Amount = ref(0)
const T3Amount = ref(0)
const T5Amount = ref(0)
const T6Amount = ref(0)
const T7Amount = ref(0)
const T8Amount = ref(0)
const T9SBAmount = ref(0)

// 各个区域筹码列表
const T1List = ref([])
const T2List = ref([])
const T3List = ref([])
const T5List = ref([])
const T6List = ref([])
const T7List = ref([])
const T8List = ref([])
const T9SBList = ref([])

// 
const T1TextPostion = ref({ x: 2, y: 2 })
const T2TextPostion = ref({ x: 2, y: 2 })
const T3TextPostion = ref({ x: 2, y: 2 })
const T5TextPostion = ref({ x: 2, y: 2 })
const T6TextPostion = ref({ x: 2, y: 2 })
const T7TextPostion = ref({ x: 2, y: 2 })
const T8TextPostion = ref({ x: 2, y: 2 })
const T9SBTextPostion = ref({ x: 2, y: 2 })

function arrLastItem(arr) {
  if (arr.length === 1) return arr[0]
  return arr[arr.length - 1]
}

function arrSumNum(arr) {
  try {
    return Object.entries(arr).reduce((sum, [key, value]) => sum + key * value, 0);
  } catch (error) {
    console.log('arrSumNum-error', error);
    return 0
  }
}

watch(T1, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T1.value.chips, 1)
  } else {
    T1List.value = []
    T1Amount.value = 0
  }
})
watch(T2, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T2.value.chips, 2)
  } else {
    T2List.value = []
    T2Amount.value = 0
  }
})
watch(T3, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T3.value.chips, 3)
  } else {
    T3List.value = []
    T3Amount.value = 0
  }
})
watch(T5, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T5.value.chips, 5)
  } else {
    T5List.value = []
    T5Amount.value = 0
  }
})
watch(T6, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T6.value.chips, 6)
  } else {
    T6List.value = []
    T6Amount.value = 0
  }
})
watch(T7, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T7.value.chips, 7)
  } else {
    T7List.value = []
    T7Amount.value = 0
  }
})
watch(T8, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T8.value.chips, 8)
  } else {
    T8List.value = []
    T8Amount.value = 0
  }
})
watch(T9SB, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(T9SB.value.chips, 9)
  } else {
    T9SBList.value = []
    T9SBAmount.value = 0
  }
})

async function convertChipListToImgList(chips, seat) {
  const chipList = preProcessChipList(chips)
  let arr = []
  let keys = Object.keys(chipList)
  if (keys.length === 0) return
  let baseY = 38
  let offset = 6
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
    case 1:
      T1List.value = arr
      T1Amount.value = arrSumNum(chips)
      T1Show.value = arr.length ? true : false
      T1TextPostion.value = {
        y: arrLastItem(T1List.value).y
      }
      break;
    case 2:
      T2List.value = arr
      T2Amount.value = arrSumNum(chips)
      T2Show.value = arr.length ? true : false
      T2TextPostion.value = {
        y: arrLastItem(T2List.value).y
      }
      break;
    case 3:
      T3List.value = arr
      T3Amount.value = arrSumNum(chips)
      T3Show.value = arr.length ? true : false
      T3TextPostion.value = {
        y: arrLastItem(T3List.value).y
      }
      break;
    case 5:
      T5List.value = arr
      T5Amount.value = arrSumNum(chips)
      T5Show.value = arr.length ? true : false
      T5TextPostion.value = {
        y: arrLastItem(T5List.value).y
      }
      break;
    case 6:
      T6List.value = arr
      T6Amount.value = arrSumNum(chips)
      T6Show.value = arr.length ? true : false
      T6TextPostion.value = {
        y: arrLastItem(T6List.value).y
      }
      break;
    case 7:
      T7List.value = arr
      T7Amount.value = arrSumNum(chips)
      T7Show.value = arr.length ? true : false
      T7TextPostion.value = {
        y: arrLastItem(T7List.value).y
      }
      break;
    case 8:
      T8List.value = arr
      T8Amount.value = arrSumNum(chips)
      T8Show.value = arr.length ? true : false
      T8TextPostion.value = {
        y: arrLastItem(T8List.value).y
      }
      break;
    case 9:
      T9SBList.value = arr
      T9SBAmount.value = arrSumNum(chips)
      T9SBShow.value = arr.length ? true : false
      T9SBTextPostion.value = {
        y: arrLastItem(T9SBList.value).y
      }
      break;

    default:
      break;
  }
}

// 当筹码的总数量为6时，将最小的且相同的筹码数量合并为一个大面值的筹码 相加合并的面值必须等于 all_chip_range 其中一个子项
function preProcessChipList(chips) {
  let totalValue = arrSumNum(chips)
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
  await convertChipListToImgList(T1.value.chips, 1)
  await convertChipListToImgList(T2.value.chips, 2)
  await convertChipListToImgList(T3.value.chips, 3)
  await convertChipListToImgList(T5.value.chips, 5)
  await convertChipListToImgList(T6.value.chips, 6)
  await convertChipListToImgList(T7.value.chips, 7)
  await convertChipListToImgList(T8.value.chips, 8)
  await convertChipListToImgList(T9SB.value.chips, 9)
}

onMounted(async () => {
  await convertPlayerBetChips()
})
</script>

<template>
  <g data-v-c443f642="" transform="translate(695,12)" class="" id="T1" v-if="T1Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T1List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T1TextPostion.y - 6" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T1TextPostion.y + 4" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T1Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(675,69)" class="" id="T2" v-if="T2Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T2List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T2TextPostion.y - 8" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T2TextPostion.y + 4" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T2Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(538,104)" class="" id="T3" v-if="T3Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T3List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T3TextPostion.y - 4" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T3TextPostion.y + 6" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T3Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(395,106)" class="" id="T5" v-if="T5Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T5List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T5TextPostion.y - 2" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T5TextPostion.y + 8" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T5Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(317,105)" class="" id="T6" v-if="T6Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T6List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T6TextPostion.y" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T6TextPostion.y + 9" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T6Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(175,104)" class="" id="T7" v-if="T7Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T7List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T7TextPostion.y - 4" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T7TextPostion.y + 8" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T7Amount }}</text>

  </g>
  <g data-v-c443f642="" transform="translate(15,81)" class="" id="T8" v-if="T8Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T8List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T8TextPostion.y - 6" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T8TextPostion.y + 6" text-anchor="middle" font-size="12px" class="highlight-text">{{
      T8Amount }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(19,1)" class="" id="T9SB" v-if="T9SBAmount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_29905">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_29905)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1" style="display: block;">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(255,235,199)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
        </g>
      </svg>
    </g>
    <ChipSvg v-for="item in T9SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="T9SBTextPostion.y - 6" rx="4" ry="4" width="29.68" height="16"
      class="highlight-rext"></rect>
    <text data-v-c443f642="" x="20" :y="T9SBTextPostion.y + 6" text-anchor="middle" font-size="12px"
      class="highlight-text">{{ T9SBAmount
      }}</text>
  </g>
</template>

<style scoped lang="less">
.highlight-rext {
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

.highlight-text {
  fill: #000;
}
</style> 
