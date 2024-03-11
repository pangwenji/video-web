<script setup>
// PP_Q_B 闲对 区域 投注
import { onMounted, ref, toRefs, watch } from 'vue';
import ChipSvg from '../ChipSvg.vue';
const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000]
const props = defineProps({
  PP1: Object,
  PP2: Object,
  PP3: Object,
  PP5: Object,
  PP6: Object,
  PP7: Object,
  PP8: Object,
  PP9SB: Object,
})

const { PP1, PP2, PP3, PP5, PP6, PP7, PP8, PP9SB } = toRefs(props)

const PP1Show = ref(false)
const PP2Show = ref(false)
const PP3Show = ref(false)
const PP5Show = ref(false)
const PP6Show = ref(false)
const PP7Show = ref(false)
const PP8Show = ref(false)
const PP9SBShow = ref(false)

// 各个区域 总金额
const PP1Amount = ref(0)
const PP2Amount = ref(0)
const PP3Amount = ref(0)
const PP5Amount = ref(0)
const PP6Amount = ref(0)
const PP7Amount = ref(0)
const PP8Amount = ref(0)
const PP9SBAmount = ref(0)

// 各个区域筹码列表
const PP1List = ref([])
const PP2List = ref([])
const PP3List = ref([])
const PP5List = ref([])
const PP6List = ref([])
const PP7List = ref([])
const PP8List = ref([])
const PP9SBList = ref([])

// 
const PP1TextPostion = ref({ x: 2, y: 2 })
const PP2TextPostion = ref({ x: 2, y: 2 })
const PP3TextPostion = ref({ x: 2, y: 2 })
const PP5TextPostion = ref({ x: 2, y: 2 })
const PP6TextPostion = ref({ x: 2, y: 2 })
const PP7TextPostion = ref({ x: 2, y: 2 })
const PP8TextPostion = ref({ x: 2, y: 2 })
const PP9SBTextPostion = ref({ x: 2, y: 2 })

function arrLastItem(arr) {
  if (arr.length === 1) return arr[0]
  return arr[arr.length - 1]
}

watch(PP1, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP1.value.chips, 1)
  } else {
    PP1List.value = []
    PP1Amount.value = 0
  }
})
watch(PP2, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP2.value.chips, 2)
  } else {
    PP2List.value = []
    PP2Amount.value = 0
  }
})
watch(PP3, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP3.value.chips, 3)
  } else {
    PP3List.value = []
    PP3Amount.value = 0
  }
})
watch(PP5, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP5.value.chips, 5)
  } else {
    PP5List.value = []
    PP5Amount.value = 0
  }
})
watch(PP6, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP6.value.chips, 6)
  } else {
    PP6List.value = []
    PP6Amount.value = 0
  }
})
watch(PP7, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP7.value.chips, 7)
  } else {
    PP7List.value = []
    PP7Amount.value = 0
  }
})
watch(PP8, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP8.value.chips, 8)
  } else {
    PP8List.value = []
    PP8Amount.value = 0
  }
})
watch(PP9SB, async val => {
  if (val.chips && Object.keys(val.chips).length) {
    await convertChipListToImgList(PP9SB.value.chips, 9)
  } else {
    PP9SBList.value = []
    PP9SBAmount.value = 0
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
    case 1:
      PP1List.value = arr
      PP1Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP1Show.value = arr.length ? true : false
      PP1TextPostion.value = {
        y: arrLastItem(PP1List.value).y + offset
      }
      break;
    case 2:
      PP2List.value = arr
      PP2Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP2Show.value = arr.length ? true : false
      PP2TextPostion.value = {
        y: arrLastItem(PP2List.value).y + offset
      }
      break;
    case 3:
      PP3List.value = arr
      PP3Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP3Show.value = arr.length ? true : false
      PP3TextPostion.value = {
        y: arrLastItem(PP3List.value).y + offset
      }
      break;
    case 5:
      PP5List.value = arr
      PP5Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP5Show.value = arr.length ? true : false
      PP5TextPostion.value = {
        y: arrLastItem(PP5List.value).y + offset
      }
      break;
    case 6:
      PP6List.value = arr
      PP6Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP6Show.value = arr.length ? true : false
      PP6TextPostion.value = {
        y: arrLastItem(PP6List.value).y + offset
      }
      break;
    case 7:
      PP7List.value = arr
      PP7Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP7Show.value = arr.length ? true : false
      PP7TextPostion.value = {
        y: arrLastItem(PP7List.value).y + offset
      }
      break;
    case 8:
      PP8List.value = arr
      PP8Amount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP8Show.value = arr.length ? true : false
      PP8TextPostion.value = {
        y: arrLastItem(PP8List.value).y + offset
      }
      break;
    case 9:
      PP9SBList.value = arr
      PP9SBAmount.value = Object.entries(chips).reduce((sum, [key, value]) => sum + key * value, 0);
      PP9SBShow.value = arr.length ? true : false
      PP9SBTextPostion.value = {
        y: arrLastItem(PP9SBList.value).y
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
  await convertChipListToImgList(PP1.value.chips, 1)
  await convertChipListToImgList(PP2.value.chips, 2)
  await convertChipListToImgList(PP3.value.chips, 3)
  await convertChipListToImgList(PP5.value.chips, 5)
  await convertChipListToImgList(PP6.value.chips, 6)
  await convertChipListToImgList(PP7.value.chips, 7)
  await convertChipListToImgList(PP8.value.chips, 8)
  await convertChipListToImgList(PP9SB.value.chips, 9)
}

onMounted(async () => {
  await convertPlayerBetChips()
})

</script>

<template>
  <g id="PP_Q_B" transform="translate(36, 6)">
    <g transform="translate(295,20)" class="" id="PP1" v-if="PP1Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP1List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP1TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP1TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP1Amount }}</text>
    </g>
    <g transform="translate(258,20)" class="" id="PP2" v-if="PP2Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP2List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP2TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP2TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP2Amount }}</text>
    </g>
    <g transform="translate(213,20)" class="" id="PP3" v-if="PP3Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP3List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP3TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP3TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP3Amount }}</text>
    </g>
    <g transform="translate(173,20)" class="" id="PP5" v-if="PP5Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP5List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP5TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP5TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP5Amount }}</text>
    </g>
    <g transform="translate(123,20)" class="" id="PP6" v-if="PP6Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP6List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP6TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP6TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP6Amount }}</text>
    </g>
    <g transform="translate(73,20)" class="" id="PP7" v-if="PP7Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP7List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP7TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP7TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP7Amount }}</text>
    </g>
    <g transform="translate(43,20)" class="" id="PP8" v-if="PP8Amount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP8List" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP8TextPostion.y - 13" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP8TextPostion.y - 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP8Amount }}</text>
    </g>
    <g transform="translate(4,20)" class="" id="PP9SB" v-if="PP9SBAmount !== 0">
      <g style="transform: translate(20px, 35px) translate(-30px, -15px) rotateX(60deg);"><svg
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
      <ChipSvg v-for="item in PP9SBList" :chipOpt="{ path: item.src, x: item.x, y: item.y }" />
      <rect x="8.77001953125" :y="PP9SBTextPostion.y - 6" rx="4" ry="4" width="22.4599609375"
        height="16" class="highlight-rext"></rect>
      <text x="20" :y="PP9SBTextPostion.y + 4" text-anchor="middle" font-size="12px"
        class="highlight-text">{{ PP9SBAmount }}</text>
    </g>
  </g>
</template>

<style scoped lang="less">
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
</style> 
