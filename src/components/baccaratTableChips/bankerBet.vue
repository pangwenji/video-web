<script setup>
// B_Q_B 庄 区域 投注
import { onMounted, ref, toRefs } from 'vue';
import ChipSvg from '../ChipSvg.vue';
import { watch } from 'vue';
import { onBeforeMount } from 'vue';
const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000]

const props = defineProps({
  B1SB: Object,
  B2: Object,
  B3: Object,
  B5: Object,
  B6: Object,
  B7: Object,
  B8: Object,
})
const { B1SB, B2, B3, B5, B6, B7, B8 } = toRefs(props)

const B1SBShow = ref(false)
const B2Show = ref(false)
const B3Show = ref(false)
const B5Show = ref(false)
const B6Show = ref(false)
const B7Show = ref(false)
const B8Show = ref(false)

// 各个区域 总金额
const B1SBAmount = ref(0)
const B2Amount = ref(0)
const B3Amount = ref(0)
const B5Amount = ref(0)
const B6Amount = ref(0)
const B7Amount = ref(0)
const B8Amount = ref(0)

// 各个区域筹码列表
const B1SBList = ref([])
const B2List = ref([])
const B3List = ref([])
const B5List = ref([])
const B6List = ref([])
const B7List = ref([])
const B8List = ref([])

// 筹码总额数值位置
const B1SBTextPostion = ref({ x: 2, y: 2 })
const B2TextPostion = ref({ x: 2, y: 2 })
const B3TextPostion = ref({ x: 2, y: 2 })
const B5TextPostion = ref({ x: 2, y: 2 })
const B6TextPostion = ref({ x: 2, y: 2 })
const B7TextPostion = ref({ x: 2, y: 2 })
const B8TextPostion = ref({ x: 2, y: 2 })

function arrLastItem(arr) {
  if (arr.length === 1) return arr[0]
  return arr[arr.length - 1]
}

watch(B1SB, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B1SB.value.chips, 1)
  } else {
    B1SBList.value = []
    B1SBAmount.value = 0
  }
})
watch(B2, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B2.value.chips, 2)
  } else {
    B2List.value = []
    B2Amount.value = 0
  }
})
watch(B3, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B3.value.chips, 3)
  } else {
    B3List.value = []
    B3Amount.value = 0
  }
})
watch(B5, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B5.value.chips, 5)
  } else {
    B5List.value = []
    B5Amount.value = 0
  }
})
watch(B6, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B6.value.chips, 6)
  } else {
    B6List.value = []
    B6Amount.value = 0
  }
})
watch(B7, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B7.value.chips, 7)
  } else {
    B7List.value = []
    B7Amount.value = 0
  }
})
watch(B8, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(B8.value.chips, 8)
  } else {
    B8List.value = []
    B8Amount.value = 0
  }
})

// 筹码数据转换成筹码图片添加到桌台（计算总额，合并筹码
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
    case 1:
      B1SBList.value = arr
      B1SBAmount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B1SBShow.value = arr.length ? true : false
      B1SBTextPostion.value = {
        y: arrLastItem(arr).y - 4
      }
      break;
    case 2:
      B2List.value = arr
      B2Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B2Show.value = arr.length ? true : false
      B2TextPostion.value = {
        y: arrLastItem(B2List.value).y - 4
      }
      break;
    case 3:
      B3List.value = arr
      B3Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B3Show.value = arr.length ? true : false
      B3TextPostion.value = {
        y: arrLastItem(B3List.value).y - 4
      }
      break;
    case 5:
      B5List.value = arr
      B5Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B5Show.value = arr.length ? true : false
      B5TextPostion.value = {
        y: arrLastItem(B5List.value).y - 4
      }
      console.log('B5下注信息', B5List.value);
      break;
    case 6:
      B6List.value = arr
      B6Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B6Show.value = arr.length ? true : false
      B6TextPostion.value = {
        y: arrLastItem(B6List.value).y - 4
      }
      break;
    case 7:
      B7List.value = arr
      B7Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B7Show.value = arr.length ? true : false
      B7TextPostion.value = {
        y: arrLastItem(B7List.value).y - 4
      }
      break;
    case 8:
      B8List.value = arr
      B8Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      B8Show.value = arr.length ? true : false
      B8TextPostion.value = {
        y: arrLastItem(B8List.value).y - 4
      }
      break;
    default:
      break;
  }
}

