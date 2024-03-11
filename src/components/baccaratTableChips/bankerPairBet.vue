<script setup>
// BP_Q_I 庄对 区域 投注
import { onMounted, ref, toRefs, watch } from 'vue';
const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000]
import ChipSvg from '../ChipSvg.vue';
const props = defineProps({
  BP1: Object,
  BP2: Object,
  BP3: Object,
  BP5: Object,
  BP6: Object,
  BP7: Object,
  BP8: Object,
  BP9SB: Object,
})

const { BP1, BP2, BP3, BP5, BP6, BP7, BP8, BP9SB } = toRefs(props)

const BP1Show = ref(false)
const BP2Show = ref(false)
const BP3Show = ref(false)
const BP5Show = ref(false)
const BP6Show = ref(false)
const BP7Show = ref(false)
const BP8Show = ref(false)
const BP9SBShow = ref(false)

// 各个区域 总金额
const BP1Amount = ref(0)
const BP2Amount = ref(0)
const BP3Amount = ref(0)
const BP5Amount = ref(0)
const BP6Amount = ref(0)
const BP7Amount = ref(0)
const BP8Amount = ref(0)
const BP9SBAmount = ref(0)

// 各个区域筹码列表
const BP1List = ref([])
const BP2List = ref([])
const BP3List = ref([])
const BP5List = ref([])
const BP6List = ref([])
const BP7List = ref([])
const BP8List = ref([])
const BP9SBList = ref([])

// 
const BP1TextPostion = ref({ x: 2, y: 2 })
const BP2TextPostion = ref({ x: 2, y: 2 })
const BP3TextPostion = ref({ x: 2, y: 2 })
const BP5TextPostion = ref({ x: 2, y: 2 })
const BP6TextPostion = ref({ x: 2, y: 2 })
const BP7TextPostion = ref({ x: 2, y: 2 })
const BP8TextPostion = ref({ x: 2, y: 2 })
const BP9SBTextPostion = ref({ x: 2, y: 2 })

function arrLastItem(arr) {
  if (arr.length === 1) return arr[0]
  return arr[arr.length - 1]
}

watch(BP1, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP1.value.chips, 1)
  } else {
    BP1List.value = []
    BP1Amount.value = 0
  }
})
watch(BP2, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP2.value.chips, 2)
  } else {
    BP2List.value = []
    BP2Amount.value = 0
  }
})
watch(BP3, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP3.value.chips, 3)
  } else {
    BP3List.value = []
    BP3Amount.value = 0
  }
})
watch(BP5, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP5.value.chips, 5)
  } else {
    BP5List.value = []
    BP5Amount.value = 0
  }
})
watch(BP6, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP6.value.chips, 6)
  } else {
    BP6List.value = []
    BP6Amount.value = 0
  }
})
watch(BP7, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP7.value.chips, 7)
  } else {
    BP7List.value = []
    BP7Amount.value = 0
  }
})
watch(BP8, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP8.value.chips, 8)
  } else {
    BP8List.value = []
    BP8Amount.value = 0
  }
})
watch(BP9SB, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(BP9SB.value.chips, 9)
  } else {
    BP9SBList.value = []
    BP9SBAmount.value = 0
  }
})


async function convertChipListToImgList(chips, seat) {
  const chipList = preProcessChipList(chips)
  let arr = []
  let keys = Object.keys(chipList)
  if (keys.length === 0) return
  let baseY = 26
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
  try {
    
    switch (seat) {
      case 1:
        BP1List.value = arr
        BP1Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP1Show.value = arr.length ? true : false
        BP1TextPostion.value = {
          y: arrLastItem(BP1List.value).y + offset
        }
        break;
      case 2:
        BP2List.value = arr
        BP2Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP2Show.value = arr.length ? true : false
        BP2TextPostion.value = {
          y: arrLastItem(BP2List.value).y + offset
        }
        break;
      case 3:
        BP3List.value = arr
        BP3Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP3Show.value = arr.length ? true : false
        BP3TextPostion.value = {
          y: arrLastItem(BP3List.value).y + offset
        }
        break;
      case 5:
        BP5List.value = arr
        BP5Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP5Show.value = arr.length ? true : false
        BP5TextPostion.value = {
          y: arrLastItem(BP5List.value).y + offset
        }
        break;
      case 6:
        BP6List.value = arr
        BP6Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP6Show.value = arr.length ? true : false
        BP6TextPostion.value = {
          y: arrLastItem(BP6List.value).y + offset
        }
        break;
      case 7:
        BP7List.value = arr
        BP7Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP7Show.value = arr.length ? true : false
        BP7TextPostion.value = {
          y: arrLastItem(BP7List.value).y + offset
        }
        break;
      case 8:
        BP8List.value = arr
        BP8Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP8Show.value = arr.length ? true : false
        BP8TextPostion.value = {
          y: arrLastItem(BP8List.value).y + offset
        }
        break;
      case 9:
        BP9SBList.value = arr
        BP9SBAmount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
        BP9SBShow.value = arr.length ? true : false
        BP9SBTextPostion.value = {
          y: arrLastItem(BP9SBList.value).y
        }
        break;
  
      default:
        break;
    }
  } catch (error) {
    console.log('error', error);
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
  await convertChipListToImgList(BP1.value.chips, 1)
  await convertChipListToImgList(BP2.value.chips, 2)
  await convertChipListToImgList(BP3.value.chips, 3)
  await convertChipListToImgList(BP5.value.chips, 5)
  await convertChipListToImgList(BP6.value.chips, 6)
  await convertChipListToImgList(BP7.value.chips, 7)
  await convertChipListToImgList(BP8.value.chips, 8)
  await convertChipListToImgList(BP9SB.value.chips, 9)
}

onMounted(async () => {
  await convertPlayerBetChips()
})

</script>

<template>
  <g id="BP_Q_B" transform="translate(19, 6)">
    <g data-v-c443f642="" transform="translate(293,20)" class="" id="BP1" v-if="BP1Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP9SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP1TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP1TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP1Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(250,20)" class="" id="BP2" v-if="BP2Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP2List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP2TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP2TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP2Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(210,20)" class="" id="BP3" v-if="BP3Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP3List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP3TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP3TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP3Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(173,20)" class="" id="BP5" v-if="BP5Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP5List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP5TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP5TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP5Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(130,20)" class="" id="BP6" v-if="BP6Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP6List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP6TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP6TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP6Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(83,20)" class="" id="BP7" v-if="BP7Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP7List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP7TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP7TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP7Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(43,20)" class="" id="BP8" v-if="BP8Amount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP8List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP8TextPostion.y-15" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP8TextPostion.y-4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP8Amount }}</text>
    </g>
    <g data-v-c443f642="" transform="translate(5,20)" class="" id="BP9SB" v-if="BP9SBAmount !== 0">
      <g data-v-c443f642="" style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60"
          preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);">
          <defs>
            <clipPath id="__lottie_element_1934">
              <rect width="60" height="60" x="0" y="0"></rect>
            </clipPath>
          </defs>
          <g clip-path="url(#__lottie_element_1934)">
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
        </svg></g>
      <ChipSvg v-for="item in BP9SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect data-v-c443f642="" x="5" :y="BP9SBTextPostion.y-8" rx="4" ry="4" width="27.7" height="16"
        class="highlight-rext"></rect>
      <text data-v-c443f642="" x="20" :y="BP9SBTextPostion.y+4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ BP9SBAmount }}</text>
    </g>
  </g>
</template>

<style scoped lang="less">
.normal-rect {
  fill: #fff;
  opacity: .6;
}

.highlight-rext {
    fill: #d8bd71;
    stroke: #e5e5e5;
    stroke-width: 1px;
}

.highlight-text {
    fill: #1b1a1a;
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