// 当筹码的总数量为6时，将最小的且相同的筹码数量合并为一个大面值的筹码 相加合并的面值必须等于 all_chip_range 其中一个子项
function preProcessChipList(chips) {
  let totalValue = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
  if (totalValue === 0) return {}
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
  await convertChipListToImgList(B1SB.value.chips, 1)
  await convertChipListToImgList(B2.value.chips, 2)
  await convertChipListToImgList(B3.value.chips, 3)
  await convertChipListToImgList(B5.value.chips, 5)
  await convertChipListToImgList(B6.value.chips, 6)
  await convertChipListToImgList(B7.value.chips, 7)
  await convertChipListToImgList(B8.value.chips, 8)
}

onMounted(async () => {
  await convertPlayerBetChips()
})
</script>

<template>
  <g data-v-c443f642="" transform="translate(-27,105)" class="" id="B8" v-if="B8Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B8List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B8TextPostion.y - 6" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B8TextPostion.y + 4" text-anchor="middle" font-size="12px" class="highlight-text">{{
      B8Amount
    }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(166,133)" class="" id="B7" v-if="B7Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B7List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B7TextPostion.y - 6" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B7TextPostion.y + 6" text-anchor="middle" font-size="12px" class="highlight-text">{{
      B7Amount
    }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(348,139)" class="" id="B6" v-if="B6Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B6List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B6TextPostion.y - 4" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B6TextPostion.y + 6" text-anchor="middle" font-size="12px" class="highlight-text">{{
      B6Amount
    }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(484,139)" class="" id="B5" v-if="B5Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B5List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B5TextPostion.y - 4" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B5TextPostion.y + 8" text-anchor="middle" font-size="12px"
      class="highlight-text">{{
        B5Amount
      }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(648,133)" class="" id="B3" v-if="B3Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B3List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B3TextPostion.y - 4" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B3TextPostion.y + 6" text-anchor="middle" font-size="12px" class="highlight-text">{{
      B3Amount
    }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(809,106)" class="" id="B2" v-if="B2Amount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B2List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B2TextPostion.y - 6" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B2TextPostion.y + 4" text-anchor="middle" font-size="12px" class="highlight-text">{{
      B2Amount
    }}</text>
  </g>
  <g data-v-c443f642="" transform="translate(850,0)" class="" id="B1SB" v-if="B1SBAmount !== 0">
    <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
        preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
        <defs>
          <clipPath id="__lottie_element_7976">
            <rect width="60" height="60" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_7976)">
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4"
                stroke="rgb(211,178,122)" stroke-opacity="1" stroke-width="0"
                d=" M0,-30 C16.55699920654297,-30 30,-16.55699920654297 30,0 C30,16.55699920654297 16.55699920654297,30 0,30 C-16.55699920654297,30 -30,16.55699920654297 -30,0 C-30,-16.55699920654297 -16.55699920654297,-30 0,-30z">
              </path>
            </g>
          </g>
          <g transform="matrix(1,0,0,1,30,30)" opacity="1">
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
    <ChipSvg v-for="item in B1SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
    <rect data-v-c443f642="" x="5.155029296875" :y="B1SBTextPostion.y - 4" rx="4" ry="4" width="29.68994140625" height="16"
      class="highlight-rect"></rect>
    <text data-v-c443f642="" x="20" :y="B1SBTextPostion.y + 8" text-anchor="middle" font-size="12px"
      class="highlight-text">{{
        B1SBAmount
      }}</text>
  </g>
</template>

<style scoped lang="less">
.highlight-rect {
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
