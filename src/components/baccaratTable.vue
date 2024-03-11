<script setup>
import { ref, onMounted, toRefs, watch, reactive, inject } from 'vue'
import { useUserStore } from '@/store'
import bankerBet from './baccaratTableChips/bankerBet.vue';
import playerBet from './baccaratTableChips/playerBet.vue';
import tieBet from './baccaratTableChips/tieBet.vue';
import playerPairBet from './baccaratTableChips/playerPairBet.vue';
import bankerPairBet from './baccaratTableChips/bankerPairBet.vue';
import { ElMessage } from 'element-plus';
import tool from '@/utils/tool';
const userStore = useUserStore()
// 桌台上的座位信息列表
// const seatInfoList = ref([])
// 桌台上的下注信息列表
// const betInfoList = ref([])

const props = defineProps({
  chipQueta: Number,
  tableOtherUserBetChips: Object, // 进行时 玩家的下注筹码信息推送
  tableUserInfoList: Object, // 桌台用户信息 进入桌台后的 所有下注信息
  userSeat: Number,
  forbidenBet: Boolean
})

const { chipQueta, tableOtherUserBetChips, userSeat, tableUserInfoList, forbidenBet } = toRefs(props)

const all_chip_range = [5, 25, 100, 500, 1000, 5000, 10000, 100000, 500000];

function devideAmountToChips(amount) {
  const chipRange = all_chip_range
  let result = []
  for (let i = chipRange.length - 1; i >= 0; i--) {
    let chip = chipRange[i]
    while (amount >= chip) {
      result.push(chip)
      amount -= chip
    }
  }
  let obj = {}
  for (let i in result) {
    if (obj[result[i]]) {
      obj[result[i]] = obj[result[i]] + 1
    } else {
      obj[result[i]] = 1
    }
  }
  return obj;
}

// area_id 筹码区域id （庄，闲，和，庄对，闲对
// seat 座位 235678 旁
// chip_queta_list 筹码面值 数组 []
// user_mark 是谁下的注 
const seatNums = [5, 6, 3, 7, 2, 8]
// 禁止下注
// const forbidenBet = ref(false)
// 所有玩家的座位
// 只有 有座位的玩家才可以在桌面部分 下注。其他的所有人都在旁注
const allPlayerSeatDefault = ref({
  seat2: {
    nickname: "",
    amount: 0,
    seat: 2,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
  seat3: {
    nickname: "",
    amount: 0,
    seat: 3,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
  seat5: {
    nickname: "",
    amount: 0,
    seat: 5,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
  seat6: {
    nickname: "",
    amount: 0,
    seat: 6,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
  seat7: {
    nickname: "",
    amount: 0,
    seat: 7,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
  seat8: {
    nickname: "",
    amount: 0,
    seat: 8,
    bet_total_amount: 0,
    bet_list: {
      1: {
        chips: {},
        total_amount: 0
      },
      2: {
        chips: {},
        total_amount: 0
      },
      3: {
        chips: {},
        total_amount: 0
      },
      4: {
        chips: {},
        total_amount: 0
      },
      5: {
        chips: {},
        total_amount: 0
      },
    }
  },
})
const userInfo = ref({})
userInfo.value = userStore.$state

// 各个玩法对应的 字符串
const bet_code_dict = {
  banker_winner: "1", // 庄 1
  player_winner: "2", // 闲 2
  banker_player_same_pointer: "3", // 和 3
  first_banker_pair: "4", // 庄对 4
  first_player_pair: "5" // 闲对 5
}

// 当前用户的下注信息  chips
const userBetChips = ref({})

watch(chipQueta, val => {
  console.log('桌台-筹码面值发生更改', val);
})

watch(tableOtherUserBetChips, val => {
  console.log('接收到桌台其他玩家的下注信息', val);
  // const { bet, winner} = val
  const { normal, sideBet } = val
  if(sideBet && sideBet.length) {
    // 其他玩家下注的筹码是旁注
  }
  if(normal && normal.length) {
    for(let userIdx in normal) {
      const betUser = normal[userIdx]
      const playStyleKeys = Object.keys(betUser)
      for(let k in playStyleKeys) {
        // playStyleKeys[k] => 玩法 
        // 玩法 对应 下注信息（筹码，） betUser[playStyleKeys[k]]
        // 字段 seat 表示的是 当前 playStyleKeys[k] 玩法的筹码信息
        const { seat, user_nick, unique } = betUser[playStyleKeys[k]]
        // 根据玩法放置筹码
        if(playStyleKeys[k] === 1) {
          // 庄
          bankerBetChipsData.value = {
            ...bankerBetChipsData.value,
            [Object.keys(seat)[0]]: seat[Object.keys(seat)[0]]
          }
        }
        if(playStyleKeys[k] === 2) {
          // 闲
          playerBetChipsData.value = {
            ...playerBetChipsData.value,
            [Object.keys(seat)[0]]: seat[Object.keys(seat)[0]]
          }
        }
        if(playStyleKeys[k] === 3) {
          // 和
          tieBetChipsData.value = {
            ...tieBetChipsData.value,
            [Object.keys(seat)[0]]: seat[Object.keys(seat)[0]]
          }
        }
        if(playStyleKeys[k] === 4) {
          // 庄对
          bankerPairBetChipsData.value = {
            ...bankerPairBetChipsData.value,
            [Object.keys(seat)[0]]: seat[Object.keys(seat)[0]]
          }
        }
        if(playStyleKeys[k] === 5) {
          // 闲对
          playerPairBetChipsData.value = {
            ...playerPairBetChipsData.value,
            [Object.keys(seat)[0]]: seat[Object.keys(seat)[0]]
          }
        }
      }
    }
  }
  //结构 { banker_winner: { user_nick, seat, chip } } 
})

// 各个投注区域 的筹码数据
// 闲区域投注 
const playerBetChipsData = ref({
  P2: {
    chips: {}
  },
  P3: {
    chips: {}
  },
  P5: {
    chips: {}
  },
  P6: {
    chips: {}
  },
  P7: {
    chips: {}
  },
  P8: {
    chips: {}
  },
  P9SB: {
    chips: {}
  }
})

const bankerBetChipsData = ref({
  B1SB: {
    chips: {}
  },
  B2: {
    chips: {},
  },
  B3: {
    chips: {}
  },
  B5: {
    chips: {}
  },
  B6: {
    chips: {}
  },
  B7: {
    chips: {}
  },
  B8: {
    chips: {}
  }
})

const tieBetChipsData = ref({
  T1: {
    chips: {}
  },
  T2: {
    chips: {},
  },
  T3: {
    chips: {}
  },
  T5: {
    chips: {}
  },
  T6: {
    chips: {}
  },
  T7: {
    chips: {}
  },
  T8: {
    chips: {}
  },
  T9SB: {
    chips: {}
  }
})

const bankerPairBetChipsData = ref({
  BP1: {
    chips: {}
  },
  BP2: {
    chips: {},
  },
  BP3: {
    chips: {}
  },
  BP5: {
    chips: {}
  },
  BP6: {
    chips: {}
  },
  BP7: {
    chips: {}
  },
  BP8: {
    chips: {}
  },
  BP9SB: {
    chips: {}
  }
})
const playerPairBetChipsData = ref({
  PP1: {
    chips: {}
  },
  PP2: {
    chips: {},
  },
  PP3: {
    chips: {}
  },
  PP5: {
    chips: {}
  },
  PP6: {
    chips: {}
  },
  PP7: {
    chips: {}
  },
  PP8: {
    chips: {}
  },
  PP9SB: {
    chips: {}
  }
})

// 清空桌台筹码
function clearTableChips() {
  tieBetChipsData.value = {
    T1: {
      chips: {}
    },
    T2: {
      chips: {},
    },
    T3: {
      chips: {}
    },
    T5: {
      chips: {}
    },
    T6: {
      chips: {}
    },
    T7: {
      chips: {}
    },
    T8: {
      chips: {}
    },
    T9SB: {
      chips: {}
    }
  }
  bankerBetChipsData.value = {
    B1SB: {
      chips: {}
    },
    B2: {
      chips: {},
    },
    B3: {
      chips: {}
    },
    B5: {
      chips: {}
    },
    B6: {
      chips: {}
    },
    B7: {
      chips: {}
    },
    B8: {
      chips: {}
    }
  }
  playerBetChipsData.value = {
    P2: {
      chips: {}
    },
    P3: {
      chips: {}
    },
    P5: {
      chips: {}
    },
    P6: {
      chips: {}
    },
    P7: {
      chips: {}
    },
    P8: {
      chips: {}
    },
    P9SB: {
      chips: {}
    }
  }
  bankerPairBetChipsData.value = {
    BP1: {
      chips: {}
    },
    BP2: {
      chips: {},
    },
    BP3: {
      chips: {}
    },
    BP5: {
      chips: {}
    },
    BP6: {
      chips: {}
    },
    BP7: {
      chips: {}
    },
    BP8: {
      chips: {}
    },
    BP9SB: {
      chips: {}
    }
  }
  playerPairBetChipsData.value = {
    PP1: {
      chips: {}
    },
    PP2: {
      chips: {},
    },
    PP3: {
      chips: {}
    },
    PP5: {
      chips: {}
    },
    PP6: {
      chips: {}
    },
    PP7: {
      chips: {}
    },
    PP8: {
      chips: {}
    },
    PP9SB: {
      chips: {}
    }
  }
}

// 清除用户下注筹码（未点击确认下注 座位
function clearUserChips(seat) {
  userBetChips.value = {}
  // 当用户的座位不是旁座时
  if (seat) {
    tieBetChipsData.value = {
      ...tieBetChipsData.value,
      [`T${seat}`]: {
        chips: {}
      }
    }
    playerBetChipsData.value = {
      ...playerBetChipsData.value,
      [`P${seat === 9 || seat === '-' ? '9SB' : seat}`]: {
        chips: {}
      }
    }
    bankerBetChipsData.value = {
      ...bankerBetChipsData.value,
      [`B${seat === 1 || seat === '-' ? '1SB' : seat}`]: {
        chips: {}
      }
    }
    bankerPairBetChipsData.value = {
      ...bankerPairBetChipsData.value,
      [`BP${seat !== 9 ? seat : '9SB'}`]: {
        chips: {}
      }
    }
    playerPairBetChipsData.value = {
      ...playerPairBetChipsData.value,
      [`PP${seat !== 9 ? seat : '9SB'}`]: {
        chips: {}
      }
    }
  }
}

// 根据座位seat玩法content 设置不同区域筹码位置
function setChipsPosition(seat, content, chipQuetaValue) {
  // console.log('根据座位seat玩法content', {
  //   seat, content, chipQuetaValue
  // });
  if (content === 1) {
    const keyStr = seat !== 1 ? `B${seat}` : `B${seat}SB`
    bankerBetChipsData.value = {
      ...bankerBetChipsData.value,
      [keyStr]: {
        chips: {
          ...bankerBetChipsData.value[keyStr].chips,
          [chipQuetaValue]: (bankerBetChipsData.value[keyStr].chips[chipQuetaValue] || 0) + 1
        }
      }
    }
  }
  if (content === 2) {
    const keyStr = seat === 1 ? `P9SB` : (seat !== 9 ? `P${seat}` : `B${seat}SB`)
    playerBetChipsData.value = {
      ...playerBetChipsData.value,
      [keyStr]: {
        chips: {
          ...playerBetChipsData.value[keyStr].chips,
          [chipQuetaValue]: (playerBetChipsData.value[keyStr].chips[chipQuetaValue] || 0) + 1
        }
      }
    }
  }
  if (content === 3) {
    const keyStr = seat !== 9 ? `T${seat}` : `T${seat}SB`
    tieBetChipsData.value = {
      ...tieBetChipsData.value,
      [keyStr]: {
        chips: {
          ...tieBetChipsData.value[keyStr].chips,
          [chipQuetaValue]: (tieBetChipsData.value[keyStr].chips[chipQuetaValue] || 0) + 1
        }
      }
    }
  }
  if (content === 4) {
    const keyStr = seat !== 9 ? `BP${seat}` : `BP${seat}SB`
    bankerPairBetChipsData.value = {
      ...bankerPairBetChipsData.value,
      [keyStr]: {
        chips: {
          ...bankerPairBetChipsData.value[keyStr].chips,
          [chipQuetaValue]: (bankerPairBetChipsData.value[keyStr].chips[chipQuetaValue] || 0) + 1
        }
      }
    }
  }
  if (content === 5) {
    const keyStr = seat !== 9 ? `PP${seat}` : `PP${seat}SB`
    playerPairBetChipsData.value = {
      ...playerPairBetChipsData.value,
      [keyStr]: {
        chips: {
          ...playerPairBetChipsData.value[keyStr].chips,
          [chipQuetaValue]: (playerPairBetChipsData.value[keyStr].chips[chipQuetaValue] || 0) + 1
        }
      }
    }
  }
}
const seatPreList = ref([])
// 进入房间之后 获取下注信息 房间内已有用户的座位和下注信息
// 房间内的座位处理  座位名
// 除当前用户之外的所有在桌台的玩家
function seatPreProcess() {
  const tableUserIdList = Object.keys(bet)
  for (let i in tableUserIdList) {
    const user_i_bet_info = bet[tableUserIdList[i]]
    if (!user_i_bet_info.length) {
      return
    }
    const user_seat = user_i_bet_info[0].seat
    const user_name = user_i_bet_info[0].user_nick
    const bet_list = {}
    let bet_total_amount = 0
    if (tableUserIdList.length) {
      for (let j in user_i_bet_info) {
        if (user_i_bet_info[j].bet_code === "banker_winner") {
          const chips = JSON.parse(user_i_bet_info[j].chips)
          bet_list["1"] = {
            chips,
            total_amount: sumBetAmount(chips)
          }
        }
        if (user_i_bet_info[j].bet_code === "player_winner") {
          const chips = JSON.parse(user_i_bet_info[j].chips)
          bet_list["2"] = {
            chips,
            total_amount: sumBetAmount(chips)
          }
        }
        if (user_i_bet_info[j].bet_code === "banker_player_same_pointer") {
          const chips = JSON.parse(user_i_bet_info[j].chips)
          bet_list["3"] = {
            chips,
            total_amount: sumBetAmount(chips)
          }
        }
        if (user_i_bet_info[j].bet_code === "first_banker_pair") {
          const chips = JSON.parse(user_i_bet_info[j].chips)
          bet_list["4"] = {
            chips,
            total_amount: sumBetAmount(chips)
          }
        }
        if (user_i_bet_info[j].bet_code === "first_player_pair") {
          const chips = JSON.parse(user_i_bet_info[j].chips)
          bet_list["5"] = {
            chips,
            total_amount: sumBetAmount(chips)
          }
        }
      }
    }
    seatPreList.value.push(Number(user_seat))
    allPlayerSeatDefault.value[`seat${user_seat}`] = {
      ...allPlayerSeatDefault.value[`seat${user_seat}`],
      nickname: user_name,
      seat: user_seat,
      bet_list: bet_list,
      bet_total_amount: 0
    }
  }
}

// 当前桌台的状态 检测桌台状态禁止或允许下注
// function tableStatus() {
//   console.log('当前桌台的状态');
// }

// 处理 当前桌台的下注信息
function preProcessBetInfo() {
  return new Promise((resolve, reject) => {
    const seatKeysList = Object.keys(tableUserInfoList.value)
    for (let i in seatKeysList) {
      const playerSeatNum = `${seatKeysList[i]}` // 座位号
      if (seatNums.includes(Number(playerSeatNum))) {
        const { user_nick, chips, isOwner, unique, } = tableUserInfoList.value[playerSeatNum]
        allPlayerSeatDefault.value = {
          ...allPlayerSeatDefault.value,
          [`seat${playerSeatNum}`]: {
            nickname: user_nick,
            seat: playerSeatNum,
            isOwner,
            unique,
            bet_list: chips
          }
        }

        // 从筹码列表chips中将各种玩法（庄闲和 庄对闲对）的数据 分离
        const chipsPlayStyleKeys = Object.keys(chips) // 各个玩法的列表
        for(let j in chipsPlayStyleKeys) {
          if(Number(chipsPlayStyleKeys[j]) === 1) {
            bankerBetChipsData.value = {
              ...bankerBetChipsData.value,
              [playerSeatNum === "1" ? "B1SB" : `B${playerSeatNum}`]: {
                chips: chips[chipsPlayStyleKeys[j]]
              }
            }
          }
          if(Number(chipsPlayStyleKeys[j]) === 2) {
            playerBetChipsData.value = {
              ...playerBetChipsData.value,
              [playerSeatNum === "9" ? "P9SB" : `P${playerSeatNum}`]: {
                chips: chips[chipsPlayStyleKeys[j]]
              }
            }
          }
          if(Number(chipsPlayStyleKeys[j]) === 3) {
            tieBetChipsData.value = {
              ...tieBetChipsData.value,
              [playerSeatNum === "9" ? "T9SB" : `T${playerSeatNum}`]: {
                chips: chips[chipsPlayStyleKeys[j]]
              }
            }
          }
          if(Number(chipsPlayStyleKeys[j]) === 4) {
            playerPairBetChipsData.value = {
              ...playerPairBetChipsData.value,
              [playerSeatNum === "9" ? "P9SB" : `PP${playerSeatNum}`]: {
                chips: chips[chipsPlayStyleKeys[j]]
              }
            }
          }
          if(Number(chipsPlayStyleKeys[j]) === 5) {
            bankerPairBetChipsData.value = {
              ...bankerPairBetChipsData.value,
              [playerSeatNum === "9" ? "BP9SB" : `BP${playerSeatNum}`]: {
                chips: chips[chipsPlayStyleKeys[j]]
              }
            }
          }
          // Super6 待添加
        }
      } else {
        // 处理 旁座下注信息
        const sideBetInfo = tableUserInfoList.value[playerSeatNum]
        for (let k in sideBetInfo) {
          const sideBetChips = devideAmountToChips(sideBetInfo[k])
          // 玩法 k
          if (k === "1") {
            bankerBetChipsData.value = {
              ...bankerBetChipsData.value,
              ["B1SB"]: {
                chips: sideBetChips
              }
            }
          }
          if(k === "2") {
            playerBetChipsData.value = {
              ...playerBetChipsData.value,
              ["P9SB"]: {
                chips: sideBetChips
              }
            }
          }
          if(k === "3") {
            tieBetChipsData.value = {
              ...tieBetChipsData.value,
              ["P9SB"]: {
                chips: sideBetChips
              }
            }
          }
          if(k === "4") {
            bankerPairBetChipsData.value = {
              ...bankerPairBetChipsData.value,
              ["BP9SB"]: {
                chips: sideBetChips
              }
            }
          }
          if(k === "5") {
            playerPairBetChipsData.value = {
              ...playerPairBetChipsData.value,
              ["PP9SB"]: {
                chips: sideBetChips
              }
            }
          }
        }
      }
    }
  })
}

// const betLimitRedInfo = ref({})

onMounted(async () => {
  // 获取到 bet 当前桌台的下注信息之后
  // 当前桌台的状态，是否可以下注
  // await tableStatus()
  // 处理所有玩家的信息
  // await preProcessBetInfo()
  // console.log('当前用户的座位', userSeat);
})

watch(tableUserInfoList, async val => {
  if (val && Object.keys(val).length) {
    await preProcessBetInfo()
  }
})

function limitRedDict(play_style) {
  const style = Number(play_style)
  if (style === 1 || play_style === 2) {
    return 1
  }
  if (style === 3) {
    return 3
  }
  if (style === 4 || style === 5) {
    return 2
  }
  if (style === 6) { // Super 6
    return 4
  }
}

// 下注之前检查限红
function preCheckLimitRed(bet_amount, play_style) {
  try {
    const { min, max } = tool.local.get('roomDetail').public_red_limit_rules[limitRedDict(play_style)]
    if (bet_amount <= max) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.log('检查限红出错', error);
    return false
  }
}

// 计算投注筹码总额
function sumBetAmount(chips) {
  let sum = 0;
  Object.entries(chips).forEach(([key, value]) => {
    sum += Number(key) * value;
  });
  return sum
}
const updateUserBetInfos = inject('userBetInfos')
watch(userBetChips, val => {
  console.log('用户投注信息更新-userBetInfos', {
    userSeat,val
  });
  // if(val && Object.keys(val).length) {
  //   // const play_style_keys = Object.keys(val)
  //   updateUserBetInfos({
  //     seat: userSeat.value,
  //     chips: val
  //   })
  // }
})

// 点击区域
function calcBetPoint(area, bet_area_id) {
  if (forbidenBet.value) {
    ElMessage({
      type: 'warning',
      message: "禁止下注"
    })
    return
  }
  const content = ref(1)
  if (area === "B_Q_I") {
    content.value = 1
  }
  if (area === "P_Q_I") {
    content.value = 2
  }
  if (area === "T_Q_I") {
    content.value = 3
  }
  if (area === "BP_Q_I") {
    content.value = 4
  }
  if (area === "PP_Q_I") {
    content.value = 5
  }
  const chipQuetaValue = chipQueta.value

  // 暂时不修改现有的筹码放置方式， 等下一个版本
  // userToBetSingle(bet_area_id, chipQuetaValue)
  // return
  let tChips = userBetChips.value[content.value] ? userBetChips.value[content.value].chips : {}
  tChips[chipQuetaValue] ? tChips[chipQuetaValue] = tChips[chipQuetaValue] + 1 : tChips[chipQuetaValue] = 1
  // console.log('tChips', {
  //   content: content.value,
  //   tChips
  // });
  // 检查限红
  // if (!preCheckLimitRed(sumBetAmount(userBetChips.value[content.value].chips), content.value)) {
  //   ElMessage.warning({
  //     message: "不满足限红要求"
  //   })
  //   return
  // }
  userBetChips.value = {
    // ...userBetChips.value,
    [content.value]: {
      chips: {
        ...tChips,
        [chipQuetaValue]: tChips[chipQuetaValue]
      }
    }
  }
  // console.log('点击区域userBetChips', userBetChips.value);
  // setChipsPosition(userSeat.value, content.value, chipQuetaValue)
  // 只更新用户最后点击的筹码信息
  updateUserBetInfos({
      seat: userSeat.value,
      chips: chipQuetaValue,
      content: content.value
    })
    // 下注成功 就在桌台上放置筹码
}

// 用户单次点击下注
function userToBetSingle(area_id, chip_queta) {
  userBetChips.value[chip_queta] = (userBetChips.value[chip_queta] || 0) + 1
  const svg = document.getElementById(area_id);
  const chipValue = chip_queta
  // 收集现有筹码
  svg.querySelectorAll('image').forEach(chip => {
    const value = parseInt(chip.href.baseVal.match(/chip(\d+).svg/)[1]);
    userBetChips.value[value] = (userBetChips.value[value] || 0) + 1;
  });
  userBetChips.value[chipValue] = (userBetChips.value[chipValue] || 0) + 1;

  userBetChips.value = mergeChips(userBetChips.value)
  const chipSize = { width: 50, height: 50 };
  const baseY = 250;
  const offset = 10;

  // 清除现有的筹码
  svg.innerHTML = '';

  // 显示筹码
  Object.entries(userBetChips.value).forEach(([chipValue, count], index) => {
    for (let i = 0; i < count; i++) {
      const newY = baseY - (index + i) * offset;
      const newChip = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      newChip.setAttribute('width', chipSize.width);
      newChip.setAttribute('height', chipSize.height);
      newChip.setAttribute('x', 10);
      newChip.setAttribute('y', newY);
      const chipUrl = `https://game.cog-gaming666.com/images/chips/chip${chipValue}.svg`;
      newChip.setAttributeNS('http://www.w3.org/1999/xlink', 'href', chipUrl);
      svg.appendChild(newChip);
    }
  });
}

// 筹码 合并
function mergeChips(userChips) {
  const chips_queta_list = Object.keys(userChips)
  let newObj = {}
  // 每个面值对应的 筹码数组
  for (let i in chips_queta_list) {
    const chip_queta = Number(chips_queta_list[i])
    const next_chip_queta = all_chip_range[all_chip_range.findIndex(item => item === chip_queta) + 1]
    if (Number(chip_queta) * Number(userChips[chips_queta_list[i]]) < next_chip_queta) {
      newObj = {
        ...newObj,
        [chips_queta_list[i]]: userChips[chips_queta_list[i]]
      }
    } else {
      // const num = next_chip_queta / chip_queta
      let sum_num = 0;
      let chip_queta_length_arr = new Array(userChips[chips_queta_list[i]]).fill(chip_queta)
      let new_chip_queta_arr = {}
      let for_lock = true
      for (let k in chip_queta_length_arr) {
        sum_num = sum_num + chip_queta_length_arr[k]
        if (sum_num === next_chip_queta) {
          new_chip_queta_arr[next_chip_queta] = 1
          for_lock = false
          continue
        }
        if (for_lock) continue
        if (newObj[chip_queta]) {
          newObj[chip_queta] = newObj[chip_queta] + 1
        } else {
          if (!new_chip_queta_arr[chip_queta]) {
            new_chip_queta_arr[chip_queta] = 1
          } else {
            new_chip_queta_arr[chip_queta] = new_chip_queta_arr[chip_queta] + 1
          }
        }
      }
      newObj = {
        ...newObj,
        ...new_chip_queta_arr
      }
    }
  }
  return newObj
}

// 检查剩余位置
function checkLastSeats() {
  let arr = [5, 6, 3, 7, 2, 8]
  for (let seat in seatPreList) {
    arr = arr.filter(v => { if (v !== seatPreList[seat]) return v })
  }
  return arr[0] ? arr[0] : 0
}

defineExpose({
  clearTableChips,
  clearUserChips,
  setChipsPosition
})

</script>

<template>
  <div class="baccarat-table-box">
    <svg width="1366px" height="526px" viewBox="0 0 1366 526" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="table_Q8_hover" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <image width="1366px" height="526px" viewBox="0 0 1366 526px" x="0" y="0"
          xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM2NiIgaGVpZ2h0PSI1MjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJNMCAwaDEzNjZ2NTI2SDB6Ii8+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PG1hc2sgaWQ9ImIiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2EiLz48L21hc2s+PGcgbWFzaz0idXJsKCNiKSI+PGcgZmlsbD0iIzZCN0U3QyIgZmlsbC1ydWxlPSJub256ZXJvIj48cGF0aCBkPSJNMzM2LjMgMTg2LjRjLTEuMTQgMS40NS0yLjk3IDMuNzEtMy41IDQuNDNhMjI2Ni45IDIyNjYuOSAwIDAgMC0yNy45IDM4LjU2Yy0xMy42NyAxOS40NC0yMi42NyAzMy4yNy0yNC45NCAzOC44My04LjcgMTQuNDUtMi44OSAzMC4yNiAxNi42NSA0My4zNSAyMS43NCAxNC41NSA1OC4yOCAyNC41MiAxMDYuMSAyNy42NiA2NC41MiA0LjI1IDE4MC44MSA3Ljc3IDI4MC42OSA3Ljc3IDEwMC43OC0uMDMgMjE2LjQ5LTMuNTMgMjgwLjgtNy43NiA0Ny44Ni0zLjE1IDg0LjQyLTEzLjExIDEwNi4xNy0yNy42NyAxOS41NS0xMy4wOSAyNS4zOC0yOC45IDE2Ljc0LTQzLjItMi4zNC01LjcxLTExLjM0LTE5LjU0LTI1LjAyLTM4Ljk4bC0yLjMzLTMuM2EyMDY0LjA2IDIwNjQuMDYgMCAwIDAtMjUuNTYtMzUuMjZjLS40Ny0uNjMtMi41OC0zLjE0LTMuOTgtNC44M2gyLjg4YTgwOC40NSA4MDguNDUgMCAwIDEgMi43MSAzLjY1IDIyNjguMSAyMjY4LjEgMCAwIDEgMjcuOTIgMzguNmMxMy43NCAxOS41MSAyMi43MyAzMy4zMyAyNS4xMyAzOS4xNSA5LjIgMTUuMzEgMi45NSAzMi4yMy0xNy4zOCA0NS44NC0yMi4wOCAxNC43OC01OC45NyAyNC44My0xMDcuMTQgMjgtNjQuNTggNC4yNC0xODAuOSA3Ljc2LTI4MC45NCA3Ljc2LTEwMC43LS4wMy0yMTYuNDctMy41My0yODAuODItNy43Ny00OC4xNC0zLjE3LTg1LjAxLTEzLjIyLTEwNy4wOC0yOC0yMC4zMi0xMy42LTI2LjU2LTMwLjUyLTE3LjM2LTQ1LjgzIDIuNC01LjgyIDExLjQtMTkuNjQgMjUuMTMtMzkuMTZsMi4zNC0zLjNhMjA2Ni4xNCAyMDY2LjE0IDAgMCAxIDI3Ljk5LTM4LjU0aDIuN3ptLTYuODgtLjRsLTMuNTUgNC45M2EyMzM4LjMgMjMzOC4zIDAgMCAwLTI4LjQxIDM5LjhjLTEzLjk0IDIwLjA2LTIzLjExIDM0LjMzLTI1LjQyIDQwLjA4LTguODggMTQuOTMtMi45NCAzMS4yNyAxNi45OCA0NC43OCAyMi4xNCAxNS4wMyA1OS4zNyAyNS4zMSAxMDguMSAyOC41NiA2NS43MyA0LjM5IDE4NC4yIDguMDEgMjg1Ljk2IDguMDIgMTAyLjY3LS4wMyAyMjAuNTYtMy42NCAyODYuMS04LjAxIDQ4Ljc1LTMuMjUgODYtMTMuNTMgMTA4LjE2LTI4LjU2IDE5LjkzLTEzLjUyIDI1Ljg4LTI5Ljg2IDE3LjA3LTQ0LjY1LTIuMzktNS44OS0xMS41NS0yMC4xNi0yNS41LTQwLjIybC0yLjM3LTMuNDFhMjEzMC4xIDIxMzAuMSAwIDAgMC0yNi4wNC0zNi4zOWMtLjUyLS43MS0yLjU4LTMuNC0zLjc1LTQuOTNoMi42MWwuNDcuNjNhOTUyLjU2IDk1Mi41NiAwIDAgMSAyLjI5IDMuMTIgMjM0MCAyMzQwIDAgMCAxIDI4LjQ0IDM5Ljg0YzE0IDIwLjE1IDIzLjE2IDM0LjQgMjUuNiA0MC40IDkuMzcgMTUuOCAzIDMzLjIzLTE3LjcgNDcuMjctMjIuNSAxNS4yNS02MC4wOCAyNS42Mi0xMDkuMTUgMjguOS02NS44IDQuMzgtMTg0LjMgOC0yODYuMjMgOC0xMDIuNTctLjAyLTIyMC41My0zLjY0LTI4Ni4xLTguMDEtNDkuMDUtMy4yNy04Ni42LTEzLjY1LTEwOS4wOS0yOC45LTIwLjY5LTE0LjA0LTI3LjA0LTMxLjQ3LTE3LjY4LTQ3LjI2IDIuNDQtNiAxMS42LTIwLjI1IDI1LjYtNDAuNGwyLjM5LTMuNDJBMjEzMS45MiAyMTMxLjkyIDAgMCAxIDMyNyAxODZoMi40em0tODYuNyAwbC0yLjI2IDIuOTRhNzg5Ny44NyA3ODk3Ljg3IDAgMCAwLTEzLjQgMTcuMSAxMDAwNi41MyAxMDAwNi41MyAwIDAgMC0zMi45IDQyLjI5Yy0yNi44IDM0LjY2LTQzLjYgNTcuMDUtNDQuODMgNjAuMDktMTIuNDcgMTcuMjgtMi42MyAzMy41IDI3Ljk1IDQ3LjA3IDMwLjg3IDEzLjcgODEuMTcgMjMuODIgMTQ0LjYyIDI4LjgxIDg4LjQgNi45NSAyMjUuNjYgMTEuMTEgMzYxLjUzIDExLjEyIDEzNi4xNS0uMDEgMjczLjM2LTQuMTYgMzYxLjc5LTExLjEgNjMuNS01IDExMy44My0xNS4xIDE0NC43My0yOC44MiAzMC42MS0xMy41NyA0MC40Ny0yOS43OSAyOC4xMS00Ni44Ny0xLjM0LTMuMjUtMTguMTQtMjUuNjQtNDQuOTQtNjAuM2wtMS4xNS0xLjVhMTAwMDcuNjIgMTAwMDcuNjIgMCAwIDAtNDUuMTYtNTcuOWMtLjMtLjM4LTEuMzYtMS44OS0yLjEtMi45M2gyLjM0bC41Ni43Mi43Ny45OGE3ODg0LjkgNzg4NC45IDAgMCAxIDEzLjQgMTcuMSAxMDAwOC42NSAxMDAwOC42NSAwIDAgMSAzMi45MiA0Mi4zYzI2Ljk4IDM0Ljg5IDQzLjM4IDU2Ljc0IDQ1LjA1IDYwLjQ1IDEzLjIgMTguMzUgMi41NyAzNS43OS0yOC45OCA0OS43OC0zMS4xNSAxMy44Mi04MS43IDIzLjk3LTE0NS40IDI4Ljk4LTg4LjQ5IDYuOTUtMjI1Ljc0IDExLjEtMzYxLjk0IDExLjEtMTM1LjkyIDAtMjczLjIyLTQuMTYtMzYxLjY5LTExLjEyLTYzLjY1LTUtMTE0LjE1LTE1LjE2LTE0NS4yNy0yOC45Ny0zMS41Mi0xNC00Mi4xNC0zMS40Mi0yOC45NC00OS43NyAxLjY2LTMuNzEgMTguMDctMjUuNTYgNDUuMDQtNjAuNDRsMS4xNi0xLjVhMTAwMDguNDUgMTAwMDguNDUgMCAwIDEgNDUuMTYtNTcuOWwuNzctMSAuNTctLjcxaDIuNXptLTg2LjYyIDBMMjYuNTIgMzQ2LjI4Yy0xNC40NCAxNy43Ni00LjY5IDMyLjY5IDI4LjI3IDQ1LjM5IDMwLjc2IDExLjg1IDgxLjEgMjEuMzYgMTQ5LjA2IDI4LjY2IDExNy4yNyAxMi42IDI4My4zNCAxOC4zMiA0NzkuOTcgMTguMzQgMTk3LjI3LS4wMiAzNjMuMzQtNS43MyA0ODAuNi0xOC4zNCA2Ny45Ni03LjMgMTE4LjMxLTE2LjgxIDE0OS4wNi0yOC42NiAzMi45Ny0xMi43IDQyLjcyLTI3LjYzIDI4LjI3LTQ1LjM5TDEyMTIuNCAxODZoMi4zOWwxMjguNTIgMTU5LjAyYzE1LjU2IDE5LjEzIDQuOTMgMzUuNC0yOS4xIDQ4LjUxLTMwLjk2IDExLjkzLTgxLjQ1IDIxLjQ3LTE0OS41NyAyOC44LTExNy4zNiAxMi42LTI4My40OCAxOC4zMi00ODAuMTggMTguMzQtMTk3LjM0LS4wMi0zNjMuNDctNS43My00ODAuODItMTguMzUtNjguMTItNy4zMi0xMTguNi0xNi44Ni0xNDkuNTctMjguNzktMzQuMDMtMTMuMS00NC42Ni0yOS4zOC0yOS4xLTQ4LjVMMTUzLjQ5IDE4NmgyLjZ6Ii8+PHBhdGggZD0iTTMyOCAxODZsLTEgMkgwdi0yaDMyOHptMTAzOCAwdjJoLTMyN2wtMS0yaDMyOHptLTMzMyAwdjJIMzMzdi0yaDcwMHoiLz48L2c+PGcgc3Ryb2tlPSIjNkI3RTdDIj48cGF0aCBkPSJNNjgyLjY5IDQ5MC4wNFYzNTIuOE01NTkuNzUgMzUxLjU0bC04Mi4yMiAxMzIuNDVNMzkxLjUgMzQ0LjczTDIxNi4wNSA0NjBNMjY3LjggMjc3Ljg3TC0uODYgMzU4LjQyTTgwNS43NyAzNTEuODVsODIuNCAxMzIuNzNNOTc1LjIyIDM0NS42NWwxNzMuNDUgMTEzLjkzTTEwOTguNzMgMjc4LjIzbDI2OCA4MC4zNiIvPjwvZz48ZyBzdHJva2U9IiM2QjdFN0MiPjxwYXRoIGQ9Ik02ODIuNjkgMzQ4LjAydi01LjhtMC0zMi4yOXYtNi43M001OTAuMTggMzAyLjVsLTQuMzIgNi45N20tMTkuNDQgMzEuMzNsLTMuNTcgNS43NE00NjAuNzMgMjk5LjI3bC04Ljg2IDUuODJtLTQ0Ljc2IDI5LjRsLTguMjQgNS40MU0zOTIuOTEgMjQwLjM2bC03LjU2IDIuMjdNMjgzLjQgMjczLjJsLTcuMDMgMi4xTTc3NS4xOSAzMDIuNThsNC4yNSA2Ljg1bTE5LjQyIDMxLjNsMy43MyA2TTkwNS4zIDI5OS43M2w5LjA0IDUuOTRtNDQuMTcgMjkuMDFsOC41OSA1LjY0TTk3NS41NCAyNDEuM2w3LjY0IDIuM20xMDEuMzEgMzAuMzdsNy4wNiAyLjExIi8+PC9nPjxnIHN0cm9rZT0iIzZCN0U3QyI+PHBhdGggZD0iTTk2Ny42MiAxMDhsMzYuNjYgNzNoMzU4LjlsLTc2LjQyLTczSDk2Ny42MnpNMzk4LjA1IDEwOGwtMzYuNjcgNzNIMi41bDc2LjQyLTczaDMxOS4xNHoiIHN0cm9rZS13aWR0aD0iMiIvPjxnIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPjxwYXRoIGQ9Ik0zNTcuMSAxMDguMjdsLTMuODQgNi43M00zMTcuNzggMTA3Ljk5bC00LjQ2IDYuOTZNMjc3LjMgMTA4LjE0bC00Ljk3IDYuOTdNMjM3LjI0IDEwOC4xOWwtNS4yNyA2LjczTTE5Ny41MyAxMDcuOTVsLTYuMDcgNy4xM00xNTYuNzYgMTA3Ljk1bC02LjU1IDcuMDhNMTE3LjMgMTA3Ljg4bC03LjEgNy4xNCIvPjwvZz48ZyBzdHJva2UtbGluZWNhcD0ic3F1YXJlIj48cGF0aCBkPSJNMTAwOC45IDEwOC4yN2wzLjg0IDYuNzNNMTA0OC4yMiAxMDcuOTlsNC40NiA2Ljk2TTEwODguNyAxMDguMTRsNC45NyA2Ljk3TTExMjguNzYgMTA4LjE5bDUuMjcgNi43M00xMTY4LjQ3IDEwNy45NWw2LjA3IDcuMTNNMTIwOS4yNCAxMDcuOTVsNi41NSA3LjA4TTEyNDguNyAxMDcuODhsNy4xIDcuMTQiLz48L2c+PC9nPjxnPjxwYXRoIGQ9Ik0xMDkzLjQzIDMyNi4zOGw5Ljc3LS44NmMyLjEzLS4xOCAzLjg0LjE4IDUuMTMgMS4xYTQuODcgNC44NyAwIDAgMSAyLjAxIDMuN2MuMSAxLjItLjEgMi4yNC0uNiAzLjEyYTUuMjkgNS4yOSAwIDAgMS0yLjMgMS45OGMxLjQzLjE1IDIuNTMuNjIgMy4zMiAxLjQzYTUuMzIgNS4zMiAwIDAgMSAxLjM1IDMuMzRjLjE5IDIuMTYtLjQyIDMuOC0xLjggNC45NS0xLjE4Ljk1LTIuOTQgMS41Mi01LjIgMS43MmwtOS44MS44Ni0xLjg3LTIxLjM0em0zLjc1IDIuNTZsLjUzIDYuMSA1LjM1LS40N2MxLjUtLjEzIDIuNTItLjQ5IDMuMS0xLjAyLjU2LS41Ni44Mi0xLjQuNzItMi41LS4wOS0xLjAyLS40OC0xLjc0LTEuMTItMi4xNC0uNy0uNDItMS43NC0uNTctMy4xNy0uNDRsLTUuNDEuNDd6bS43OCA4Ljk3bC41OCA2LjYzIDUuOC0uNWE2LjQ2IDYuNDYgMCAwIDAgMy4wNi0uOWMuOS0uNjMgMS4zMS0xLjUgMS4yLTIuNy0uMS0xLjIzLS41NC0yLjA2LTEuMjctMi41NC0uNzctLjQ3LTEuOTItLjY0LTMuNDgtLjVsLTUuODkuNXpNNDQ2LjMzIDM2MC41OGg5LjgxYzIuMTMgMCAzLjgxLjUxIDUuMDEgMS41M2E0Ljg3IDQuODcgMCAwIDEgMS42OCAzLjg3YzAgMS4yLS4zIDIuMjItLjg3IDMuMDZhNS4yOSA1LjI5IDAgMCAxLTIuNDYgMS43N2MxLjQxLjI3IDIuNDYuODQgMy4xOCAxLjcxYTUuMzIgNS4zMiAwIDAgMSAxLjA1IDMuNDVjMCAyLjE2LS43NSAzLjc1LTIuMjIgNC43Ny0xLjI2Ljg0LTMuMDYgMS4yNi01LjM0IDEuMjZoLTkuODR2LTIxLjQyem0zLjUxIDIuODh2Ni4xMmg1LjM3YzEuNSAwIDIuNTUtLjI3IDMuMTgtLjc1LjYtLjUxLjkzLTEuMzIuOTMtMi40MyAwLTEuMDItLjMzLTEuNzctLjkzLTIuMjItLjY2LS40OC0xLjY4LS43Mi0zLjEyLS43MmgtNS40M3ptMCA5djYuNjZoNS44MmMxLjMyIDAgMi4zNy0uMjEgMy4xMi0uNjMuOTYtLjU0IDEuNDQtMS4zOCAxLjQ0LTIuNTggMC0xLjIzLS4zNi0yLjEtMS4wNS0yLjY0LS43Mi0uNTQtMS44Ni0uODEtMy40Mi0uODFoLTUuOXpNNjA2Ljc1IDM3My41MWg3LjV2LTUuNjRoMy4xOHY1LjY0aDcuNjV2My4wM2gtNy42NXY3LjVoOS4xMnYzLjA2aC0yMS41N3YtMy4wNmg5LjI3di03LjVoLTcuNXYtMy4wM3ptNy43Ny0xMy4yNmMuNDUuOTYuOSAyLjA0IDEuMzIgMy4yMWgxMC43MXYzLjAzaC0yMS44N3Y2LjE4Yy0uMDkgNi40NS0xLjA1IDExLjY0LTIuODUgMTUuNTRsLTIuNjctMi4zN2MxLjUtMy4xOCAyLjI4LTcuNTYgMi4zNC0xMy4xN3YtOS4yMWgxMC45Yy0uNDMtLjkzLS44OC0xLjgtMS4zOS0yLjYxbDMuNTEtLjZ6TTI2MS42NSAzMzQuNzlsNy40Ny42NS41LTUuNjEgMy4xNi4yNy0uNSA1LjYyIDcuNjMuNjctLjI3IDMuMDItNy42Mi0uNjctLjY1IDcuNDcgOS4wOC44LS4yNiAzLjA0LTIxLjQ5LTEuODguMjctMy4wNCA5LjIzLjguNjUtNy40Ny03LjQ3LS42NS4yNy0zLjAyem04LjktMTIuNTNjLjM2IDEgLjcxIDIuMSAxLjAzIDMuMzFsMTAuNjcuOTMtLjI3IDMuMDItMjEuNzgtMS45LS41NCA2LjE1Yy0uNjUgNi40Mi0yLjA2IDExLjUtNC4yIDE1LjI0bC0yLjQ1LTIuNmMxLjc3LTMuMDQgMi45My03LjMzIDMuNDgtMTIuOTFsLjgtOS4xOCAxMC44NS45NWMtLjM0LS45Ni0uNy0xLjg3LTEuMTUtMi43MmwzLjU1LS4zek05MDguNzUgMzcwLjUxaDcuNXYtNS42NGgzLjE4djUuNjRoNy42NXYzLjAzaC03LjY1djcuNWg5LjEydjMuMDZoLTIxLjU3di0zLjA2aDkuMjd2LTcuNWgtNy41di0zLjAzem03Ljc3LTEzLjI2Yy40NS45Ni45IDIuMDQgMS4zMiAzLjIxaDEwLjcxdjMuMDNoLTIxLjg3djYuMThjLS4wOSA2LjQ1LTEuMDUgMTEuNjQtMi44NSAxNS41NGwtMi42Ny0yLjM3YzEuNS0zLjE4IDIuMjgtNy41NiAyLjM0LTEzLjE3di05LjIxaDEwLjljLS40My0uOTMtLjg4LTEuOC0xLjM5LTIuNjFsMy41MS0uNnpNMTExMi42NCAyNDAuODN2LTcuNUgxMTA3di0zLjE4aDUuNjR2LTcuNjVoMy4wM3Y3LjY1aDcuNXYtOS4xMmgzLjA2djIxLjU4aC0zLjA2di05LjI4aC03LjV2Ny41aC0zLjAzem0tMTMuMjYtNy43N2MuOTYtLjQ0IDIuMDQtLjkgMy4yLTEuMzF2LTEwLjcyaDMuMDR2MjEuODdoNi4xOGM2LjQ1LjEgMTEuNjQgMS4wNSAxNS41NCAyLjg1bC0yLjM3IDIuNjdjLTMuMTgtMS41LTcuNTYtMi4yOC0xMy4xNy0yLjM0aC05LjIxVjIzNS4yYy0uOTMuNDMtMS44Ljg3LTIuNjEgMS4zOGwtLjYtMy41ek0xMjAxLjk5IDI0Ni40MXYtOS44MWMwLTIuMTMuNTEtMy44MSAxLjUzLTUuMDFhNC44NyA0Ljg3IDAgMCAxIDMuODctMS42OGMxLjIgMCAyLjIyLjMgMy4wNi44N2E1LjI5IDUuMjkgMCAwIDEgMS43NyAyLjQ2IDUuMjIgNS4yMiAwIDAgMSAxLjcxLTMuMTggNS4zMiA1LjMyIDAgMCAxIDMuNDUtMS4wNWMyLjE2IDAgMy43NS43NSA0Ljc3IDIuMjIuODQgMS4yNiAxLjI2IDMuMDYgMS4yNiA1LjM0djkuODRoLTIxLjQyem0yLjg4LTMuNTFoNi4xMnYtNS4zN2MwLTEuNS0uMjctMi41NS0uNzUtMy4xOC0uNTEtLjYtMS4zMi0uOTMtMi40My0uOTMtMS4wMiAwLTEuNzcuMzMtMi4yMi45My0uNDguNjYtLjcyIDEuNjgtLjcyIDMuMTJ2NS40M3ptOSAwaDYuNjZ2LTUuODJjMC0xLjMyLS4yMS0yLjM3LS42My0zLjEyLS41NC0uOTYtMS4zOC0xLjQ0LTIuNTgtMS40NC0xLjIzIDAtMi4xLjM2LTIuNjQgMS4wNS0uNTQuNzItLjgxIDEuODYtLjgxIDMuNDJ2NS45MXoiIGZpbGw9IiNBQjJCMjAiLz48cGF0aCBkPSJNNzUzLjM2IDQwNC41OGg4Ljg4YzUuMTYgMCA3Ljc3IDIuMTkgNy43NyA2LjU3IDAgNC40MS0yLjYxIDYuNjMtNy44MyA2LjYzaC01LjMxVjQyNmgtMy41MXYtMjEuNDJ6bTMuNSAzdjcuMmg1LjFjMS41NyAwIDIuNy0uMyAzLjQzLS44NC43Mi0uNTcgMS4wOC0xLjUgMS4wOC0yLjc5cy0uNC0yLjE5LTEuMTEtMi43M2MtLjcyLS41Ny0xLjg2LS44NC0zLjQtLjg0aC01LjF6TTQwOC4zNiA0MDAuNThoOC44OGM1LjE2IDAgNy43NyAyLjE5IDcuNzcgNi41NyAwIDQuNDEtMi42MSA2LjYzLTcuODMgNi42M2gtNS4zMVY0MjJoLTMuNTF2LTIxLjQyem0zLjUgM3Y3LjJoNS4xYzEuNTcgMCAyLjctLjMgMy40My0uODQuNzItLjU3IDEuMDgtMS41IDEuMDgtMi43OXMtLjQtMi4xOS0xLjExLTIuNzNjLS43Mi0uNTctMS44Ni0uODQtMy40LS44NGgtNS4xek0xNjguMDMgMjI2LjM5djguODhjMCA1LjE2LTIuMTkgNy43Ny02LjU3IDcuNzctNC40IDAtNi42My0yLjYxLTYuNjMtNy44M3YtNS4zMWgtOC4yMnYtMy41MWgyMS40MnptLTMgMy41aC03LjJ2NS4xYzAgMS41Ni4zIDIuNy44NCAzLjQyLjU4LjcyIDEuNSAxLjA4IDIuOCAxLjA4IDEuMjkgMCAyLjE5LS4zOSAyLjczLTEuMS41Ny0uNzIuODQtMS44Ni44NC0zLjR2LTUuMXpNMjQ5LjU1IDIyMy43M3Y2LjAzaDQuMjN2Mi44OWgtNC4yM3Y1LjdoLTIuODJ2LTUuN2gtLjc4YTUyLjIxIDUyLjIxIDAgMCAxLTYuNTQgNi45bC0yLjA3LTIuMDVhMzguMDMgMzguMDMgMCAwIDAgNS4yMi00Ljg2aC05LjQ1di0yLjg4aDEwLjkyYTI2Ljc2IDI2Ljc2IDAgMCAxLTcuODMtNS42bDMtMS44NmEyMC40IDIwLjQgMCAwIDAgNy41MyA2LjV2LTUuMDdoMi44MnptLTE3Ljg4IDE2LjIzdi0yLjQzbDIuODItLjc4LS4xIDIuNThjMCAuNzguNTUgMS4yIDEuNTcgMS4yaDE5LjE3di0xMS4xOWgyLjc2djE0LjEzaC0yMi43N2MtMi4yOSAwLTMuNDYtMS4xNy0zLjQ2LTMuNXptMjIuNTMtMjEuMzZ2Mi45NGgtMjIuOHYtMi45NGgyMi44em01LjI4IDUuMDdhMjYuMjggMjYuMjggMCAwIDEtNC40NCAzLjAzbC0xLjMyLTIuNTVhMjcuNjQgMjcuNjQgMCAwIDAgNC41Ni0zLjEybDEuMiAyLjY0ek0xMTk0LjQ2IDM2Ni4zNWw4Ljg0LS43OGM1LjE0LS40NSA3LjkzIDEuNSA4LjMxIDUuODcuMzkgNC40LTIuMDIgNi44My03LjIyIDcuMjlsLTUuMjkuNDYuNzIgOC4xOS0zLjUuMy0xLjg2LTIxLjMzem0zLjc1IDIuNjhsLjYzIDcuMTcgNS4wOC0uNDRjMS41Ni0uMTQgMi42Ny0uNTQgMy4zNC0xLjE0LjY2LS42My45NC0xLjU5LjgzLTIuODctLjExLTEuMjktLjU4LTIuMTUtMS4zNS0yLjYyLS43Ni0uNS0xLjkyLS42OC0zLjQ1LS41NWwtNS4wOC40NXpNNTk0Ljc2IDQxMWg2LjAzdi00LjIzaDIuODhWNDExaDUuN3YyLjgyaC01Ljd2Ljc4YTUyLjIxIDUyLjIxIDAgMCAxIDYuOSA2LjU0bC0yLjA0IDIuMDdhMzguMDMgMzguMDMgMCAwIDAtNC44Ni01LjIydjkuNDVoLTIuODh2LTEwLjkyYTI2Ljc2IDI2Ljc2IDAgMCAxLTUuNiA3LjgzbC0xLjg3LTNhMjAuNCAyMC40IDAgMCAwIDYuNTEtNy41M2gtNS4wN1Y0MTF6TTYxMSA0MjguODhoLTIuNDNsLS43OC0yLjgyIDIuNTguMDljLjc4IDAgMS4yLS41NCAxLjItMS41NnYtMTkuMTdoLTExLjE5di0yLjc2aDE0LjEzdjIyLjc3YzAgMi4yOC0xLjE3IDMuNDUtMy41IDMuNDV6bS0yMS4zNi0yMi41M2gyLjk0djIyLjhoLTIuOTR2LTIyLjh6bTUuMDctNS4yOGEyNi4yOCAyNi4yOCAwIDAgMSAzLjAzIDQuNDRsLTIuNTUgMS4zMmEyNy42NCAyNy42NCAwIDAgMC0zLjEyLTQuNTZsMi42NC0xLjJ6TTE1OC4xNSAzNzUuMzhsNiAuNTIuMzctNC4yIDIuODcuMjQtLjM3IDQuMjIgNS42OC41LS4yNCAyLjgtNS42OC0uNS0uMDcuNzhhNTIuMjEgNTIuMjEgMCAwIDEgNi4zIDcuMTJsLTIuMiAxLjg4YTM4LjAzIDM4LjAzIDAgMCAwLTQuNC01LjYybC0uODIgOS40MS0yLjg3LS4yNS45NS0xMC44OGEyNi43NiAyNi43NiAwIDAgMS02LjI3IDcuMzFsLTEuNTktMy4xNWEyMC40IDIwLjQgMCAwIDAgNy4xNC02LjkzbC01LjA1LS40NC4yNS0yLjgxem0xNC42IDE5LjIzbC0yLjQxLS4yMi0uNTMtMi44NyAyLjU2LjMxYy43OC4wNyAxLjI0LS40MyAxLjMzLTEuNDVsMS42Ny0xOS4xLTExLjE1LS45Ny4yNC0yLjc1IDE0LjA4IDEuMjMtMS45OCAyMi42OGMtLjIgMi4yOC0xLjQ3IDMuMzQtMy44IDMuMTR6bS0xOS4zLTI0LjMxbDIuOTIuMjYtMS45OSAyMi43LTIuOTItLjI1IDEuOTgtMjIuNzF6bTUuNS00LjgyYzEuMDIgMS40MiAxLjg4IDMgMi42NCA0LjY5bC0yLjY2IDEuMWMtLjgtMS44LTEuNjktMy40LTIuNzEtNC44MmwyLjczLS45N3pNOTQ3Ljc2IDQwN2g2LjAzdi00LjIzaDIuODhWNDA3aDUuN3YyLjgyaC01Ljd2Ljc4YTUyLjIxIDUyLjIxIDAgMCAxIDYuOSA2LjU0bC0yLjA0IDIuMDdhMzguMDMgMzguMDMgMCAwIDAtNC44Ni01LjIydjkuNDVoLTIuODh2LTEwLjkyYTI2Ljc2IDI2Ljc2IDAgMCAxLTUuNiA3LjgzbC0xLjg3LTNhMjAuNCAyMC40IDAgMCAwIDYuNTEtNy41M2gtNS4wN1Y0MDd6TTk2NCA0MjQuODhoLTIuNDNsLS43OC0yLjgyIDIuNTguMDljLjc4IDAgMS4yLS41NCAxLjItMS41NnYtMTkuMTdoLTExLjE5di0yLjc2aDE0LjEzdjIyLjc3YzAgMi4yOC0xLjE3IDMuNDUtMy41IDMuNDV6bS0yMS4zNi0yMi41M2gyLjk0djIyLjhoLTIuOTR2LTIyLjh6bTUuMDctNS4yOGEyNi4yOCAyNi4yOCAwIDAgMSAzLjAzIDQuNDRsLTIuNTUgMS4zMmEyNy42NCAyNy42NCAwIDAgMC0zLjEyLTQuNTZsMi42NC0xLjJ6IiBmaWxsPSIjMjQ0RkM0Ii8+PHBhdGggZD0iTTc0MC4zMyAzNjMuNThoOS44MWMyLjEzIDAgMy44MS41MSA1LjAxIDEuNTNhNC44NyA0Ljg3IDAgMCAxIDEuNjggMy44N2MwIDEuMi0uMyAyLjIyLS44NyAzLjA2YTUuMjkgNS4yOSAwIDAgMS0yLjQ2IDEuNzdjMS40MS4yNyAyLjQ2Ljg0IDMuMTggMS43MWE1LjMyIDUuMzIgMCAwIDEgMS4wNSAzLjQ1YzAgMi4xNi0uNzUgMy43NS0yLjIyIDQuNzctMS4yNi44NC0zLjA2IDEuMjYtNS4zNCAxLjI2aC05Ljg0di0yMS40MnptMy41MSAyLjg4djYuMTJoNS4zN2MxLjUgMCAyLjU1LS4yNyAzLjE4LS43NS42LS41MS45My0xLjMyLjkzLTIuNDMgMC0xLjAyLS4zMy0xLjc3LS45My0yLjIyLS42Ni0uNDgtMS42OC0uNzItMy4xMi0uNzJoLTUuNDN6bTAgOXY2LjY2aDUuODJjMS4zMiAwIDIuMzctLjIxIDMuMTItLjYzLjk2LS41NCAxLjQ0LTEuMzggMS40NC0yLjU4IDAtMS4yMy0uMzYtMi4xLTEuMDUtMi42NC0uNzItLjU0LTEuODYtLjgxLTMuNDItLjgxaC01Ljl6IiBmaWxsPSIjQUIyQjIwIi8+PHBhdGggZD0iTTg0Mi43NiA0NDUuNThsLTEuMTcgMTIuMDZoMy4yN2MuNDItLjc1Ljk5LTEuMjkgMS43NC0xLjY1YTUuMzUgNS4zNSAwIDAgMSAyLjQtLjQ4YzEuMzggMCAyLjQ2LjM5IDMuMTggMS4yM2E0Ljk2IDQuOTYgMCAwIDEgMS4xMSAzLjM5YzAgMS4zMi0uNDUgMi4zNy0xLjI5IDMuMTVhNC42NSA0LjY1IDAgMCAxLTMuMjEgMS4xN2MtMS4xNyAwLTIuMS0uMjctMi43Ni0uNzVhMy42MiAzLjYyIDAgMCAxLTEuMzgtMi42MWgtMy40NWE2LjI1IDYuMjUgMCAwIDAgMi41NSA0Ljc0IDguMDYgOC4wNiAwIDAgMCA1LjAxIDEuNTkgOC41IDguNSAwIDAgMCA1LjUyLTEuODkgNi43NSA2Ljc1IDAgMCAwIDIuNTItNS40M2MwLTIuMzEtLjY2LTQuMTQtMS45Mi01LjQ2YTYuNSA2LjUgMCAwIDAtNC45Mi0xLjk4Yy0uOTYgMC0xLjgzLjE1LTIuNjEuNDVhNS45IDUuOSAwIDAgMC0yLjI4IDEuNDRoLS4wOWwuNi01Ljg4aDEwLjIzdi0zLjA5aC0xMy4wNXpNNDY5LjkgNDQyLjU4djMuMThoMTAuOTVMNDczLjE3IDQ2NGgzLjcybDcuNS0xOC42di0yLjgyek0xMDkxLjIxIDQzMi4xNmMtMi4xIDAtMy44NC41Ny01LjE5IDEuNzctMS40NCAxLjItMi4yMiAyLjg4LTIuNCA1LjA0aDMuNDVjLjEyLTEuMjkuNTQtMi4yNSAxLjI2LTIuODguNjktLjYzIDEuNjUtLjkzIDIuOTEtLjkzIDEuMjMgMCAyLjE2LjI3IDIuNzkuODEuNTcuNTQuODcgMS4zMi44NyAyLjM3cy0uMzMgMS44Ni0uOTYgMi40Yy0uNjYuNTQtMS42Mi44MS0yLjg4LjgxaC0xLjV2Mi42NGgxLjVjMS4zOCAwIDIuNDMuMjcgMy4xNS44Ny43Mi41NyAxLjExIDEuNDcgMS4xMSAyLjcgMCAxLjAyLS4zNiAxLjg2LTEuMDUgMi41NWE0LjQ2IDQuNDYgMCAwIDEtMy4yMSAxLjE0IDQuMjIgNC4yMiAwIDAgMS0yLjk3LTEuMDVjLS44NC0uNzUtMS4yNi0xLjgzLTEuMzItMy4yMWgtMy41N2MuMTggMi40IDEuMDIgNC4yNiAyLjUyIDUuNTIgMS4zNSAxLjE0IDMuMTUgMS43MSA1LjM3IDEuNzEgMi4zNCAwIDQuMjMtLjY2IDUuNjctMS45NWE2LjI4IDYuMjggMCAwIDAgMi4wNy00Ljg2YzAtMS4yNi0uMzYtMi4zMS0xLjA4LTMuMTJhNi4wNiA2LjA2IDAgMCAwLTIuOTEtMS43NGMyLjM3LS43OCAzLjU3LTIuMzQgMy41Ny00LjY4YTUuMyA1LjMgMCAwIDAtMS45NS00LjM1Yy0xLjMyLTEuMDUtMy4wOS0xLjU2LTUuMjUtMS41NnpNMTMxNi4zMyAzOTYuMTZjLTIuMzEgMC00LjE3Ljc4LTUuNTggMi4zNC0xLjM4IDEuNDctMi4wNyAzLjM5LTIuMSA1Ljc5aDMuNTFjLjA2LTEuNjguNDItMi45NyAxLjA4LTMuODEuNjYtLjkgMS42NS0xLjM1IDIuOTctMS4zNSAxLjIzIDAgMi4xNi4yNyAyLjc5Ljg0LjYuNTcuOTMgMS40NC45MyAyLjYxIDAgMS4yLS40OCAyLjM0LTEuNDEgMy4zOS0uNi42My0xLjU2IDEuNDQtMi45NCAyLjQtMi40OSAxLjcxLTQuMTQgMy4wMy00LjkyIDMuOTNhOC4yNiA4LjI2IDAgMCAwLTIuMTMgNS43aDE0Ljk0di0zLjA5aC0xMC41NmMuNDgtMS4wOCAxLjgtMi4zNCAzLjk5LTMuNzggMi4xLTEuNDEgMy42LTIuNTUgNC40NC0zLjQ1YTcuNDIgNy40MiAwIDAgMCAyLjEtNS4wN2MwLTEuOTItLjY2LTMuNDUtMS45OC00LjY1YTcuNDMgNy40MyAwIDAgMC01LjEzLTEuOHpNMjE5IDQyNy4xNmMyLjI4IDAgNC4xMS42IDUuNDkgMS44M2E1LjI1IDUuMjUgMCAwIDEgMS44MyA0LjA1YzAgMS4wOC0uMjQgMi4wMS0uNzIgMi43NmE1LjExIDUuMTEgMCAwIDEtMi4zNyAxLjgzdi4wNmMuOTkuMjcgMS44Ni44NyAyLjU4IDEuOGE1LjUgNS41IDAgMCAxIDEuMjMgMy41MWMwIDEuOTItLjcyIDMuNDUtMi4xIDQuNjUtMS40MSAxLjE3LTMuMzkgMS43Ny01Ljk0IDEuNzctMi41OCAwLTQuNTYtLjYtNS45NC0xLjc3YTUuNzggNS43OCAwIDAgMS0yLjEtNC42NWMwLTEuMzIuMzktMi40OSAxLjIzLTMuNTFhNC43NiA0Ljc2IDAgMCAxIDIuNTgtMS44di0uMDZhNC44MiA0LjgyIDAgMCAxLTIuMzctMS44MyA1LjA0IDUuMDQgMCAwIDEtLjcyLTIuNzZjMC0xLjYyLjYtMi45NyAxLjgzLTQuMDUgMS4zNS0xLjIzIDMuMTgtMS44MyA1LjQ5LTEuODN6bTAgMi43OWMtMS4yNiAwLTIuMjguMzMtMy4wMyAxLjAyLS42Ni42LS45OSAxLjMyLS45OSAyLjE5IDAgLjk5LjI3IDEuNzcuODEgMi4zNC42Ni42OSAxLjcxIDEuMDUgMy4yMSAxLjA1IDEuNDcgMCAyLjU1LS4zNiAzLjIxLTEuMDUuNTQtLjU3LjgxLTEuMzUuODEtMi4zNCAwLS44Ny0uMzMtMS41OS0uOTktMi4xOWE0LjM2IDQuMzYgMCAwIDAtMy4wMy0xLjAyem0wIDkuMjFjLTEuNSAwLTIuNjQuMzYtMy40MiAxLjA4YTMuNSAzLjUgMCAwIDAtMS4xNCAyLjc2YzAgMS4wOC4zOSAxLjk1IDEuMiAyLjYxLjc4LjY2IDEuODkuOTkgMy4zNi45OWE1LjQgNS40IDAgMCAwIDMuNDItMS4wMiAzLjI2IDMuMjYgMCAwIDAgMS4xNC0yLjU4YzAtMS4xNC0uMzktMi4wNy0xLjExLTIuNzMtLjgxLS43NS0xLjk1LTEuMTEtMy40NS0xLjExeiIgZmlsbD0iIzZCN0U3QyIvPjxwYXRoIGQ9Ik0yNC4yOCAxOTguODFjMC0xLjUyLS4zNC0yLjc4LTEuMDItMy43OGEzLjM4IDMuMzggMCAwIDAtMi45Ni0xLjU4Yy0xLjI0IDAtMi4yLjU0LTIuODYgMS42NC0uMjQuNDQtLjYyIDEuNTItMS4xOCAzLjI4LS40OCAxLjU4LS44IDIuNTItLjk2IDIuODQtLjQ2LjktMS4wOCAxLjM2LTEuODggMS4zNi0uNjQgMC0xLjE0LS4zMi0xLjUtLjk2YTUuMjUgNS4yNSAwIDAgMS0uNTYtMi41OGMwLTEuMi4yMi0yLjA4LjY2LTIuNjYuNDgtLjY0IDEuMy0xLjA0IDIuNDItMS4ydi0yLjE2Yy0xLjguMTItMy4xMi43Ni0zLjk2IDEuOTRhNy4wNyA3LjA3IDAgMCAwLTEuMDQgNC4wOGMwIDEuOC4zNiAzLjIgMS4wOCA0LjIuNzQgMSAxLjc0IDEuNSAzLjAyIDEuNSAxLjMyIDAgMi4zNC0uNjIgMy4wOC0xLjg0LjM0LS41Ni44LTEuODIgMS40LTMuNzQuNC0xLjM0LjctMi4xNi44OC0yLjQ4LjM4LS43Mi44OC0xLjA2IDEuNTItMS4wNi43MiAwIDEuMjQuMyAxLjU2LjkyLjI4LjUuNDIgMS4yMi40MiAyLjE2IDAgMS4wOC0uMiAxLjg4LS42MiAyLjQ0LS40LjU2LTEuMDguOTItMiAxLjEydjIuMTZjMS41Ni0uMTQgMi43LS43IDMuNDQtMS43LjcyLS45NCAxLjA2LTIuMjQgMS4wNi0zLjl6bS0uMjggOC41NEg5LjcydjIuMTZIMjR2LTIuMTZ6bTAgNS41N3Y1LjJjMCAyLjMtLjY0IDQuMDQtMS45NCA1LjI0LTEuMiAxLjEyLTIuOTQgMS42OC01LjIgMS42OC0yLjI0IDAtMy45OC0uNTgtNS4yMi0xLjcyLTEuMjgtMS4yLTEuOTItMi45NC0xLjkyLTUuMjR2LTUuMTZIMjR6bS0xLjg2IDIuMThIMTEuNTh2Mi41OGMwIDEuOC40NCAzLjE0IDEuMyAzLjk4Ljg2LjgyIDIuMTggMS4yNCAzLjk4IDEuMjQgMS44NCAwIDMuMTYtLjQyIDQtMS4yMi44Ni0uODQgMS4yOC0yLjE2IDEuMjgtMy45NnYtMi42MnpNMjQgMjI3LjgySDkuNzJ2MTAuNmgxLjg2VjIzMGg0LjU0djcuNmgxLjg2VjIzMGg0LjE2djguMDhIMjR2LTEwLjI2em0wIDIwLjZ2Ni41MmMwIDEuNC0uMzIgMi40OC0xIDMuMjhhMy4yMSAzLjIxIDAgMCAxLTIuNiAxLjE0Yy0uOCAwLTEuNDgtLjItMi4wNC0uNi0uNTItLjQtLjkyLS45NC0xLjE4LTEuNjZhMy41MyAzLjUzIDAgMCAxLTEuMTQgMi4xNGMtLjU4LjQ4LTEuMzYuNzItMi4zMi43Mi0xLjQ0IDAtMi40OC0uNS0zLjE2LTEuNDhhNi4zNSA2LjM1IDAgMCAxLS44NC0zLjU0di02LjUySDI0em0tMS44IDIuMThoLTQuMjZ2My43NmMwIDEgLjE4IDEuNzIuNTIgMi4xNi4zNi40NC45Mi42NiAxLjY4LjY2LjcyIDAgMS4yNC0uMjIgMS41Ni0uNjYuMzQtLjQ0LjUtMS4xNi41LTIuMTJ2LTMuOHptLTYuMDQgMGgtNC42NHY0LjA0YzAgLjkyLjE2IDEuNjQuNDQgMi4xNi4zOC42NC45OC45OCAxLjguOTguODQgMCAxLjQ2LS4yNiAxLjg0LS43Ni4zOC0uNS41Ni0xLjI4LjU2LTIuMzJ2LTQuMXpNMjQgMjYyLjczSDkuNzJ2MTAuNmgxLjg2di04LjQyaDQuNTR2Ny42aDEuODZ2LTcuNmg0LjE2djguMDhIMjR2LTEwLjI2ek0yNCAyNzVoLTEuODZ2NC43OEg5LjcydjIuMTZoMTIuNDJ2NC43NkgyNFYyNzV6TTEzMzkuMTMgMjMyLjAxdi03LjJjLS41LjE2LS45Ni4zMi0xLjQuNDhsLS4zMi0xLjljLjUyLS4xNiAxLjA4LS4zMiAxLjcyLS40OHYtNi43NGgxLjc2djMuMjhjLjY2LjE4IDEuMy40MiAxLjkuN3YtNC4xNGgzLjM0djEuODhoLTEuNjJ2MTIuMzhoMS42MnYxLjg4aC0zLjM0di0zLjk4Yy0uNjguMjItMS4zMi40NC0xLjkuNjh2My4xNmgtMS43NnptMy42Ni05Ljg4Yy0uNjItLjMyLTEuMjYtLjU2LTEuOS0uNzR2NS40NGMuNTgtLjIgMS4yMi0uMzggMS45LS41NnYtNC4xNHptNC4wOCAxMC43OHYtNy43NmMtLjU0LjI0LTEuMDQuNDgtMS41Ljc0bC0uMzItMS45MmMuNTQtLjI0IDEuMTQtLjQ4IDEuODItLjcydi03Ljk2aDEuNzZ2MTAuMjZjLjQ4LjA0LjkyLjEyIDEuMzYuMjR2LThjMi45OC4wMiA0LjcyLjM4IDUuMjQgMS4wOC4yLjI4LjM0LjcyLjQ0IDEuMy4wOC41Mi4xMiAxLjA2LjEyIDEuNTh2Mi4yNmwtMS43NC41Mi4wMi0zLjFjLS4wMi0uNTgtLjEtMS0uMjQtMS4yNC0uMTgtLjI2LS45LS40Mi0yLjE2LS40NnY2LjcyYzEuOSAxLjA0IDMuMzggMi45MiA0LjQyIDUuNjJsLTEuNzIgMS4wOGMtMS4xMi0zLjQ0LTMuMDQtNS4zMi01Ljc0LTUuNjR2NS40aC0xLjc2em0tOS4wOC0yMi4xOGwxLjMyIDEuMzhhMTkuMzEgMTkuMzEgMCAwIDEgMy0zLjVsLTEuMzYtMS4zNmEyOC41IDI4LjUgMCAwIDAtMi45NiAzLjQ4em00LjcuNDhsMS4zIDEuMzZjMS4xLTEuNCAyLjEyLTIuNSAzLjA0LTMuM2wtMS4zNi0xLjM2Yy0xIC45LTIgMi0yLjk4IDMuM3ptNS42Mi0yLjE0YzIuMzYuOTIgNC42OCAxLjk4IDYuOTQgMy4xOGwuODQtMS45YTYzLjIgNjMuMiAwIDAgMC03LjA4LTIuOThsLS43IDEuN3ptLTcuMy0yLjM4aDEuODZ2LTUuMDRoNC4yOHY0LjQ4aDEuODJ2LTQuNDhoNC43NHY1LjU0aDEuODZ2LTEyLjgyaC0xLjg2djUuMzhoLTQuNzR2LTQuNDJoLTEuODJ2NC40MmgtNC4yOHYtNC45NmgtMS44NnY0Ljk2bC0uMDItLjA2Yy0xIC4zMi0yLjEuNzYtMy4zIDEuMzRsLjUgMS43NmMuOS0uNDYgMS44NC0uODYgMi44Mi0xLjIydjUuMTJ6IiBmaWxsPSIjNkI3RTdDIiBvcGFjaXR5PSIuOSIvPjxwYXRoIGQ9Ik02NjYuMyA0NDUuMTZjNC4yIDAgNi41NyAxLjk1IDcuMTEgNS44NWgtMy40MmMtLjQyLTEuOTgtMS42OC0yLjk3LTMuNzItMi45Ny0xLjQ0IDAtMi41OC42OS0zLjQyIDIuMWE5LjA1IDkuMDUgMCAwIDAtMS4yMyA0Ljk1di4yN2guMTVjLjYtLjkgMS4zNS0xLjUzIDIuMjUtMS45NS44NC0uNDIgMS44LS42IDIuODgtLjYgMi4xIDAgMy43OC42NiA1LjA0IDIuMDFhNy4zMiA3LjMyIDAgMCAxIDEuODkgNS4xOWMwIDIuMTYtLjc1IDMuOTMtMi4xOSA1LjMxYTcuNSA3LjUgMCAwIDEtNS4zNyAyLjFjLTIuNjQgMC00LjY1LS45Ni02LjAzLTIuODUtMS4zOC0xLjg2LTIuMDQtNC40MS0yLjA0LTcuNjggMC0zLjUxLjcyLTYuMzMgMi4xOS04LjQ5YTYuNzYgNi43NiAwIDAgMSA1LjkxLTMuMjR6bS0uMTUgMTAuNWMtMS4zMiAwLTIuMzQuMzktMy4wNiAxLjJhNC41NSA0LjU1IDAgMCAwLTEuMTEgMy4yN2MwIDEuMzUuMzkgMi40MyAxLjE3IDMuMjFhNC4wNSA0LjA1IDAgMCAwIDMgMS4xN2MxLjI2IDAgMi4yNS0uNDIgMy4wMy0xLjI2YTQuNTcgNC41NyAwIDAgMCAxLjE3LTMuMjRjMC0xLjMyLS4zOS0yLjM3LTEuMTEtMy4xNWE0LjA3IDQuMDcgMCAwIDAtMy4wOS0xLjJ6IiBmaWxsPSIjNkI3RTdDIi8+PHBhdGggZD0iTTExOS41MSAxMzguNjZoNi42NXYtNC40N2gyLjUydjQuNDdoMi40djIuNDJoLTIuNHYxMi40YzAgMS45My0xIDIuODktMy4wMiAyLjg5aC0zLjU4bC0uNTUtMi40NWMxLjE1LjEgMi4yMy4xNyAzLjI2LjE3LjkxIDAgMS4zNy0uNDEgMS4zNy0xLjIzdi0xMS43OGgtNi42NXYtMi40MnptLTguMTggMS43NWE5MS4xIDkxLjEgMCAwIDEgMy44NCA0LjQ5IDE5Ljk1IDE5Ljk1IDAgMCAwIDEuMjUtNi4wOGgtNi4zNHYtMi40Mmg4LjUydjEuODJhMjEuNCAyMS40IDAgMCAxLTEuODUgOC43NCA1My43IDUzLjcgMCAwIDEgMi41IDMuNThsLTEuODcgMS44N2MtLjU4LTEuMDEtMS4yLTIuMDItMS45Mi0zLjA1YTI1IDI1IDAgMCAxLTUuMDIgNS42NGwtMS40NC0yLjE2YTE4LjczIDE4LjczIDAgMCAwIDUuMDItNS41MiA3OS45NyA3OS45NyAwIDAgMC00LjQtNS4zbDEuNy0xLjYxem05LjkzIDIuOTNhMzguNjggMzguNjggMCAwIDEgMy41NiA1LjA4bC0xLjk3IDEuNGEzNy42MSAzNy42MSAwIDAgMC0zLjUtNS4xbDEuOTEtMS4zOHptMTIuOTQuODRIMTQ0di0yLjkzYTM1LjIzIDM1LjIzIDAgMCAwIDUuMzMtMy44MmgtMTIuNjJ2LTIuMzVoMTUuOTZ2Mi4zNWE0NS4xNCA0NS4xNCAwIDAgMS02LjE1IDUuMDd2MS42OGg4LjgzdjIuNDRoLTguODN2Ny4yM2MwIDEuNi0uODEgMi40Mi0yLjQgMi40MmgtNC4yN2wtLjY3LTIuNDJjMS4yLjA1IDIuNS4wNyAzLjkxLjA3LjYgMCAuOTEtLjI5LjkxLS44NnYtNi40NGgtOS44MXYtMi40NHptMjcuOTgtMTAuMDhoMi4yOGMtMS4wMSAxLjY1LTEuNzggMy4zLTIuMyA0Ljk2YTE4LjgzIDE4LjgzIDAgMCAwIDAgMTIuNDhjLjUyIDEuNjQgMS4yOSAzLjMgMi4zIDQuOTdoLTIuMjhhMjAuMyAyMC4zIDAgMCAxLTIuNjQtNC45IDE4LjA3IDE4LjA3IDAgMCAxLTEuMS02LjI4YzAtMi4yMS4zNS00LjMgMS4xLTYuMzFhMTkuMTggMTkuMTggMCAwIDEgMi42NC00Ljkyem0xMC4wNyA3Ljg0aDQuODN2LTMuMzhoMi4zdjMuMzhoNC41NnYyLjI2aC00LjU2di42MmE0MS43NyA0MS43NyAwIDAgMSA1LjUyIDUuMjRsLTEuNjMgMS42NWMtMS0xLjM0LTIuMy0yLjczLTMuODktNC4xN3Y3LjU2aC0yLjN2LTguNzRhMjEuNCAyMS40IDAgMCAxLTQuNDkgNi4yNmwtMS40OS0yLjRhMTYuMzEgMTYuMzEgMCAwIDAgNS4yMS02LjAyaC00LjA2di0yLjI2em0xMi45OSAxNC4zaC0xLjk1bC0uNjItMi4yNSAyLjA2LjA3Yy42MyAwIC45Ni0uNDMuOTYtMS4yNHYtMTUuMzRoLTguOTV2LTIuMmgxMS4zdjE4LjJjMCAxLjgzLS45MyAyLjc3LTIuOCAyLjc3em0tMTcuMDktMTguMDJoMi4zNXYxOC4yNGgtMi4zNXYtMTguMjR6bTQuMDYtNC4yMmMuOSAxLjA2IDEuNyAyLjI2IDIuNDIgMy41NWwtMi4wNCAxLjA2YTIyLjExIDIyLjExIDAgMCAwLTIuNS0zLjY1bDIuMTItLjk2em0xOS41NS4xaDIuMjhhMTkuOTQgMTkuOTQgMCAwIDEgMi42NCA0LjkyIDE4LjU4IDE4LjU4IDAgMCAxIDAgMTIuNiAyMS4xNyAyMS4xNyAwIDAgMS0yLjY0IDQuOWgtMi4yOGEyNi45NCAyNi45NCAwIDAgMCAyLjMtNC45OCAxOS43IDE5LjcgMCAwIDAgMS4wNi02LjI0YzAtMi4wOC0uMzYtNC4xNy0xLjA1LTYuMjRhMjUuNTcgMjUuNTcgMCAwIDAtMi4zLTQuOTZ6bTE4LjAyIDIuN2g3LjFjNC4xMyAwIDYuMjIgMS43NiA2LjIyIDUuMjYgMCAzLjUzLTIuMDkgNS4zLTYuMjYgNS4zaC00LjI1djYuNThoLTIuODF2LTE3LjEzem0yLjggMi40djUuNzdoNC4wOWMxLjI1IDAgMi4xNi0uMjQgMi43My0uNjcuNTgtLjQ2Ljg3LTEuMi44Ny0yLjI0IDAtMS4wMy0uMzEtMS43NS0uOS0yLjE4LS41Ny0uNDYtMS40OC0uNjctMi43LS42N2gtNC4wOHptMTUuMiAxMS4xMmMuNTIgMCAuOTYuMTcgMS4zNC41NS4zNi4zNi41NS44Mi41NSAxLjM1IDAgLjUyLS4xOS45Ni0uNTUgMS4zNC0uMzguMzQtLjgyLjUzLTEuMzQuNTMtLjUzIDAtLjk5LS4yLTEuMzItLjUzYTEuOCAxLjggMCAwIDEtLjU2LTEuMzRjMC0uNTMuMTctLjk5LjU2LTEuMzUuMzMtLjM4Ljc5LS41NSAxLjMyLS41NXptMTQuMzItMTMuNTFoNy4xYzQuMTMgMCA2LjIyIDEuNzUgNi4yMiA1LjI1IDAgMy41My0yLjEgNS4zLTYuMjcgNS4zaC00LjI0djYuNThoLTIuODF2LTE3LjEzem0yLjggMi40djUuNzZIMjQ5YzEuMjQgMCAyLjE2LS4yNCAyLjczLS42Ny41OC0uNDYuODctMS4yLjg3LTIuMjQgMC0xLjAzLS4zMi0xLjc1LS45LTIuMTgtLjU3LS40Ni0xLjQ4LS42Ny0yLjctLjY3aC00LjA4em0xOC40Ni0yLjRoMy4xOWw2LjU1IDE3LjEzaC0zbC0xLjU2LTQuM2gtNy4xN2wtMS41NiA0LjNoLTNsNi41NS0xNy4xM3ptLTEuMTUgMTAuNTNoNS41bC0yLjctNy41aC0uMWwtMi43IDcuNXptMTMuMjQtMTAuNTNoMi44djE3LjEzaC0yLjh2LTE3LjEzem02Ljg0IDBoNy42M2MxLjc1IDAgMy4xNC4zOCA0LjE1IDEuMTdhNC41NyA0LjU3IDAgMCAxIDEuNiAzLjc1YzAgLjg5LS4yMyAxLjY4LS43MSAyLjM3YTMuNzMgMy43MyAwIDAgMS0yLjE5IDEuNTJ2LjA0YzEuNS4zNCAyLjMzIDEuMzIgMi41MiAzbC4zIDIuNzZjLjA5IDEuMDYuNDUgMS45IDEuMDIgMi41MmgtMy4wNGE0LjMgNC4zIDAgMCAxLS43NS0yLjIzbC0uMjEtMi4xMWMtLjEtLjk0LS4zOS0xLjYtLjg3LTIuMDItLjUtLjQzLTEuMjUtLjYyLTIuMi0uNjJoLTQuNDV2Ni45OGgtMi44di0xNy4xM3ptMi44IDIuNHY1LjM1aDQuNDRjMS4xIDAgMS45NS0uMjQgMi41Mi0uNy41My0uNDguOC0xLjE1LjgtMi4wMSAwLS45NC0uMjctMS42MS0uOC0yLjAyLS41Mi0uNDMtMS4zNi0uNjItMi41Mi0uNjJoLTQuNDR6IiBmaWxsPSIjMjQ0RkM0Ii8+PHBhdGggZD0iTTEwODIuNTEgMTM4LjU2aDYuNjV2LTQuNDZoMi41MnY0LjQ2aDIuNHYyLjQyaC0yLjR2MTIuNDFjMCAxLjkyLTEgMi44OC0zLjAyIDIuODhoLTMuNThsLS41NS0yLjQ1YzEuMTUuMSAyLjIzLjE3IDMuMjYuMTcuOTEgMCAxLjM3LS40IDEuMzctMS4yMnYtMTEuNzloLTYuNjV2LTIuNDJ6bS04LjE4IDEuNzVhOTEuMSA5MS4xIDAgMCAxIDMuODQgNC40OSAxOS45NSAxOS45NSAwIDAgMCAxLjI1LTYuMDdoLTYuMzR2LTIuNDNoOC41MnYxLjgzYTIxLjQgMjEuNCAwIDAgMS0xLjg1IDguNzMgNTMuNyA1My43IDAgMCAxIDIuNSAzLjU4bC0xLjg3IDEuODdjLS41OC0xLTEuMi0yLjAxLTEuOTItMy4wNWEyNSAyNSAwIDAgMS01LjAyIDUuNjRsLTEuNDQtMi4xNmExOC43MyAxOC43MyAwIDAgMCA1LjAyLTUuNTIgNzkuOTcgNzkuOTcgMCAwIDAtNC40LTUuM2wxLjctMS42em05LjkzIDIuOTNhMzguNjggMzguNjggMCAwIDEgMy41NiA1LjA5bC0xLjk3IDEuMzlhMzcuNjEgMzcuNjEgMCAwIDAtMy41LTUuMDlsMS45MS0xLjM5em0xMi45NC44NGg5Ljgxdi0yLjkzYTM1LjIzIDM1LjIzIDAgMCAwIDUuMzMtMy44MWgtMTIuNjJ2LTIuMzZoMTUuOTZ2Mi4zNmE0NS4xNCA0NS4xNCAwIDAgMS02LjE1IDUuMDZ2MS42OGg4LjgzdjIuNDVoLTguODN2Ny4yMmMwIDEuNjEtLjgxIDIuNDMtMi40IDIuNDNoLTQuMjdsLS42Ny0yLjQzYzEuMi4wNSAyLjUuMDcgMy45MS4wNy42IDAgLjkxLS4yOC45MS0uODZ2LTYuNDNoLTkuODF2LTIuNDV6bTI3Ljk4LTEwLjA4aDIuMjhjLTEuMDEgMS42Ni0xLjc4IDMuMzEtMi4zIDQuOTdhMTguODMgMTguODMgMCAwIDAgMCAxMi40OGMuNTIgMS42MyAxLjI5IDMuMjkgMi4zIDQuOTdoLTIuMjhhMjAuMyAyMC4zIDAgMCAxLTIuNjQtNC45IDE4LjA3IDE4LjA3IDAgMCAxLTEuMS02LjI5YzAtMi4yLjM1LTQuMyAxLjEtNi4zMWExOS4xOCAxOS4xOCAwIDAgMSAyLjY0LTQuOTJ6bTEwLjg3IDEwLjY2aDZ2LTQuNTJoMi41NHY0LjUyaDYuMTJ2Mi40MmgtNi4xMnY2aDcuM3YyLjQ1aC0xNy4yNnYtMi40NWg3LjQydi02aC02di0yLjQyem02LjIxLTEwLjYxYy4zNi43Ny43MiAxLjYzIDEuMDYgMi41N2g4LjU3djIuNDJoLTE3LjV2NC45NGMtLjA3IDUuMTYtLjg0IDkuMzItMi4yOCAxMi40NGwtMi4xNC0xLjljMS4yLTIuNTQgMS44My02LjA1IDEuODgtMTAuNTR2LTcuMzZoOC43Yy0uMzMtLjc1LS42OS0xLjQ0LTEuMS0yLjFsMi44MS0uNDd6bTEyLjUtLjA1aDIuMjhhMTkuOTQgMTkuOTQgMCAwIDEgMi42NCA0LjkyIDE4LjU4IDE4LjU4IDAgMCAxIDAgMTIuNiAyMS4xNyAyMS4xNyAwIDAgMS0yLjY0IDQuOWgtMi4yOGEyNi45NCAyNi45NCAwIDAgMCAyLjMtNC45NyAxOS43IDE5LjcgMCAwIDAgMS4wNi02LjI0YzAtMi4wOS0uMzYtNC4xOC0xLjA1LTYuMjRhMjUuNTcgMjUuNTcgMCAwIDAtMi4zLTQuOTd6bTE4LjAyIDIuNzFoNy44NWMxLjcgMCAzLjA1LjQxIDQgMS4yM2EzLjkgMy45IDAgMCAxIDEuMzUgMy4xYzAgLjk1LS4yNCAxLjc3LS43IDIuNDRhNC4yMyA0LjIzIDAgMCAxLTEuOTYgMS40MmMxLjEyLjIxIDEuOTYuNjcgMi41NCAxLjM2LjU1LjY4Ljg0IDEuNjEuODQgMi43NiAwIDEuNzMtLjYgMy0xLjc4IDMuODItMSAuNjctMi40NCAxLTQuMjcgMWgtNy44N3YtMTcuMTN6bTIuOCAyLjN2NC45aDQuM2MxLjIgMCAyLjA0LS4yMSAyLjU1LS42LjQ4LS40Ljc0LTEuMDUuNzQtMS45NCAwLS44Mi0uMjYtMS40Mi0uNzQtMS43OC0uNTMtLjM4LTEuMzUtLjU3LTIuNS0uNTdoLTQuMzR6bTAgNy4ydjUuMzNoNC42NmMxLjA2IDAgMS45LS4xNiAyLjUtLjUuNzctLjQzIDEuMTUtMS4xIDEuMTUtMi4wNiAwLS45OS0uMjktMS42OC0uODQtMi4xMi0uNTctLjQzLTEuNDktLjY0LTIuNzMtLjY0aC00Ljczem0xNi4wNCA0LjAxYy41MiAwIC45Ni4xNyAxLjM0LjU2LjM2LjM2LjU1LjgxLjU1IDEuMzRzLS4xOS45Ni0uNTUgMS4zNGMtLjM4LjM0LS44Mi41My0xLjM0LjUzLS41MyAwLS45OS0uMTktMS4zMi0uNTNhMS44IDEuOCAwIDAgMS0uNTYtMS4zNGMwLS41My4xNy0uOTguNTYtMS4zNC4zMy0uMzkuNzktLjU2IDEuMzItLjU2em0xNC4zMi0xMy41aDcuMWM0LjEzIDAgNi4yMiAxLjc0IDYuMjIgNS4yNSAwIDMuNTMtMi4xIDUuMy02LjI3IDUuM2gtNC4yNHY2LjU4aC0yLjgxVjEzNi43em0yLjggMi40djUuNzVoNC4wOWMxLjI0IDAgMi4xNi0uMjQgMi43My0uNjcuNTgtLjQ2Ljg3LTEuMi44Ny0yLjIzcy0uMzItMS43NS0uOS0yLjE5Yy0uNTctLjQ1LTEuNDgtLjY3LTIuNy0uNjdoLTQuMDh6bTE4LjQ2LTIuNGgzLjE5bDYuNTUgMTcuMTNoLTNsLTEuNTYtNC4zaC03LjE3bC0xLjU2IDQuM2gtM2w2LjU1LTE3LjE0em0tMS4xNSAxMC41M2g1LjVsLTIuNy03LjUxaC0uMWwtMi43IDcuNXptMTMuMjQtMTAuNTRoMi44djE3LjE0aC0yLjhWMTM2Ljd6bTYuODQgMGg3LjYzYzEuNzUgMCAzLjE0LjM5IDQuMTUgMS4xOGE0LjU3IDQuNTcgMCAwIDEgMS42IDMuNzRjMCAuODktLjIzIDEuNjgtLjcxIDIuMzhhMy43MyAzLjczIDAgMCAxLTIuMTkgMS41MXYuMDVjMS41LjMzIDIuMzMgMS4zMiAyLjUyIDNsLjMgMi43NmMuMDkgMS4wNS40NSAxLjkgMS4wMiAyLjUyaC0zLjA0YTQuMyA0LjMgMCAwIDEtLjc1LTIuMjNsLS4yMS0yLjEyYy0uMS0uOTMtLjM5LTEuNi0uODctMi4wMS0uNS0uNDMtMS4yNS0uNjMtMi4yLS42M2gtNC40NXY2Ljk5aC0yLjhWMTM2Ljd6bTIuOCAyLjR2NS4zNWg0LjQ0YzEuMSAwIDEuOTUtLjI0IDIuNTItLjcuNTMtLjQ3LjgtMS4xNC44LTIgMC0uOTQtLjI3LTEuNjItLjgtMi4wMi0uNTItLjQ0LTEuMzYtLjYzLTIuNTItLjYzaC00LjQ0eiIgZmlsbD0iI0FCMkIyMCIvPjxwYXRoIGQ9Ik02NjYuOSAzMTQuMDh2MjQuNzhoLTMuMDZ2LTIuMTZoLTYuMTZ2Mi41MmgtMy4wMnYtMjUuMTRoMTIuMjR6bS05LjIyIDE5LjY4aDYuMTZ2LTE2Ljc3aC02LjE2djE2Ljc3em0tMTYuNTUtMTMuNDd2Mi45MWg0Ljkxdi4xNWEyMi40OCAyMi40OCAwIDAgMS01Ljc4IDcuOTJsMS4zNSAzLjQ1YTMwLjY3IDMwLjY3IDAgMCAwIDQuNDMtNi42djExLjY3aDN2LTEyLjQ1Yy45IDEuMTQgMS45OSAyLjY0IDMuMjUgNC41bDEuODMtMi43M2E2Mi40NSA2Mi40NSAwIDAgMC01LjA4LTQuODN2LTEuMDhoNC44di0yLjkxaC00Ljh2LTMuODdjMS41Ny0uMzYgMy4xMy0uODQgNC42Ni0xLjM4bC0xLjQ4LTIuNThjLTIuNzUgMS4wNS02LjUgMS43Ny0xMS4xOSAyLjE2bDEuMDIgMi43OWE0NS4xIDQ1LjEgMCAwIDAgNC0uNDV2My4zM2gtNC45MnptNDAuMS00LjcxdjNoNy4wMlYzMzdoMy41MXYtMTguNDJoNy4wMnYtM2gtMTcuNTR6bTIwLjk0IDBWMzM3aDMuNTF2LTIxLjQyaC0zLjV6bTguNTYgMFYzMzdoMTUuOTV2LTNoLTEyLjQ0di02LjQ4aDExLjIydi0zaC0xMS4yM3YtNS45NGgxMS45NHYtM2gtMTUuNDR6IiBmaWxsPSIjNTY5RjNCIi8+PGcgZmlsbD0iIzZCN0U3QyI+PHBhdGggZD0iTTk3MS4xMiAyNzQuMjdhMy41OCAzLjU4IDAgMCAwLS42NCAyLjk2Yy4yLjk5LjggMS44MiAxLjc3IDIuNTJsMS0xLjQ0YTMuMjcgMy4yNyAwIDAgMS0xLjI0LTEuNTNjLS4xOC0uNTMtLjA4LTEuMDcuMy0xLjYuMzUtLjUxLjcyLS44MSAxLjE0LS45LjQtLjA5Ljg1LjAyIDEuMzMuMzYuNS4zNC44Mi44Ny45OSAxLjU1LjA4LjQzLjE0IDEuMDUuMTQgMS45LS4wMiAxLjUuMDUgMi41Ni4yIDMuMTNhNC4xMyA0LjEzIDAgMCAwIDEuNzIgMi41MWw0LjI4LTYuMTItMS4yNi0uODgtMy4wMyA0LjMyYy0uMy0uNS0uNDQtMS40LS40LTIuNzIuMDItMS4yNi0uMDItMi4yLS4xNC0yLjgtLjIzLTEtLjcyLTEuNzktMS40OC0yLjMyYTIuOTggMi45OCAwIDAgMC0yLjQ3LS41MmMtLjg4LjItMS42MS43NC0yLjIgMS41OHpNODUwLjYgMzAyLjA4Yy0xLjA1IDAtMS45Mi4yOC0yLjU5Ljg5YTMuNDkgMy40OSAwIDAgMC0xLjIgMi41MWgxLjczYy4wNi0uNjQuMjYtMS4xMi42My0xLjQ0LjM0LS4zMS44Mi0uNDYgMS40NS0uNDYuNjEgMCAxLjA4LjEzIDEuNC40LjI4LjI3LjQzLjY2LjQzIDEuMTkgMCAuNTItLjE3LjkzLS40OCAxLjItLjMzLjI3LS44MS40LTEuNDQuNGgtLjc1djEuMzJoLjc1Yy42OSAwIDEuMjEuMTQgMS41Ny40NC4zNi4yOC41Ni43My41NiAxLjM1IDAgLjUxLS4xOC45My0uNTMgMS4yNy0uMzkuMzgtLjkzLjU3LTEuNi41Ny0uNjIgMC0xLjExLS4xOC0xLjQ5LS41Mi0uNDItLjM4LS42My0uOTItLjY2LTEuNmgtMS43OGMuMDkgMS4yLjUxIDIuMTIgMS4yNiAyLjc1LjY3LjU3IDEuNTcuODYgMi42OC44NmE0LjEgNC4xIDAgMCAwIDIuODQtLjk4IDMuMTQgMy4xNCAwIDAgMCAxLjAzLTIuNDNjMC0uNjMtLjE4LTEuMTUtLjU0LTEuNTZhMy4wMyAzLjAzIDAgMCAwLTEuNDUtLjg3YzEuMTktLjM5IDEuNzktMS4xNyAxLjc5LTIuMzQgMC0uOTMtLjMzLTEuNjUtLjk4LTIuMTdhNC4xMSA0LjExIDAgMCAwLTIuNjMtLjc4ek03MjYuMzggMzAyLjI5bC0uNTggNi4wM2gxLjYzYy4yMS0uMzguNS0uNjQuODctLjgyLjMzLS4xNy43NC0uMjUgMS4yLS4yNS42OSAwIDEuMjMuMiAxLjU5LjYyLjM2LjQuNTUuOTcuNTUgMS43IDAgLjY2LS4yMiAxLjE4LS42NCAxLjU3LS40NC4zOS0uOTguNTgtMS42LjU4LS41OSAwLTEuMDUtLjEzLTEuMzgtLjM3YTEuOCAxLjggMCAwIDEtLjctMS4zaC0xLjcyYy4wOC45OC41IDEuNzggMS4yOCAyLjM2LjY5LjUzIDEuNTMuOCAyLjUuOCAxLjA3IDAgMS45OC0uMzIgMi43Ni0uOTUuODQtLjcgMS4yNi0xLjYgMS4yNi0yLjcxYTMuOCAzLjggMCAwIDAtLjk2LTIuNzMgMy4yNSAzLjI1IDAgMCAwLTIuNDYtLjk5Yy0uNDggMC0uOTIuMDctMS4zLjIyLS40NC4xNS0uODEuNC0xLjE0LjcyaC0uMDVsLjMtMi45NGg1LjExdi0xLjU0aC02LjUyek02MzQuNjUgMzAyLjA4YzIuMSAwIDMuMjguOTggMy41NiAyLjkyaC0xLjcyYy0uMi0uOTgtLjg0LTEuNDgtMS44Ni0xLjQ4LS43MiAwLTEuMjkuMzQtMS43IDEuMDVhNC41MiA0LjUyIDAgMCAwLS42MiAyLjQ4di4xM2guMDdjLjMtLjQ1LjY4LS43NyAxLjEzLS45OC40Mi0uMi45LS4zIDEuNDQtLjMgMS4wNSAwIDEuODkuMzMgMi41MiAxLjAxLjYzLjY3Ljk0IDEuNTQuOTQgMi42IDAgMS4wOC0uMzcgMS45Ni0xLjA5IDIuNjVhMy43NSAzLjc1IDAgMCAxLTIuNjkgMS4wNSAzLjUgMy41IDAgMCAxLTMuMDEtMS40MmMtLjY5LS45NC0xLjAyLTIuMjEtMS4wMi0zLjg1YTcuNCA3LjQgMCAwIDEgMS4xLTQuMjQgMy4zOCAzLjM4IDAgMCAxIDIuOTUtMS42MnptLS4wOCA1LjI1Yy0uNjYgMC0xLjE3LjItMS41My42LS4zNy4zOS0uNTUuOTQtLjU1IDEuNjMgMCAuNjguMiAxLjIyLjU4IDEuNjEuNC4zOS44OS41OCAxLjUuNTguNjQgMCAxLjEzLS4yIDEuNTItLjYzLjM5LS40Mi41OS0uOTUuNTktMS42MiAwLS42Ni0uMi0xLjE4LS41Ni0xLjU3LS4zOS0uNC0uOS0uNi0xLjU0LS42ek01MTQuNDUgMzAyLjI5djEuNTloNS40OGwtMy44NCA5LjEyaDEuODVsMy43NS05LjN2LTEuNDF6TTM5OC4wNiAyNzguNDVjLjY1Ljk0LjkzIDEuODYuODIgMi43OC0uMS44LS40NyAxLjQ0LTEuMTMgMS45LS40NC4zMi0uOS40OS0xLjM0LjUtLjQ3IDAtLjk1LS4xMy0xLjQzLS40NGwtLjAyLjAyYy4xNy40OC4xOCAxIDAgMS41N2EyLjc1IDIuNzUgMCAwIDEtMS4wOCAxLjVjLS43OS41Ni0xLjYyLjctMi41MS40OGE0LjUzIDQuNTMgMCAwIDEtMi40My0xLjkyIDQuNDcgNC40NyAwIDAgMS0uOTgtMi45NCAyLjkgMi45IDAgMCAxIDEuMy0yLjIgMi42NyAyLjY3IDAgMCAxIDEuOC0uNWMuNTguMDMgMS4wNy4yIDEuNDcuNTRsLjAzLS4wMmMtLjE0LS41Ni0uMS0xLjA2LjA3LTEuNS4xNy0uNC40OC0uNzcuOTItMS4wOC42Ni0uNDYgMS4zOS0uNiAyLjE4LS40MS45LjIgMS42Ny43OCAyLjMzIDEuNzJ6bS0xLjE0LjhhMi4xNiAyLjE2IDAgMCAwLTEuMy0uOTVjLS40My0uMS0uODItLjAyLTEuMTcuMjMtLjQuMjgtLjY1LjYyLS43MyAxLS4xLjQ3LjA2IDEgLjUgMS42Mi40MS42Ljg3Ljk0IDEuMzQgMS4wMS40LjA2Ljc5LS4wNiAxLjItLjM0LjM1LS4yNS41NS0uNi42LTEuMDNhMi4xOCAyLjE4IDAgMCAwLS40NC0xLjU0em0tMy43OCAyLjY0Yy0uNDMtLjYxLS45LS45Ny0xLjQyLTEuMDktLjUtLjEyLS45OSAwLTEuNDYuMzNhMS42IDEuNiAwIDAgMC0uNzIgMS4yNGMtLjA1LjUuMTMgMS4wNi41NiAxLjY2LjQuNTkuODguOTUgMS40IDEuMS40OC4xMi45NC4wNCAxLjM4LS4yNy40Ny0uMzIuNzMtLjc1LjgtMS4yMy4wNy0uNTUtLjEtMS4xMi0uNTQtMS43NHoiLz48cGF0aCBkPSJNMzk2LjAxIDIwMS45djUuMzJjLjM1LS4xLjY4LS4yLjk4LS4zMmwuMjcgMS41OC0xLjI1LjMxdjUuMDFoLTEuNDR2LTIuNDFjLS40NS0uMTQtLjg4LS4zLTEuMy0uNXYzLjA2aC0yLjU3di0xLjU0aDEuMTZ2LTkuMWgtMS4xNnYtMS41NWgyLjU3djIuOTRjLjQ4LS4xNS45MS0uMyAxLjMtLjQ1di0yLjM2aDEuNDR6bS0yLjc0IDcuMzdjLjQzLjIxLjg3LjQgMS4zLjUxdi0zLjg4bC0xLjMuMzd2M3ptLTMuMDYtOC4wN3Y1Ljc1Yy4zNy0uMTUuNzItLjMzIDEuMDUtLjUxbC4yNyAxLjU5Yy0uNC4xOC0uODQuMzQtMS4zMi41djUuOTVoLTEuNDR2LTcuNjVhOC45NSA4Ljk1IDAgMCAxLS45Mi0uMTV2NS45N2MtMi4yNi0uMDItMy42LS4yOS0zLjk5LS44M2EyLjQ0IDIuNDQgMCAwIDEtLjMzLS45OWMtLjA2LS40LS4wOS0uOC0uMS0xLjIxdi0xLjcxbDEuNDQtLjQyLS4wMiAyLjRjLjAyLjM5LjA4LjY2LjE4Ljg0LjEuMTguNTkuMjggMS40NC4zMXYtNC45Yy0xLjQtLjgtMi41LTIuMi0zLjI4LTQuMjNsMS40NC0uODljLjggMi41NSAyLjE3IDMuOTUgNC4xNCA0LjJ2LTQuMDJoMS40NHptNi44IDE2LjdhMjEuMzcgMjEuMzcgMCAwIDEtMi4yMyAyLjYybC0xLjEyLTEuMTFhMTUuMSAxNS4xIDAgMCAwIDIuMjYtMi42M2wxLjA4IDEuMTN6bS0zLjUyLS4zNWwtMS4wOC0xLjExYTE2LjU5IDE2LjU5IDAgMCAxLTIuMjggMi40N2wxLjExIDEuMTFjLjc1LS42NyAxLjUtMS41IDIuMjUtMi40N3ptLTQuMjQgMS41YTQ1LjA4IDQ1LjA4IDAgMCAxLTUuMi0yLjRsLS42OCAxLjU3YTQ2IDQ2IDAgMCAwIDUuMyAyLjI0bC41OC0xLjQxem01LjUyIDEuODF2My43OGMuNy0uMjUgMS4zOC0uNTUgMi4wMi0uODhsLjQyIDEuNDVjLS45LjQyLTEuNy43NS0yLjQ0Ljk4djMuNjRoLTEuNTN2LTMuNjZoLTMuMDV2My4yNmgtMS41di0zLjI2aC0zLjQydjMuOThoLTEuNTN2LTkuNjVoMS41M3Y0LjFoMy40MnYtMy4zMmgxLjV2My4zMmgzLjA1di0zLjc0aDEuNTN6TTk2OS4zNSAyMTQuODdhNi4zNiA2LjM2IDAgMCAxIDEuNjggMi44OGgxLjc0YTYuMDYgNi4wNiAwIDAgMC0xLjMxLTIuNDVoOC42di0xLjc1aC0xMC43MXYxLjMxeiIgb3BhY2l0eT0iLjkiLz48L2c+PGcgZmlsbD0iIzZCN0U3QyI+PHBhdGggZD0iTTk3NC42MyAxMTRjLS43IDAtMS4yNi4xNS0xLjcxLjQ3LS40OS4zMi0uNzIuNzctLjcyIDEuMzQgMCAuNTcuMjQgMSAuNzQgMS4zLjE4LjEuNjguMjggMS40Ny41NC43MS4yMSAxLjEzLjM2IDEuMjUuNDIuNC4yLjYuNDcuNi44IDAgLjI4LS4xNC40OS0uNC42NS0uMjguMTUtLjY2LjIzLTEuMTIuMjMtLjU0IDAtLjkyLS4xLTEuMTctLjI4LS4yOC0uMi0uNDUtLjU2LS41My0xLjA0SDk3MmMuMDQuODIuMzQgMS40MS44OCAxLjc5LjQ0LjMgMS4wNi40NiAxLjg2LjQ2LjgxIDAgMS40NS0uMTcgMS45LS41LjQ1LS4zMy42OC0uNzkuNjgtMS4zNiAwLS42LS4yOC0xLjA2LS44NC0xLjQtLjI1LS4xMy0uOC0uMzUtMS42OC0uNjItLjYtLjE5LS45Ni0uMzItMS4xLS40LS4zLS4xNi0uNDUtLjM4LS40NS0uNjUgMC0uMzEuMTMtLjUzLjQtLjY3LjIxLS4xMi41Mi0uMTcuOTItLjE3LjQ3IDAgLjgzLjA4IDEuMDcuMjYuMjMuMTcuNC40Ni41Ljg2aDEuMDNjLS4wNi0uNy0uMzItMS4yMy0uNzctMS41NmEyLjkyIDIuOTIgMCAwIDAtMS43Ny0uNDd6bTMuNTkuMTN2Ni40MmgxLjA1di02LjQyaC0xLjA1em0yLjMxIDBoMi4zNWMxLjA1IDAgMS44My4yOCAyLjM3Ljg2LjUxLjU0Ljc3IDEuMzIuNzcgMi4zNSAwIDEuMDItLjI2IDEuOC0uNzcgMi4zNS0uNTQuNTctMS4zMi44Ni0yLjM3Ljg2aC0yLjM1di02LjQyem0xLjA2Ljl2NC42MmgxLjFjLjggMCAxLjM4LS4xOSAxLjc1LS41Ni4zNi0uMzcuNTQtLjk2LjU0LTEuNzUgMC0uODEtLjE4LTEuNC0uNTQtMS43Ni0uMzctLjM3LS45Ni0uNTUtMS43Ni0uNTVoLTEuMXptNS40Mi0uOXY2LjQyaDQuNzl2LS45aC0zLjczdi0xLjk0aDMuMzZ2LS45aC0zLjM2di0xLjc4aDMuNTh2LS45SDk4N3ptOC43OCAwaDIuOTRjLjY0IDAgMS4xNC4xNSAxLjUuNDYuMzQuMjguNS42Ny41IDEuMTYgMCAuMzYtLjA4LjY2LS4yNS45MS0uMTcuMjQtLjQyLjQtLjc0LjU0LjQyLjA4Ljc0LjI1Ljk1LjUuMi4yNi4zMi42MS4zMiAxLjA0IDAgLjY1LS4yMyAxLjEzLS42NyAxLjQzLS4zOC4yNi0uOTIuMzgtMS42LjM4aC0yLjk1di02LjQyem0xLjA1Ljg2djEuODRoMS42MWMuNDUgMCAuNzctLjA4Ljk1LS4yMy4xOC0uMTUuMjgtLjQuMjgtLjczIDAtLjMtLjEtLjUzLS4yNy0uNjYtLjItLjE1LS41LS4yMi0uOTQtLjIyaC0xLjYzem0wIDIuN3YyaDEuNzVjLjQgMCAuNy0uMDYuOTMtLjIuMjktLjE1LjQzLS40LjQzLS43NiAwLS4zNy0uMS0uNjMtLjMxLS44LS4yMi0uMTYtLjU2LS4yNC0xLjAzLS4yNGgtMS43N3ptNS4xNi0zLjU2djYuNDJoNC43OXYtLjloLTMuNzR2LTEuOTRoMy4zN3YtLjloLTMuMzd2LTEuNzhoMy41OHYtLjlIMTAwMnptNS4yOCAwdi45aDIuMXY1LjUyaDEuMDZ2LTUuNTJoMi4xdi0uOWgtNS4yNnoiIG9wYWNpdHk9Ii45Ii8+PHBhdGggZD0iTTEwMzMuNzEgMTEzLjQ1Yy42OSAwIDEuMjQuMTggMS42NS41NS4zNi4zMi41NS43My41NSAxLjIxIDAgLjMzLS4wNy42LS4yMi44My0uMTYuMjMtLjQuNDItLjcuNTV2LjAyYy4yOS4wOC41NS4yNi43Ny41NC4yNC4zLjM3LjY1LjM3IDEuMDUgMCAuNTgtLjIyIDEuMDQtLjYzIDEuNC0uNDMuMzUtMS4wMi41My0xLjc5LjUzcy0xLjM2LS4xOC0xLjc4LS41M2ExLjczIDEuNzMgMCAwIDEtLjYzLTEuNGMwLS40LjEyLS43NS4zNy0xLjA1LjIyLS4yOC40Ny0uNDYuNzgtLjU0di0uMDJhMS40NSAxLjQ1IDAgMCAxLS43Mi0uNTVjLS4xNC0uMjMtLjIxLS41LS4yMS0uODMgMC0uNDguMTgtLjg5LjU1LTEuMjEuNC0uMzcuOTUtLjU1IDEuNjQtLjU1em0wIC44M2MtLjM3IDAtLjY4LjEtLjkuMzEtLjIuMTgtLjMuNC0uMy42NiAwIC4zLjA4LjUzLjI0LjcuMi4yLjUxLjMxLjk2LjMxLjQ1IDAgLjc3LS4xLjk3LS4zMS4xNi0uMTcuMjQtLjQuMjQtLjcgMC0uMjYtLjEtLjQ4LS4zLS42NmExLjMgMS4zIDAgMCAwLS45LS4zem0wIDIuNzdjLS40NSAwLS43OS4xLTEuMDIuMzItLjI0LjItLjM0LjQ5LS4zNC44MyAwIC4zMi4xMS41OC4zNi43OC4yMy4yLjU2LjMgMSAuMy40NCAwIC43OC0uMSAxLjAzLS4zLjIzLS4yLjM0LS40Ni4zNC0uNzggMC0uMzQtLjExLS42Mi0uMzMtLjgyLS4yNC0uMjItLjU5LS4zMy0xLjA0LS4zM3pNMTA3MS4yMSAxMTMuNTd2Ljk2aDMuMjlsLTIuMyA1LjQ3aDEuMWwyLjI2LTUuNTh2LS44NXpNMTExMy4yMyAxMTMuNDVjMS4yNiAwIDEuOTcuNTggMi4xNCAxLjc1aC0xLjAzYy0uMTMtLjYtLjUtLjg5LTEuMTItLjg5LS40MyAwLS43Ny4yLTEuMDIuNjMtLjI1LjQtLjM3LjktLjM3IDEuNDl2LjA4aC4wNGMuMTgtLjI3LjQtLjQ2LjY4LS41OS4yNS0uMTIuNTQtLjE4Ljg2LS4xOC42MyAwIDEuMTQuMiAxLjUxLjYuMzguNDEuNTcuOTMuNTcgMS41NiAwIC42NS0uMjIgMS4xOC0uNjYgMS42LS40My40MS0uOTcuNjMtMS42LjYzLS44IDAtMS40LS4zLTEuODItLjg2YTMuNzkgMy43OSAwIDAgMS0uNi0yLjNjMC0xLjA2LjItMS45LjY1LTIuNTVhMi4wMyAyLjAzIDAgMCAxIDEuNzctLjk3em0tLjA0IDMuMTVjLS40IDAtLjcuMTItLjkyLjM2LS4yMy4yMy0uMzMuNTctLjMzLjk4IDAgLjQuMTEuNzMuMzUuOTYuMjMuMjQuNTMuMzUuOS4zNS4zOCAwIC42Ny0uMTIuOS0uMzguMjQtLjI1LjM2LS41Ny4zNi0uOTdzLS4xMi0uNy0uMzQtLjk0YTEuMjIgMS4yMiAwIDAgMC0uOTItLjM2ek0xMTUxLjQ5IDExMy41N2wtLjM2IDMuNjJoLjk5Yy4xMi0uMjIuMy0uMzkuNTItLjUuMi0uMS40NC0uMTQuNzItLjE0LjQxIDAgLjc0LjEyLjk1LjM3LjIyLjI0LjMzLjU5LjMzIDEuMDIgMCAuNC0uMTMuNzEtLjM4Ljk0YTEuNCAxLjQgMCAwIDEtLjk3LjM1IDEuNCAxLjQgMCAwIDEtLjgyLS4yMiAxLjA4IDEuMDggMCAwIDEtLjQyLS43OGgtMS4wM2MuMDQuNi4zIDEuMDcuNzYgMS40Mi40Mi4zMS45Mi40OCAxLjUuNDguNjQgMCAxLjItLjIgMS42Ni0uNTcuNS0uNDIuNzYtLjk2Ljc2LTEuNjMgMC0uNy0uMi0xLjI0LS41OC0xLjY0LS4zOC0uNC0uODctLjYtMS40Ny0uNi0uMyAwLS41NS4wNS0uNzkuMTQtLjI2LjEtLjQ4LjI0LS42OC40NGgtLjAzbC4xOC0xLjc3aDMuMDd2LS45M2gtMy45MXpNMTE5My42MyAxMTMuNDVjLS42MyAwLTEuMTUuMTctMS41NS41M2EyLjEgMi4xIDAgMCAwLS43MiAxLjUxaDEuMDNjLjA0LS4zOS4xNi0uNjcuMzgtLjg2LjItLjIuNS0uMjguODctLjI4cy42NS4wOC44NC4yNGMuMTcuMTYuMjYuNC4yNi43MSAwIC4zMi0uMS41Ni0uMjkuNzItLjIuMTYtLjQ4LjI0LS44Ni4yNGgtLjQ1di44aC40NWMuNDEgMCAuNzMuMDguOTQuMjYuMjIuMTcuMzQuNDQuMzQuOCAwIC4zMS0uMTEuNTctLjMyLjc3LS4yMy4yMy0uNTYuMzQtLjk2LjM0LS4zNyAwLS42Ny0uMS0uOS0uMzEtLjI0LS4yMy0uMzctLjU1LS4zOS0uOTZoLTEuMDdjLjA2LjcyLjMgMS4yOC43NiAxLjY1LjQuMzQuOTQuNTIgMS42LjUyLjcxIDAgMS4yOC0uMiAxLjctLjU5LjQyLS4zOC42My0uODYuNjMtMS40NiAwLS4zNy0uMS0uNjktLjMyLS45My0uMi0uMjQtLjUtLjQtLjg4LS41Mi43MS0uMjQgMS4wNy0uNyAxLjA3LTEuNCAwLS41Ny0uMi0xLS41OC0xLjMxLS40LS4zMi0uOTMtLjQ3LTEuNTgtLjQ3ek0xMjMzLjg4IDExMy40NWMtLjY5IDAtMS4yNS4yMy0xLjY3LjdhMi40OCAyLjQ4IDAgMCAwLS42MyAxLjc0aDEuMDVjLjAyLS41LjEzLS45LjMzLTEuMTUuMi0uMjcuNS0uNC44OS0uNC4zNyAwIC42NS4wOC44NC4yNS4xOC4xNy4yNy40My4yNy43OCAwIC4zNi0uMTQuNy0uNDIgMS4wMi0uMTguMTktLjQ3LjQzLS44OC43Mi0uNzUuNTEtMS4yNC45MS0xLjQ4IDEuMThhMi40OCAyLjQ4IDAgMCAwLS42NCAxLjcxaDQuNDl2LS45M2gtMy4xN2MuMTQtLjMyLjU0LS43IDEuMi0xLjEzYTguMyA4LjMgMCAwIDAgMS4zMy0xLjA0Yy40MS0uNDYuNjMtLjk2LjYzLTEuNTIgMC0uNTctLjItMS4wMy0uNi0xLjQtLjQtLjM1LS45MS0uNTMtMS41NC0uNTN6TTEyNzMuMjQgMTEzLjU3YTQuMDEgNC4wMSAwIDAgMS0xLjczIDEuMDF2MS4wNWMuNi0uMTggMS4wOC0uNDQgMS40Ny0uNzlWMTIwaDEuMDV2LTYuNDNoLS43OXoiLz48L2c+PGcgZmlsbD0iIzZCN0U3QyI+PHBhdGggZD0iTTcyLjYzIDExNGMtLjcgMC0xLjI2LjE1LTEuNzEuNDctLjQ5LjMyLS43Mi43Ny0uNzIgMS4zNCAwIC41Ny4yNCAxIC43NCAxLjMuMTkuMS42OC4yOCAxLjQ3LjU0LjcxLjIxIDEuMTMuMzYgMS4yNS40Mi40LjIuNi40Ny42LjggMCAuMjgtLjE0LjQ5LS40LjY1LS4yOC4xNS0uNjYuMjMtMS4xMi4yMy0uNTMgMC0uOTItLjEtMS4xNy0uMjgtLjI4LS4yLS40NS0uNTYtLjUzLTEuMDRINzBjLjA0LjgyLjM0IDEuNDEuODggMS43OS40NC4zIDEuMDYuNDYgMS44Ni40Ni44MiAwIDEuNDUtLjE3IDEuOS0uNS40NS0uMzMuNjgtLjc5LjY4LTEuMzYgMC0uNi0uMjgtMS4wNi0uODQtMS40LS4yNS0uMTMtLjgtLjM1LTEuNjgtLjYyLS42LS4xOS0uOTYtLjMyLTEuMS0uNC0uMy0uMTYtLjQ1LS4zOC0uNDUtLjY1IDAtLjMxLjEzLS41My40LS42Ny4yMS0uMTIuNTItLjE3LjkyLS4xNy40NyAwIC44My4wOCAxLjA3LjI2LjIzLjE3LjQuNDYuNS44NmgxLjAzYy0uMDYtLjctLjMyLTEuMjMtLjc3LTEuNTZhMi45MiAyLjkyIDAgMCAwLTEuNzctLjQ3em0zLjU5LjEzdjYuNDJoMS4wNXYtNi40MmgtMS4wNXptMi4zMSAwaDIuMzVjMS4wNSAwIDEuODMuMjggMi4zNy44Ni41MS41NC43NyAxLjMyLjc3IDIuMzUgMCAxLjAyLS4yNiAxLjgtLjc3IDIuMzUtLjU0LjU3LTEuMzIuODYtMi4zNy44NmgtMi4zNXYtNi40MnptMS4wNS45djQuNjJoMS4xYy44IDAgMS4zOS0uMTkgMS43Ni0uNTYuMzYtLjM3LjU0LS45Ni41NC0xLjc1IDAtLjgxLS4xOC0xLjQtLjU0LTEuNzYtLjM3LS4zNy0uOTYtLjU1LTEuNzYtLjU1aC0xLjF6bTUuNDMtLjl2Ni40Mmg0Ljc5di0uOWgtMy43M3YtMS45NGgzLjM2di0uOWgtMy4zN3YtMS43OGgzLjU5di0uOUg4NXptOC43OCAwaDIuOTRjLjY0IDAgMS4xNC4xNSAxLjUuNDYuMzQuMjguNS42Ny41IDEuMTYgMCAuMzYtLjA4LjY2LS4yNS45MS0uMTguMjQtLjQyLjQtLjc0LjU0LjQyLjA4Ljc0LjI1Ljk1LjUuMi4yNi4zMi42MS4zMiAxLjA0IDAgLjY1LS4yMyAxLjEzLS42NyAxLjQzLS4zOC4yNi0uOTIuMzgtMS42LjM4aC0yLjk1di02LjQyem0xLjA1Ljg2djEuODRoMS42MWMuNDUgMCAuNzctLjA4Ljk2LS4yMy4xOC0uMTUuMjctLjQuMjctLjczIDAtLjMtLjEtLjUzLS4yOC0uNjYtLjItLjE1LS41LS4yMi0uOTMtLjIyaC0xLjYzem0wIDIuN3YyaDEuNzVjLjQgMCAuNy0uMDYuOTMtLjIuMjktLjE1LjQzLS40LjQzLS43NiAwLS4zNy0uMS0uNjMtLjMxLS44LS4yMi0uMTYtLjU2LS4yNC0xLjAzLS4yNGgtMS43N3ptNS4xNi0zLjU2djYuNDJoNC43OHYtLjloLTMuNzN2LTEuOTRoMy4zN3YtLjloLTMuMzd2LTEuNzhoMy41OHYtLjlIMTAwem01LjI4IDB2LjloMi4xdjUuNTJoMS4wNnYtNS41MmgyLjF2LS45aC01LjI2eiIgb3BhY2l0eT0iLjkiLz48cGF0aCBkPSJNMTMzIDExMy40NWMuNjggMCAxLjIzLjE4IDEuNjUuNTUuMzYuMzIuNTUuNzMuNTUgMS4yMSAwIC4zMy0uMDguNi0uMjIuODMtLjE2LjIzLS40LjQyLS43MS41NXYuMDJjLjMuMDguNTYuMjYuNzcuNTQuMjUuMy4zNy42NS4zNyAxLjA1IDAgLjU4LS4yMSAxLjA0LS42MyAxLjQtLjQyLjM1LTEuMDIuNTMtMS43OC41My0uNzcgMC0xLjM3LS4xOC0xLjc4LS41M2ExLjczIDEuNzMgMCAwIDEtLjYzLTEuNGMwLS40LjExLS43NS4zNy0xLjA1LjIxLS4yOC40Ni0uNDYuNzctLjU0di0uMDJhMS40NSAxLjQ1IDAgMCAxLS43MS0uNTVjLS4xNC0uMjMtLjIyLS41LS4yMi0uODMgMC0uNDguMTgtLjg5LjU1LTEuMjEuNC0uMzcuOTYtLjU1IDEuNjUtLjU1em0wIC44M2MtLjM4IDAtLjY4LjEtLjkuMzEtLjIuMTgtLjMuNC0uMy42NiAwIC4zLjA4LjUzLjI0LjcuMi4yLjUxLjMxLjk2LjMxLjQ0IDAgLjc3LS4xLjk2LS4zMS4xNi0uMTcuMjUtLjQuMjUtLjcgMC0uMjYtLjEtLjQ4LS4zLS42NmExLjMgMS4zIDAgMCAwLS45MS0uM3ptMCAyLjc3Yy0uNDUgMC0uOC4xLTEuMDMuMzItLjIzLjItLjM0LjQ5LS4zNC44MyAwIC4zMi4xMi41OC4zNi43OC4yNC4yLjU3LjMgMS4wMS4zLjQzIDAgLjc3LS4xIDEuMDMtLjMuMjItLjIuMzQtLjQ2LjM0LS43OCAwLS4zNC0uMTItLjYyLS4zNC0uODItLjI0LS4yMi0uNTgtLjMzLTEuMDMtLjMzek0xNzAuNzggMTEzLjU3di45NmgzLjI5bC0yLjMgNS40N2gxLjFsMi4yNi01LjU4di0uODV6TTIxMy4wOSAxMTMuNDVjMS4yNiAwIDEuOTcuNTggMi4xMyAxLjc1aC0xLjAyYy0uMTMtLjYtLjUtLjg5LTEuMTItLjg5LS40MyAwLS43Ny4yLTEuMDMuNjMtLjI1LjQtLjM2LjktLjM2IDEuNDl2LjA4aC4wNGMuMTgtLjI3LjQtLjQ2LjY4LS41OS4yNS0uMTIuNTQtLjE4Ljg2LS4xOC42MyAwIDEuMTMuMiAxLjUxLjYuMzguNDEuNTcuOTMuNTcgMS41NiAwIC42NS0uMjMgMS4xOC0uNjYgMS42LS40My40MS0uOTcuNjMtMS42LjYzLS44IDAtMS40LS4zLTEuODItLjg2YTMuNzkgMy43OSAwIDAgMS0uNjEtMi4zYzAtMS4wNi4yMi0xLjkuNjYtMi41NWEyLjAzIDIuMDMgMCAwIDEgMS43Ny0uOTd6bS0uMDUgMy4xNWMtLjQgMC0uNy4xMi0uOTEuMzYtLjIzLjIzLS4zNC41Ny0uMzQuOTggMCAuNC4xMi43My4zNi45Ni4yMy4yNC41My4zNS45LjM1cy42Ny0uMTIuOS0uMzhjLjI0LS4yNS4zNi0uNTcuMzYtLjk3cy0uMTItLjctLjM0LS45NGExLjIyIDEuMjIgMCAwIDAtLjkzLS4zNnpNMjUxLjYzIDExMy41N2wtLjM1IDMuNjJoLjk4Yy4xMi0uMjIuMy0uMzkuNTItLjUuMi0uMS40NC0uMTQuNzItLjE0LjQxIDAgLjc0LjEyLjk1LjM3LjIyLjI0LjM0LjU5LjM0IDEuMDIgMCAuNC0uMTQuNzEtLjM5Ljk0YTEuNCAxLjQgMCAwIDEtLjk2LjM1IDEuNCAxLjQgMCAwIDEtLjgzLS4yMiAxLjA4IDEuMDggMCAwIDEtLjQyLS43OGgtMS4wM2MuMDUuNi4zIDEuMDcuNzcgMS40Mi40LjMxLjkxLjQ4IDEuNS40OC42NCAwIDEuMTktLjIgMS42NS0uNTcuNS0uNDIuNzYtLjk2Ljc2LTEuNjMgMC0uNy0uMi0xLjI0LS41OC0xLjY0LS4zNy0uNC0uODctLjYtMS40Ny0uNi0uMjkgMC0uNTUuMDUtLjc4LjE0LS4yNy4xLS41LjI0LS42OS40NGgtLjAzbC4xOC0xLjc3aDMuMDd2LS45M2gtMy45MXpNMjk0LjA2IDExMy40NWMtLjYzIDAtMS4xNS4xNy0xLjU1LjUzYTIuMSAyLjEgMCAwIDAtLjcyIDEuNTFoMS4wM2MuMDQtLjM5LjE2LS42Ny4zOC0uODYuMi0uMi41LS4yOC44Ny0uMjhzLjY1LjA4Ljg0LjI0Yy4xNy4xNi4yNi40LjI2LjcxIDAgLjMyLS4xLjU2LS4yOS43Mi0uMi4xNi0uNDguMjQtLjg2LjI0aC0uNDV2LjhoLjQ1Yy40MSAwIC43My4wOC45NC4yNi4yMi4xNy4zNC40NC4zNC44IDAgLjMxLS4xMS41Ny0uMzIuNzctLjIzLjIzLS41Ni4zNC0uOTYuMzQtLjM3IDAtLjY3LS4xLS45LS4zMS0uMjUtLjIzLS4zNy0uNTUtLjM5LS45NmgtMS4wN2MuMDUuNzIuMyAxLjI4Ljc2IDEuNjUuNC4zNC45NC41MiAxLjYuNTIuNyAwIDEuMjgtLjIgMS43LS41OS40Mi0uMzguNjMtLjg2LjYzLTEuNDYgMC0uMzctLjEtLjY5LS4zMy0uOTMtLjItLjI0LS40OS0uNC0uODctLjUyLjcxLS4yNCAxLjA3LS43IDEuMDctMS40IDAtLjU3LS4yLTEtLjU4LTEuMzEtLjQtLjMyLS45My0uNDctMS41OC0uNDd6TTMzNC42IDExMy40NWMtLjcgMC0xLjI1LjIzLTEuNjguN2EyLjQ4IDIuNDggMCAwIDAtLjYzIDEuNzRoMS4wNmMuMDItLjUuMTItLjkuMzItMS4xNS4yLS4yNy41LS40LjktLjQuMzYgMCAuNjQuMDguODMuMjUuMTguMTcuMjguNDMuMjguNzggMCAuMzYtLjE0LjctLjQyIDEuMDItLjE4LjE5LS40Ny40My0uODkuNzItLjc0LjUxLTEuMjQuOTEtMS40NyAxLjE4YTIuNDggMi40OCAwIDAgMC0uNjQgMS43MWg0LjQ4di0uOTNoLTMuMTdjLjE1LS4zMi41NC0uNyAxLjItMS4xM2E4LjMgOC4zIDAgMCAwIDEuMzMtMS4wNGMuNDItLjQ2LjYzLS45Ni42My0xLjUyIDAtLjU3LS4yLTEuMDMtLjYtMS40LS40LS4zNS0uOTEtLjUzLTEuNTMtLjUzek0zNzQuMjQgMTEzLjU3YTQuMDEgNC4wMSAwIDAgMS0xLjczIDEuMDF2MS4wNWMuNi0uMTggMS4wOS0uNDQgMS40Ny0uNzlWMTIwaDEuMDZ2LTYuNDNoLS44eiIvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=">
        </image>
        <g id="B_Q" transform="translate(143, 188)">
          <g id="B_Q_I" class="" @click="calcBetPoint('B_Q_I', 'B_Q_B')" :class="{ disable: forbidenBet }">
            <path
              d="M894.846361,-2.27373675e-13 L1071.3118,6.88338275e-14 L1199.5318,158.654 C1201.07942,160.556419 1202.35353,162.422354 1203.36154,164.252443 L1079.54371,127.493384 C1093.3382,160.816769 1023.80212,188.766566 902.29734,198.312 C812.11234,205.397 673.84134,209.41 540.42534,209.417 C407.36834,209.41 269.02834,205.393 178.81934,198.298 C56.0313643,188.641234 -13.6195085,160.170349 2.23004307,126.36319 L125.19598,89.8841734 C116.227456,118.562531 157.555129,151.71382 254.051234,158.149 C309.538234,161.85 426.194234,166.163 540.081234,166.167 C654.148234,166.163 770.768234,161.853 826.244234,158.156 C930.114234,151.234 970.113234,113.379 952.266234,83.44 C947.087871,70.5747638 906.307706,15.3915574 894.846361,-2.27373675e-13 Z"
              class=""></path>
            <path
              d="M950.431811,138.37901 L960.204481,137.524012 C962.326376,137.33837 964.044432,137.700008 965.328765,138.61154 C966.51821,139.471144 967.198472,140.706556 967.339665,142.320391 C967.444251,143.515825 967.234292,144.55809 966.739672,145.444573 C966.239822,146.271283 965.482583,146.90971 964.443298,147.42224 C965.871465,147.568323 966.967148,148.044641 967.760234,148.848578 C968.520819,149.625244 968.981421,150.759416 969.106926,152.193936 C969.295182,154.345717 968.686614,155.995033 967.311106,157.139271 C966.129112,158.08589 964.372567,158.661173 962.101243,158.859888 L952.298687,159.7175 L950.431811,138.37901 Z M954.179463,140.942134 L954.712856,147.038845 L960.062422,146.570819 C961.556714,146.440085 962.579186,146.079599 963.164954,145.546518 C963.718221,144.986165 963.976369,144.150486 963.879627,143.04471 C963.790728,142.028591 963.396617,141.310207 962.75968,140.914212 C962.060356,140.493562 961.023321,140.343374 959.5888,140.468878 L954.179463,140.942134 Z M954.963865,149.907886 L960.851375,149.392796 C962.405439,149.256833 963.564633,149.426448 964.328957,149.901641 C965.063396,150.379448 965.497851,151.214762 965.605053,152.440081 C965.70964,153.635515 965.304677,154.514153 964.395394,155.135768 C963.684854,155.619536 962.657152,155.920251 961.342175,156.035296 L955.544322,156.542543 L954.963865,149.907886 Z M303.332143,172.58 L313.142143,172.58 C315.272143,172.58 316.952143,173.09 318.152143,174.11 C319.262143,175.07 319.832143,176.36 319.832143,177.98 C319.832143,179.18 319.532143,180.2 318.962143,181.04 C318.392143,181.82 317.582143,182.39 316.502143,182.81 C317.912143,183.08 318.962143,183.65 319.682143,184.52 C320.372143,185.36 320.732143,186.53 320.732143,187.97 C320.732143,190.13 319.982143,191.72 318.512143,192.74 C317.252143,193.58 315.452143,194 313.172143,194 L303.332143,194 L303.332143,172.58 Z M306.842143,175.46 L306.842143,181.58 L312.212143,181.58 C313.712143,181.58 314.762143,181.31 315.392143,180.83 C315.992143,180.32 316.322143,179.51 316.322143,178.4 C316.322143,177.38 315.992143,176.63 315.392143,176.18 C314.732143,175.7 313.712143,175.46 312.272143,175.46 L306.842143,175.46 Z M306.842143,184.46 L306.842143,191.12 L312.662143,191.12 C313.982143,191.12 315.032143,190.91 315.782143,190.49 C316.742143,189.95 317.222143,189.11 317.222143,187.91 C317.222143,186.68 316.862143,185.81 316.172143,185.27 C315.452143,184.73 314.312143,184.46 312.752143,184.46 L306.842143,184.46 Z M463.752143,185.51 L471.252143,185.51 L471.252143,179.87 L474.432143,179.87 L474.432143,185.51 L482.082143,185.51 L482.082143,188.54 L474.432143,188.54 L474.432143,196.04 L483.552143,196.04 L483.552143,199.1 L461.982143,199.1 L461.982143,196.04 L471.252143,196.04 L471.252143,188.54 L463.752143,188.54 L463.752143,185.51 Z M471.522143,172.25 C471.972143,173.21 472.422143,174.29 472.842143,175.46 L483.552143,175.46 L483.552143,178.49 L461.682143,178.49 L461.682143,184.67 C461.592143,191.12 460.632143,196.31 458.832143,200.21 L456.162143,197.84 C457.662143,194.66 458.442143,190.28 458.502143,184.67 L458.502143,175.46 L469.392143,175.46 C468.972143,174.53 468.522143,173.66 468.012143,172.85 L471.522143,172.25 Z M118.647524,146.790052 L126.118984,147.44372 L126.610543,141.825181 L129.778442,142.102337 L129.286883,147.720875 L136.907773,148.387616 L136.643691,151.406086 L129.022801,150.739345 L128.369133,158.210805 L137.454429,159.005665 L137.187732,162.054021 L115.699813,160.174072 L115.966509,157.125716 L125.201234,157.93365 L125.854902,150.46219 L118.383442,149.808521 L118.647524,146.790052 Z M127.543642,134.25771 C127.90826,135.253277 128.262419,136.368387 128.578849,137.570541 L139.248094,138.503979 L138.984012,141.522448 L117.197234,139.616352 L116.658612,145.772836 C116.0068,152.190447 114.598114,157.277028 112.465057,161.005307 L110.011776,158.41162 C111.783223,155.374455 112.941997,151.079103 113.490713,145.49568 L114.293417,136.320727 L125.141977,137.269853 C124.80463,136.306787 124.432168,135.400877 123.994705,134.54951 L127.543642,134.25771 Z M765.752143,182.51 L773.252143,182.51 L773.252143,176.87 L776.432143,176.87 L776.432143,182.51 L784.082143,182.51 L784.082143,185.54 L776.432143,185.54 L776.432143,193.04 L785.552143,193.04 L785.552143,196.1 L763.982143,196.1 L763.982143,193.04 L773.252143,193.04 L773.252143,185.54 L765.752143,185.54 L765.752143,182.51 Z M773.522143,169.25 C773.972143,170.21 774.422143,171.29 774.842143,172.46 L785.552143,172.46 L785.552143,175.49 L763.682143,175.49 L763.682143,181.67 C763.592143,188.12 762.632143,193.31 760.832143,197.21 L758.162143,194.84 C759.662143,191.66 760.442143,187.28 760.502143,181.67 L760.502143,172.46 L771.392143,172.46 C770.972143,171.53 770.522143,170.66 770.012143,169.85 L773.522143,169.25 Z M969.637143,52.835 L969.637143,45.335 L963.997143,45.335 L963.997143,42.155 L969.637143,42.155 L969.637143,34.505 L972.667143,34.505 L972.667143,42.155 L980.167143,42.155 L980.167143,33.035 L983.227143,33.035 L983.227143,54.605 L980.167143,54.605 L980.167143,45.335 L972.667143,45.335 L972.667143,52.835 L969.637143,52.835 Z M956.377143,45.065 C957.337143,44.615 958.417143,44.165 959.587143,43.745 L959.587143,33.035 L962.617143,33.035 L962.617143,54.905 L968.797143,54.905 C975.247143,54.995 980.437143,55.955 984.337143,57.755 L981.967143,60.425 C978.787143,58.925 974.407143,58.145 968.797143,58.085 L959.587143,58.085 L959.587143,47.195 C958.657143,47.615 957.787143,48.065 956.977143,48.575 L956.377143,45.065 Z M1058.99,58.41 L1058.99,48.6 C1058.99,46.47 1059.5,44.79 1060.52,43.59 C1061.48,42.48 1062.77,41.91 1064.39,41.91 C1065.59,41.91 1066.61,42.21 1067.45,42.78 C1068.23,43.35 1068.8,44.16 1069.22,45.24 C1069.49,43.83 1070.06,42.78 1070.93,42.06 C1071.77,41.37 1072.94,41.01 1074.38,41.01 C1076.54,41.01 1078.13,41.76 1079.15,43.23 C1079.99,44.49 1080.41,46.29 1080.41,48.57 L1080.41,58.41 L1058.99,58.41 Z M1061.87,54.9 L1067.99,54.9 L1067.99,49.53 C1067.99,48.03 1067.72,46.98 1067.24,46.35 C1066.73,45.75 1065.92,45.42 1064.81,45.42 C1063.79,45.42 1063.04,45.75 1062.59,46.35 C1062.11,47.01 1061.87,48.03 1061.87,49.47 L1061.87,54.9 Z M1070.87,54.9 L1077.53,54.9 L1077.53,49.08 C1077.53,47.76 1077.32,46.71 1076.9,45.96 C1076.36,45 1075.52,44.52 1074.32,44.52 C1073.09,44.52 1072.22,44.88 1071.68,45.57 C1071.14,46.29 1070.87,47.43 1070.87,48.99 L1070.87,54.9 Z M597.332143,175.58 L607.142143,175.58 C609.272143,175.58 610.952143,176.09 612.152143,177.11 C613.262143,178.07 613.832143,179.36 613.832143,180.98 C613.832143,182.18 613.532143,183.2 612.962143,184.04 C612.392143,184.82 611.582143,185.39 610.502143,185.81 C611.912143,186.08 612.962143,186.65 613.682143,187.52 C614.372143,188.36 614.732143,189.53 614.732143,190.97 C614.732143,193.13 613.982143,194.72 612.512143,195.74 C611.252143,196.58 609.452143,197 607.172143,197 L597.332143,197 L597.332143,175.58 Z M600.842143,178.46 L600.842143,184.58 L606.212143,184.58 C607.712143,184.58 608.762143,184.31 609.392143,183.83 C609.992143,183.32 610.322143,182.51 610.322143,181.4 C610.322143,180.38 609.992143,179.63 609.392143,179.18 C608.732143,178.7 607.712143,178.46 606.272143,178.46 L600.842143,178.46 Z M600.842143,187.46 L600.842143,194.12 L606.662143,194.12 C607.982143,194.12 609.032143,193.91 609.782143,193.49 C610.742143,192.95 611.222143,192.11 611.222143,190.91 C611.222143,189.68 610.862143,188.81 610.172143,188.27 C609.452143,187.73 608.312143,187.46 606.752143,187.46 L600.842143,187.46 Z"
              id="text_light" stroke="#E68888" stroke-width="3" fill="#AB2B20" class=""></path>
            <path
              d="M950.431811,138.37901 L960.204481,137.524012 C962.326376,137.33837 964.044432,137.700008 965.328765,138.61154 C966.51821,139.471144 967.198472,140.706556 967.339665,142.320391 C967.444251,143.515825 967.234292,144.55809 966.739672,145.444573 C966.239822,146.271283 965.482583,146.90971 964.443298,147.42224 C965.871465,147.568323 966.967148,148.044641 967.760234,148.848578 C968.520819,149.625244 968.981421,150.759416 969.106926,152.193936 C969.295182,154.345717 968.686614,155.995033 967.311106,157.139271 C966.129112,158.08589 964.372567,158.661173 962.101243,158.859888 L952.298687,159.7175 L950.431811,138.37901 Z M954.179463,140.942134 L954.712856,147.038845 L960.062422,146.570819 C961.556714,146.440085 962.579186,146.079599 963.164954,145.546518 C963.718221,144.986165 963.976369,144.150486 963.879627,143.04471 C963.790728,142.028591 963.396617,141.310207 962.75968,140.914212 C962.060356,140.493562 961.023321,140.343374 959.5888,140.468878 L954.179463,140.942134 Z M954.963865,149.907886 L960.851375,149.392796 C962.405439,149.256833 963.564633,149.426448 964.328957,149.901641 C965.063396,150.379448 965.497851,151.214762 965.605053,152.440081 C965.70964,153.635515 965.304677,154.514153 964.395394,155.135768 C963.684854,155.619536 962.657152,155.920251 961.342175,156.035296 L955.544322,156.542543 L954.963865,149.907886 Z M303.332143,172.58 L313.142143,172.58 C315.272143,172.58 316.952143,173.09 318.152143,174.11 C319.262143,175.07 319.832143,176.36 319.832143,177.98 C319.832143,179.18 319.532143,180.2 318.962143,181.04 C318.392143,181.82 317.582143,182.39 316.502143,182.81 C317.912143,183.08 318.962143,183.65 319.682143,184.52 C320.372143,185.36 320.732143,186.53 320.732143,187.97 C320.732143,190.13 319.982143,191.72 318.512143,192.74 C317.252143,193.58 315.452143,194 313.172143,194 L303.332143,194 L303.332143,172.58 Z M306.842143,175.46 L306.842143,181.58 L312.212143,181.58 C313.712143,181.58 314.762143,181.31 315.392143,180.83 C315.992143,180.32 316.322143,179.51 316.322143,178.4 C316.322143,177.38 315.992143,176.63 315.392143,176.18 C314.732143,175.7 313.712143,175.46 312.272143,175.46 L306.842143,175.46 Z M306.842143,184.46 L306.842143,191.12 L312.662143,191.12 C313.982143,191.12 315.032143,190.91 315.782143,190.49 C316.742143,189.95 317.222143,189.11 317.222143,187.91 C317.222143,186.68 316.862143,185.81 316.172143,185.27 C315.452143,184.73 314.312143,184.46 312.752143,184.46 L306.842143,184.46 Z M463.752143,185.51 L471.252143,185.51 L471.252143,179.87 L474.432143,179.87 L474.432143,185.51 L482.082143,185.51 L482.082143,188.54 L474.432143,188.54 L474.432143,196.04 L483.552143,196.04 L483.552143,199.1 L461.982143,199.1 L461.982143,196.04 L471.252143,196.04 L471.252143,188.54 L463.752143,188.54 L463.752143,185.51 Z M471.522143,172.25 C471.972143,173.21 472.422143,174.29 472.842143,175.46 L483.552143,175.46 L483.552143,178.49 L461.682143,178.49 L461.682143,184.67 C461.592143,191.12 460.632143,196.31 458.832143,200.21 L456.162143,197.84 C457.662143,194.66 458.442143,190.28 458.502143,184.67 L458.502143,175.46 L469.392143,175.46 C468.972143,174.53 468.522143,173.66 468.012143,172.85 L471.522143,172.25 Z M118.647524,146.790052 L126.118984,147.44372 L126.610543,141.825181 L129.778442,142.102337 L129.286883,147.720875 L136.907773,148.387616 L136.643691,151.406086 L129.022801,150.739345 L128.369133,158.210805 L137.454429,159.005665 L137.187732,162.054021 L115.699813,160.174072 L115.966509,157.125716 L125.201234,157.93365 L125.854902,150.46219 L118.383442,149.808521 L118.647524,146.790052 Z M127.543642,134.25771 C127.90826,135.253277 128.262419,136.368387 128.578849,137.570541 L139.248094,138.503979 L138.984012,141.522448 L117.197234,139.616352 L116.658612,145.772836 C116.0068,152.190447 114.598114,157.277028 112.465057,161.005307 L110.011776,158.41162 C111.783223,155.374455 112.941997,151.079103 113.490713,145.49568 L114.293417,136.320727 L125.141977,137.269853 C124.80463,136.306787 124.432168,135.400877 123.994705,134.54951 L127.543642,134.25771 Z M765.752143,182.51 L773.252143,182.51 L773.252143,176.87 L776.432143,176.87 L776.432143,182.51 L784.082143,182.51 L784.082143,185.54 L776.432143,185.54 L776.432143,193.04 L785.552143,193.04 L785.552143,196.1 L763.982143,196.1 L763.982143,193.04 L773.252143,193.04 L773.252143,185.54 L765.752143,185.54 L765.752143,182.51 Z M773.522143,169.25 C773.972143,170.21 774.422143,171.29 774.842143,172.46 L785.552143,172.46 L785.552143,175.49 L763.682143,175.49 L763.682143,181.67 C763.592143,188.12 762.632143,193.31 760.832143,197.21 L758.162143,194.84 C759.662143,191.66 760.442143,187.28 760.502143,181.67 L760.502143,172.46 L771.392143,172.46 C770.972143,171.53 770.522143,170.66 770.012143,169.85 L773.522143,169.25 Z M969.637143,52.835 L969.637143,45.335 L963.997143,45.335 L963.997143,42.155 L969.637143,42.155 L969.637143,34.505 L972.667143,34.505 L972.667143,42.155 L980.167143,42.155 L980.167143,33.035 L983.227143,33.035 L983.227143,54.605 L980.167143,54.605 L980.167143,45.335 L972.667143,45.335 L972.667143,52.835 L969.637143,52.835 Z M956.377143,45.065 C957.337143,44.615 958.417143,44.165 959.587143,43.745 L959.587143,33.035 L962.617143,33.035 L962.617143,54.905 L968.797143,54.905 C975.247143,54.995 980.437143,55.955 984.337143,57.755 L981.967143,60.425 C978.787143,58.925 974.407143,58.145 968.797143,58.085 L959.587143,58.085 L959.587143,47.195 C958.657143,47.615 957.787143,48.065 956.977143,48.575 L956.377143,45.065 Z M1058.99,58.41 L1058.99,48.6 C1058.99,46.47 1059.5,44.79 1060.52,43.59 C1061.48,42.48 1062.77,41.91 1064.39,41.91 C1065.59,41.91 1066.61,42.21 1067.45,42.78 C1068.23,43.35 1068.8,44.16 1069.22,45.24 C1069.49,43.83 1070.06,42.78 1070.93,42.06 C1071.77,41.37 1072.94,41.01 1074.38,41.01 C1076.54,41.01 1078.13,41.76 1079.15,43.23 C1079.99,44.49 1080.41,46.29 1080.41,48.57 L1080.41,58.41 L1058.99,58.41 Z M1061.87,54.9 L1067.99,54.9 L1067.99,49.53 C1067.99,48.03 1067.72,46.98 1067.24,46.35 C1066.73,45.75 1065.92,45.42 1064.81,45.42 C1063.79,45.42 1063.04,45.75 1062.59,46.35 C1062.11,47.01 1061.87,48.03 1061.87,49.47 L1061.87,54.9 Z M1070.87,54.9 L1077.53,54.9 L1077.53,49.08 C1077.53,47.76 1077.32,46.71 1076.9,45.96 C1076.36,45 1075.52,44.52 1074.32,44.52 C1073.09,44.52 1072.22,44.88 1071.68,45.57 C1071.14,46.29 1070.87,47.43 1070.87,48.99 L1070.87,54.9 Z M597.332143,175.58 L607.142143,175.58 C609.272143,175.58 610.952143,176.09 612.152143,177.11 C613.262143,178.07 613.832143,179.36 613.832143,180.98 C613.832143,182.18 613.532143,183.2 612.962143,184.04 C612.392143,184.82 611.582143,185.39 610.502143,185.81 C611.912143,186.08 612.962143,186.65 613.682143,187.52 C614.372143,188.36 614.732143,189.53 614.732143,190.97 C614.732143,193.13 613.982143,194.72 612.512143,195.74 C611.252143,196.58 609.452143,197 607.172143,197 L597.332143,197 L597.332143,175.58 Z M600.842143,178.46 L600.842143,184.58 L606.212143,184.58 C607.712143,184.58 608.762143,184.31 609.392143,183.83 C609.992143,183.32 610.322143,182.51 610.322143,181.4 C610.322143,180.38 609.992143,179.63 609.392143,179.18 C608.732143,178.7 607.712143,178.46 606.272143,178.46 L600.842143,178.46 Z M600.842143,187.46 L600.842143,194.12 L606.662143,194.12 C607.982143,194.12 609.032143,193.91 609.782143,193.49 C610.742143,192.95 611.222143,192.11 611.222143,190.91 C611.222143,189.68 610.862143,188.81 610.172143,188.27 C609.452143,187.73 608.312143,187.46 606.752143,187.46 L600.842143,187.46 Z"
              id="text" fill="#AB2B20" class=""></path>
            <g id="B_Q_B" transform="translate(104, 16)">
              <bankerBet ref="bankerBetRef" v-bind="bankerBetChipsData" />
            </g>
          </g>
        </g>
        <g id="P_Q" transform="translate(19, 188)">
          <g id="P_Q_I" class="" @click="calcBetPoint('P_Q_I', 'P_Q_B')" :class="{ disable: forbidenBet }">
            <path
              d="M134.965804,-2.27373675e-13 L309.882507,-2.27373675e-13 C298.594283,15.6653563 257.1416,70.9349972 252.108234,83.44 C250.84707,85.5558652 249.874725,87.7113112 249.193342,89.892615 L249.178711,89.9140625 L125.845879,127.220625 C111.563569,160.651045 181.070835,188.722984 302.81934,198.298 C393.02834,205.393 531.36834,209.41 664.42534,209.417 C797.84134,209.41 936.11234,205.397 1026.29734,198.312 C1147.78167,188.768172 1217.31479,160.826176 1203.55066,127.510208 L1327.7446,164.970984 C1364.39999,236.097235 996.441539,252.645619 665.456804,252.667 L664.820804,252.667 C324.251804,252.645 -55.4621956,235.125 6.74580439,158.654 L134.458503,0.627713208 L134.488281,0.484375 L134.574345,0.484375 L134.965804,-2.27373675e-13 Z"
              class=""></path>
            <path
              d="M734.357143,216.58 L743.237143,216.58 C748.397143,216.58 751.007143,218.77 751.007143,223.15 C751.007143,227.56 748.397143,229.78 743.177143,229.78 L737.867143,229.78 L737.867143,238 L734.357143,238 L734.357143,216.58 Z M737.867143,219.58 L737.867143,226.78 L742.967143,226.78 C744.527143,226.78 745.667143,226.48 746.387143,225.94 C747.107143,225.37 747.467143,224.44 747.467143,223.15 C747.467143,221.86 747.077143,220.96 746.357143,220.42 C745.637143,219.85 744.497143,219.58 742.967143,219.58 L737.867143,219.58 Z M389.357143,212.58 L398.237143,212.58 C403.397143,212.58 406.007143,214.77 406.007143,219.15 C406.007143,223.56 403.397143,225.78 398.177143,225.78 L392.867143,225.78 L392.867143,234 L389.357143,234 L389.357143,212.58 Z M392.867143,215.58 L392.867143,222.78 L397.967143,222.78 C399.527143,222.78 400.667143,222.48 401.387143,221.94 C402.107143,221.37 402.467143,220.44 402.467143,219.15 C402.467143,217.86 402.077143,216.96 401.357143,216.42 C400.637143,215.85 399.497143,215.58 397.967143,215.58 L392.867143,215.58 Z M149.035,38.385 L149.035,47.265 C149.035,52.425 146.845,55.035 142.465,55.035 C138.055,55.035 135.835,52.425 135.835,47.205 L135.835,41.895 L127.615,41.895 L127.615,38.385 L149.035,38.385 Z M146.035,41.895 L138.835,41.895 L138.835,46.995 C138.835,48.555 139.135,49.695 139.675,50.415 C140.245,51.135 141.175,51.495 142.465,51.495 C143.755,51.495 144.655,51.105 145.195,50.385 C145.765,49.665 146.035,48.525 146.035,46.995 L146.035,41.895 Z M230.545,35.735 L230.545,41.765 L234.775,41.765 L234.775,44.645 L230.545,44.645 L230.545,50.345 L227.725,50.345 L227.725,44.645 L226.945,44.645 C224.755,47.375 222.565,49.685 220.405,51.545 L218.335,49.505 C220.015,48.245 221.755,46.625 223.555,44.645 L214.105,44.645 L214.105,41.765 L225.025,41.765 C221.815,40.175 219.205,38.315 217.195,36.155 L220.195,34.295 C222.085,37.025 224.605,39.185 227.725,40.805 L227.725,35.735 L230.545,35.735 Z M212.665,51.965 L212.665,49.535 L215.485,48.755 L215.395,51.335 C215.395,52.115 215.935,52.535 216.955,52.535 L236.125,52.535 L236.125,41.345 L238.885,41.345 L238.885,55.475 L216.115,55.475 C213.835,55.475 212.665,54.305 212.665,51.965 Z M235.195,30.605 L235.195,33.545 L212.395,33.545 L212.395,30.605 L235.195,30.605 Z M240.475,35.675 C239.155,36.815 237.655,37.805 236.035,38.705 L234.715,36.155 C236.425,35.195 237.955,34.175 239.275,33.035 L240.475,35.675 Z M1175.45538,178.346326 L1184.30159,177.572383 C1189.44196,177.12266 1192.2329,179.07685 1192.61464,183.440182 C1192.999,187.833401 1190.59241,190.27243 1185.39228,190.727383 L1180.10248,191.19018 L1180.8189,199.3789 L1177.32226,199.684817 L1175.45538,178.346326 Z M1179.21349,181.028994 L1179.84102,188.201596 L1184.92161,187.757101 C1186.47567,187.621138 1187.58519,187.222922 1188.25538,186.622225 C1188.92297,185.991642 1189.20054,185.033805 1189.08811,183.748714 C1188.97568,182.463623 1188.50872,181.601038 1187.7444,181.125845 C1186.97746,180.620766 1185.81827,180.451151 1184.29409,180.584499 L1179.21349,181.028994 Z M575.762143,223 L581.792143,223 L581.792143,218.77 L584.672143,218.77 L584.672143,223 L590.372143,223 L590.372143,225.82 L584.672143,225.82 L584.672143,226.6 C587.402143,228.79 589.712143,230.98 591.572143,233.14 L589.532143,235.21 C588.272143,233.53 586.652143,231.79 584.672143,229.99 L584.672143,239.44 L581.792143,239.44 L581.792143,228.52 C580.202143,231.73 578.342143,234.34 576.182143,236.35 L574.322143,233.35 C577.052143,231.46 579.212143,228.94 580.832143,225.82 L575.762143,225.82 L575.762143,223 Z M591.992143,240.88 L589.562143,240.88 L588.782143,238.06 L591.362143,238.15 C592.142143,238.15 592.562143,237.61 592.562143,236.59 L592.562143,217.42 L581.372143,217.42 L581.372143,214.66 L595.502143,214.66 L595.502143,237.43 C595.502143,239.71 594.332143,240.88 591.992143,240.88 Z M570.632143,218.35 L573.572143,218.35 L573.572143,241.15 L570.632143,241.15 L570.632143,218.35 Z M575.702143,213.07 C576.842143,214.39 577.832143,215.89 578.732143,217.51 L576.182143,218.83 C575.222143,217.12 574.202143,215.59 573.062143,214.27 L575.702143,213.07 Z M139.148151,187.378967 L145.155205,187.904516 L145.523874,183.690613 L148.392914,183.941621 L148.024245,188.155525 L153.702555,188.652312 L153.456776,191.461582 L147.778466,190.964794 L147.710485,191.741826 C150.239225,194.161427 152.349564,196.544423 154.01423,198.858314 L151.80158,200.742639 C150.692796,198.959216 149.230612,197.084645 147.415027,195.118926 L146.591405,204.532966 L143.722364,204.281957 L144.674105,193.403511 C142.810386,196.462718 140.729987,198.900677 138.403023,200.714772 L136.811568,197.564078 C139.695904,195.919205 142.067317,193.597051 143.953079,190.630116 L138.902372,190.188236 L139.148151,187.378967 Z M153.758046,206.605466 L151.337293,206.393678 L150.80604,203.516427 L153.368379,203.830946 C154.14541,203.898928 154.610876,203.397588 154.699775,202.38147 L156.370551,183.284417 L145.223132,182.309144 L145.463682,179.559647 L159.539913,180.791158 L157.555377,203.474511 C157.356662,205.745835 156.089142,206.80941 153.758046,206.605466 Z M134.442946,182.299553 L137.371759,182.555791 L135.384608,205.26903 L132.455795,205.012792 L134.442946,182.299553 Z M139.953836,177.481524 C140.974452,178.895859 141.829951,180.476435 142.585334,182.168711 L139.929992,183.261441 C139.122681,181.474278 138.239911,179.861201 137.219295,178.446867 L139.953836,177.481524 Z M928.762143,219 L934.792143,219 L934.792143,214.77 L937.672143,214.77 L937.672143,219 L943.372143,219 L943.372143,221.82 L937.672143,221.82 L937.672143,222.6 C940.402143,224.79 942.712143,226.98 944.572143,229.14 L942.532143,231.21 C941.272143,229.53 939.652143,227.79 937.672143,225.99 L937.672143,235.44 L934.792143,235.44 L934.792143,224.52 C933.202143,227.73 931.342143,230.34 929.182143,232.35 L927.322143,229.35 C930.052143,227.46 932.212143,224.94 933.832143,221.82 L928.762143,221.82 L928.762143,219 Z M944.992143,236.88 L942.562143,236.88 L941.782143,234.06 L944.362143,234.15 C945.142143,234.15 945.562143,233.61 945.562143,232.59 L945.562143,213.42 L934.372143,213.42 L934.372143,210.66 L948.502143,210.66 L948.502143,233.43 C948.502143,235.71 947.332143,236.88 944.992143,236.88 Z M923.632143,214.35 L926.572143,214.35 L926.572143,237.15 L923.632143,237.15 L923.632143,214.35 Z M928.702143,209.07 C929.842143,210.39 930.832143,211.89 931.732143,213.51 L929.182143,214.83 C928.222143,213.12 927.202143,211.59 926.062143,210.27 L928.702143,209.07 Z"
              id="text_light" stroke="#5ECBC4" stroke-width="3" fill="#244FC4" class=""></path>
            <path
              d="M734.357143,216.58 L743.237143,216.58 C748.397143,216.58 751.007143,218.77 751.007143,223.15 C751.007143,227.56 748.397143,229.78 743.177143,229.78 L737.867143,229.78 L737.867143,238 L734.357143,238 L734.357143,216.58 Z M737.867143,219.58 L737.867143,226.78 L742.967143,226.78 C744.527143,226.78 745.667143,226.48 746.387143,225.94 C747.107143,225.37 747.467143,224.44 747.467143,223.15 C747.467143,221.86 747.077143,220.96 746.357143,220.42 C745.637143,219.85 744.497143,219.58 742.967143,219.58 L737.867143,219.58 Z M389.357143,212.58 L398.237143,212.58 C403.397143,212.58 406.007143,214.77 406.007143,219.15 C406.007143,223.56 403.397143,225.78 398.177143,225.78 L392.867143,225.78 L392.867143,234 L389.357143,234 L389.357143,212.58 Z M392.867143,215.58 L392.867143,222.78 L397.967143,222.78 C399.527143,222.78 400.667143,222.48 401.387143,221.94 C402.107143,221.37 402.467143,220.44 402.467143,219.15 C402.467143,217.86 402.077143,216.96 401.357143,216.42 C400.637143,215.85 399.497143,215.58 397.967143,215.58 L392.867143,215.58 Z M149.035,38.385 L149.035,47.265 C149.035,52.425 146.845,55.035 142.465,55.035 C138.055,55.035 135.835,52.425 135.835,47.205 L135.835,41.895 L127.615,41.895 L127.615,38.385 L149.035,38.385 Z M146.035,41.895 L138.835,41.895 L138.835,46.995 C138.835,48.555 139.135,49.695 139.675,50.415 C140.245,51.135 141.175,51.495 142.465,51.495 C143.755,51.495 144.655,51.105 145.195,50.385 C145.765,49.665 146.035,48.525 146.035,46.995 L146.035,41.895 Z M230.545,35.735 L230.545,41.765 L234.775,41.765 L234.775,44.645 L230.545,44.645 L230.545,50.345 L227.725,50.345 L227.725,44.645 L226.945,44.645 C224.755,47.375 222.565,49.685 220.405,51.545 L218.335,49.505 C220.015,48.245 221.755,46.625 223.555,44.645 L214.105,44.645 L214.105,41.765 L225.025,41.765 C221.815,40.175 219.205,38.315 217.195,36.155 L220.195,34.295 C222.085,37.025 224.605,39.185 227.725,40.805 L227.725,35.735 L230.545,35.735 Z M212.665,51.965 L212.665,49.535 L215.485,48.755 L215.395,51.335 C215.395,52.115 215.935,52.535 216.955,52.535 L236.125,52.535 L236.125,41.345 L238.885,41.345 L238.885,55.475 L216.115,55.475 C213.835,55.475 212.665,54.305 212.665,51.965 Z M235.195,30.605 L235.195,33.545 L212.395,33.545 L212.395,30.605 L235.195,30.605 Z M240.475,35.675 C239.155,36.815 237.655,37.805 236.035,38.705 L234.715,36.155 C236.425,35.195 237.955,34.175 239.275,33.035 L240.475,35.675 Z M1175.45538,178.346326 L1184.30159,177.572383 C1189.44196,177.12266 1192.2329,179.07685 1192.61464,183.440182 C1192.999,187.833401 1190.59241,190.27243 1185.39228,190.727383 L1180.10248,191.19018 L1180.8189,199.3789 L1177.32226,199.684817 L1175.45538,178.346326 Z M1179.21349,181.028994 L1179.84102,188.201596 L1184.92161,187.757101 C1186.47567,187.621138 1187.58519,187.222922 1188.25538,186.622225 C1188.92297,185.991642 1189.20054,185.033805 1189.08811,183.748714 C1188.97568,182.463623 1188.50872,181.601038 1187.7444,181.125845 C1186.97746,180.620766 1185.81827,180.451151 1184.29409,180.584499 L1179.21349,181.028994 Z M575.762143,223 L581.792143,223 L581.792143,218.77 L584.672143,218.77 L584.672143,223 L590.372143,223 L590.372143,225.82 L584.672143,225.82 L584.672143,226.6 C587.402143,228.79 589.712143,230.98 591.572143,233.14 L589.532143,235.21 C588.272143,233.53 586.652143,231.79 584.672143,229.99 L584.672143,239.44 L581.792143,239.44 L581.792143,228.52 C580.202143,231.73 578.342143,234.34 576.182143,236.35 L574.322143,233.35 C577.052143,231.46 579.212143,228.94 580.832143,225.82 L575.762143,225.82 L575.762143,223 Z M591.992143,240.88 L589.562143,240.88 L588.782143,238.06 L591.362143,238.15 C592.142143,238.15 592.562143,237.61 592.562143,236.59 L592.562143,217.42 L581.372143,217.42 L581.372143,214.66 L595.502143,214.66 L595.502143,237.43 C595.502143,239.71 594.332143,240.88 591.992143,240.88 Z M570.632143,218.35 L573.572143,218.35 L573.572143,241.15 L570.632143,241.15 L570.632143,218.35 Z M575.702143,213.07 C576.842143,214.39 577.832143,215.89 578.732143,217.51 L576.182143,218.83 C575.222143,217.12 574.202143,215.59 573.062143,214.27 L575.702143,213.07 Z M139.148151,187.378967 L145.155205,187.904516 L145.523874,183.690613 L148.392914,183.941621 L148.024245,188.155525 L153.702555,188.652312 L153.456776,191.461582 L147.778466,190.964794 L147.710485,191.741826 C150.239225,194.161427 152.349564,196.544423 154.01423,198.858314 L151.80158,200.742639 C150.692796,198.959216 149.230612,197.084645 147.415027,195.118926 L146.591405,204.532966 L143.722364,204.281957 L144.674105,193.403511 C142.810386,196.462718 140.729987,198.900677 138.403023,200.714772 L136.811568,197.564078 C139.695904,195.919205 142.067317,193.597051 143.953079,190.630116 L138.902372,190.188236 L139.148151,187.378967 Z M153.758046,206.605466 L151.337293,206.393678 L150.80604,203.516427 L153.368379,203.830946 C154.14541,203.898928 154.610876,203.397588 154.699775,202.38147 L156.370551,183.284417 L145.223132,182.309144 L145.463682,179.559647 L159.539913,180.791158 L157.555377,203.474511 C157.356662,205.745835 156.089142,206.80941 153.758046,206.605466 Z M134.442946,182.299553 L137.371759,182.555791 L135.384608,205.26903 L132.455795,205.012792 L134.442946,182.299553 Z M139.953836,177.481524 C140.974452,178.895859 141.829951,180.476435 142.585334,182.168711 L139.929992,183.261441 C139.122681,181.474278 138.239911,179.861201 137.219295,178.446867 L139.953836,177.481524 Z M928.762143,219 L934.792143,219 L934.792143,214.77 L937.672143,214.77 L937.672143,219 L943.372143,219 L943.372143,221.82 L937.672143,221.82 L937.672143,222.6 C940.402143,224.79 942.712143,226.98 944.572143,229.14 L942.532143,231.21 C941.272143,229.53 939.652143,227.79 937.672143,225.99 L937.672143,235.44 L934.792143,235.44 L934.792143,224.52 C933.202143,227.73 931.342143,230.34 929.182143,232.35 L927.322143,229.35 C930.052143,227.46 932.212143,224.94 933.832143,221.82 L928.762143,221.82 L928.762143,219 Z M944.992143,236.88 L942.562143,236.88 L941.782143,234.06 L944.362143,234.15 C945.142143,234.15 945.562143,233.61 945.562143,232.59 L945.562143,213.42 L934.372143,213.42 L934.372143,210.66 L948.502143,210.66 L948.502143,233.43 C948.502143,235.71 947.332143,236.88 944.992143,236.88 Z M923.632143,214.35 L926.572143,214.35 L926.572143,237.15 L923.632143,237.15 L923.632143,214.35 Z M928.702143,209.07 C929.842143,210.39 930.832143,211.89 931.732143,213.51 L929.182143,214.83 C928.222143,213.12 927.202143,211.59 926.062143,210.27 L928.702143,209.07 Z"
              id="text" fill="#244FC4" class=""></path>
            <g id="P_Q_B" transform="translate(112, 16)">
              <playerBet v-bind="playerBetChipsData" />
            </g>
          </g>
        </g>
        <g id="T_Q" transform="translate(275, 188)">
          <g id="T_Q_I" class="" @click="calcBetPoint('T_Q_I', 'T_Q_B')" :class="{ disable: forbidenBet }">
            <path
              d="M126,0 L59.3975083,0 C59.3975083,0 9.95490539,66.320563 4.0323543,80.8454146 C-13.4791197,109.846672 25.7408499,146.522625 127.649168,153.231322 C182.111314,156.817238 296.61266,160.996124 408.39615,160.999031 L408.39615,161 C520.356315,160.996124 634.822325,156.820145 689.273675,153.238104 C791.22518,146.531345 830.485392,109.853455 812.968029,80.8454146 C807.045478,66.320563 757.602875,0 757.602875,0 L690,0 L690,69 C690,91.09139 672.09139,109 650,109 L166,109 L166,109 C143.90861,109 126,91.09139 126,69 L126,7.10542736e-15 Z"
              class=""></path>
            <path
              d="M391.895,126.08 L391.895,150.86 L388.835,150.86 L388.835,148.7 L382.685,148.7 L382.685,151.22 L379.655,151.22 L379.655,126.08 L391.895,126.08 Z M382.685,145.76 L388.835,145.76 L388.835,128.99 L382.685,128.99 L382.685,145.76 Z M366.125,132.29 L366.125,135.2 L371.045,135.2 L371.045,135.35 C369.785,138.29 367.865,140.93 365.255,143.27 L366.605,146.72 C368.375,144.71 369.845,142.52 371.045,140.12 L371.045,151.79 L374.045,151.79 L374.045,139.34 C374.945,140.48 376.025,141.98 377.285,143.84 L379.115,141.11 C377.405,139.31 375.725,137.69 374.045,136.28 L374.045,135.2 L378.845,135.2 L378.845,132.29 L374.045,132.29 L374.045,128.42 C375.605,128.06 377.165,127.58 378.695,127.04 L377.225,124.46 C374.465,125.51 370.715,126.23 366.035,126.62 L367.055,129.41 C368.375,129.32 369.725,129.17 371.045,128.96 L371.045,132.29 L366.125,132.29 Z M406.235,127.58 L406.235,130.58 L413.255,130.58 L413.255,149 L416.765,149 L416.765,130.58 L423.785,130.58 L423.785,127.58 L406.235,127.58 Z M427.175,127.58 L427.175,149 L430.685,149 L430.685,127.58 L427.175,127.58 Z M435.725,127.58 L435.725,149 L451.685,149 L451.685,146 L439.235,146 L439.235,139.52 L450.455,139.52 L450.455,136.52 L439.235,136.52 L439.235,130.58 L451.175,130.58 L451.175,127.58 L435.725,127.58 Z"
              id="text_light" stroke="#A8D6C5" stroke-width="3" fill="#569F3B" class=""></path>
            <path
              d="M391.895,126.08 L391.895,150.86 L388.835,150.86 L388.835,148.7 L382.685,148.7 L382.685,151.22 L379.655,151.22 L379.655,126.08 L391.895,126.08 Z M382.685,145.76 L388.835,145.76 L388.835,128.99 L382.685,128.99 L382.685,145.76 Z M366.125,132.29 L366.125,135.2 L371.045,135.2 L371.045,135.35 C369.785,138.29 367.865,140.93 365.255,143.27 L366.605,146.72 C368.375,144.71 369.845,142.52 371.045,140.12 L371.045,151.79 L374.045,151.79 L374.045,139.34 C374.945,140.48 376.025,141.98 377.285,143.84 L379.115,141.11 C377.405,139.31 375.725,137.69 374.045,136.28 L374.045,135.2 L378.845,135.2 L378.845,132.29 L374.045,132.29 L374.045,128.42 C375.605,128.06 377.165,127.58 378.695,127.04 L377.225,124.46 C374.465,125.51 370.715,126.23 366.035,126.62 L367.055,129.41 C368.375,129.32 369.725,129.17 371.045,128.96 L371.045,132.29 L366.125,132.29 Z M406.235,127.58 L406.235,130.58 L413.255,130.58 L413.255,149 L416.765,149 L416.765,130.58 L423.785,130.58 L423.785,127.58 L406.235,127.58 Z M427.175,127.58 L427.175,149 L430.685,149 L430.685,127.58 L427.175,127.58 Z M435.725,127.58 L435.725,149 L451.685,149 L451.685,146 L439.235,146 L439.235,139.52 L450.455,139.52 L450.455,136.52 L439.235,136.52 L439.235,130.58 L451.175,130.58 L451.175,127.58 L435.725,127.58 Z"
              id="text" fill="#569F3B" class=""></path>
            <g id="T_Q_B" transform="translate(29, 5)">
              <tieBet v-bind="tieBetChipsData" />
            </g>
          </g>
        </g>
        <g id="PP_Q" transform="translate(0, 108)">
          <g id="PP_Q_I" class="" @click="calcBetPoint('PP_Q_I', 'PP_Q_B')">
            <polygon transform="translate(199.833984, 37.500000) scale(-1, 1) translate(-199.833984, -37.500000) "
              points="0 0 321.15625 0 399.667969 75 37.6679688 75" class=""></polygon>
            <path
              d="M119.512,30.656 L126.16,30.656 L126.16,26.192 L128.68,26.192 L128.68,30.656 L131.08,30.656 L131.08,33.08 L128.68,33.08 L128.68,45.488 C128.68,47.408 127.672,48.368 125.656,48.368 L122.08,48.368 L121.528,45.92 C122.68,46.016 123.76,46.088 124.792,46.088 C125.704,46.088 126.16,45.68 126.16,44.864 L126.16,33.08 L119.512,33.08 L119.512,30.656 Z M111.328,32.408 C112.696,33.896 113.968,35.408 115.168,36.896 C115.888,35.024 116.296,32.984 116.416,30.824 L110.08,30.824 L110.08,28.4 L118.6,28.4 L118.6,30.224 C118.576,33.392 117.952,36.296 116.752,38.96 C117.664,40.16 118.48,41.336 119.248,42.536 L117.376,44.408 C116.8,43.4 116.176,42.392 115.456,41.36 C114.16,43.4 112.48,45.272 110.44,47 L109,44.84 C111.136,43.232 112.816,41.384 114.016,39.32 C112.72,37.592 111.256,35.84 109.624,34.016 L111.328,32.408 Z M121.264,35.336 C122.8,37.256 124,38.96 124.816,40.424 L122.848,41.816 C121.984,40.28 120.832,38.576 119.344,36.728 L121.264,35.336 Z M134.196571,36.176 L144.012571,36.176 L144.012571,33.248 C145.836571,32.192 147.612571,30.92 149.340571,29.432 L136.716571,29.432 L136.716571,27.08 L152.676571,27.08 L152.676571,29.432 C150.876571,31.208 148.836571,32.912 146.532571,34.496 L146.532571,36.176 L155.364571,36.176 L155.364571,38.624 L146.532571,38.624 L146.532571,45.848 C146.532571,47.456 145.716571,48.272 144.132571,48.272 L139.860571,48.272 L139.188571,45.848 C140.388571,45.896 141.684571,45.92 143.100571,45.92 C143.700571,45.92 144.012571,45.632 144.012571,45.056 L144.012571,38.624 L134.196571,38.624 L134.196571,36.176 Z M162.177143,26.096 L164.457143,26.096 C163.449143,27.752 162.681143,29.408 162.153143,31.064 C161.433143,33.128 161.097143,35.216 161.097143,37.304 C161.097143,39.368 161.433143,41.456 162.153143,43.544 C162.681143,45.176 163.449143,46.832 164.457143,48.512 L162.177143,48.512 C161.025143,46.928 160.161143,45.296 159.537143,43.616 C158.793143,41.6 158.433143,39.488 158.433143,37.328 C158.433143,35.12 158.793143,33.032 159.537143,31.016 C160.161143,29.288 161.025143,27.656 162.177143,26.096 Z M172.253714,33.944 L177.077714,33.944 L177.077714,30.56 L179.381714,30.56 L179.381714,33.944 L183.941714,33.944 L183.941714,36.2 L179.381714,36.2 L179.381714,36.824 C181.565714,38.576 183.413714,40.328 184.901714,42.056 L183.269714,43.712 C182.261714,42.368 180.965714,40.976 179.381714,39.536 L179.381714,47.096 L177.077714,47.096 L177.077714,38.36 C175.805714,40.928 174.317714,43.016 172.589714,44.624 L171.101714,42.224 C173.285714,40.712 175.013714,38.696 176.309714,36.2 L172.253714,36.2 L172.253714,33.944 Z M185.237714,48.248 L183.293714,48.248 L182.669714,45.992 L184.733714,46.064 C185.357714,46.064 185.693714,45.632 185.693714,44.816 L185.693714,29.48 L176.741714,29.48 L176.741714,27.272 L188.045714,27.272 L188.045714,45.488 C188.045714,47.312 187.109714,48.248 185.237714,48.248 Z M168.149714,30.224 L170.501714,30.224 L170.501714,48.464 L168.149714,48.464 L168.149714,30.224 Z M172.205714,26 C173.117714,27.056 173.909714,28.256 174.629714,29.552 L172.589714,30.608 C171.821714,29.24 171.005714,28.016 170.093714,26.96 L172.205714,26 Z M191.762286,26.096 L194.042286,26.096 C195.170286,27.656 196.058286,29.288 196.682286,31.016 C197.402286,33.032 197.786286,35.12 197.786286,37.328 C197.786286,39.488 197.402286,41.6 196.682286,43.616 C196.058286,45.296 195.170286,46.928 194.042286,48.512 L191.762286,48.512 C192.746286,46.832 193.514286,45.176 194.066286,43.544 C194.762286,41.456 195.122286,39.368 195.122286,37.304 C195.122286,35.216 194.762286,33.128 194.066286,31.064 C193.514286,29.408 192.746286,27.752 191.762286,26.096 Z M209.779428,28.808 L216.883428,28.808 C221.011428,28.808 223.099428,30.56 223.099428,34.064 C223.099428,37.592 221.011428,39.368 216.835428,39.368 L212.587428,39.368 L212.587428,45.944 L209.779428,45.944 L209.779428,28.808 Z M212.587428,31.208 L212.587428,36.968 L216.667428,36.968 C217.915428,36.968 218.827428,36.728 219.403428,36.296 C219.979428,35.84 220.267428,35.096 220.267428,34.064 C220.267428,33.032 219.955428,32.312 219.379428,31.88 C218.803428,31.424 217.891428,31.208 216.667428,31.208 L212.587428,31.208 Z M227.776,42.32 C228.304,42.32 228.736,42.488 229.12,42.872 C229.48,43.232 229.672,43.688 229.672,44.216 C229.672,44.744 229.48,45.176 229.12,45.56 C228.736,45.896 228.304,46.088 227.776,46.088 C227.248,46.088 226.792,45.896 226.456,45.56 C226.072,45.176 225.904,44.744 225.904,44.216 C225.904,43.688 226.072,43.232 226.456,42.872 C226.792,42.488 227.248,42.32 227.776,42.32 Z M242.097143,28.808 L249.201143,28.808 C253.329143,28.808 255.417143,30.56 255.417143,34.064 C255.417143,37.592 253.329143,39.368 249.153143,39.368 L244.905143,39.368 L244.905143,45.944 L242.097143,45.944 L242.097143,28.808 Z M244.905143,31.208 L244.905143,36.968 L248.985143,36.968 C250.233143,36.968 251.145143,36.728 251.721143,36.296 C252.297143,35.84 252.585143,35.096 252.585143,34.064 C252.585143,33.032 252.273143,32.312 251.697143,31.88 C251.121143,31.424 250.209143,31.208 248.985143,31.208 L244.905143,31.208 Z M263.357714,28.808 L266.549714,28.808 L273.101714,45.944 L270.101714,45.944 L268.541714,41.648 L261.365714,41.648 L259.805714,45.944 L256.805714,45.944 L263.357714,28.808 Z M262.205714,39.344 L267.701714,39.344 L265.013714,31.832 L264.917714,31.832 L262.205714,39.344 Z M275.450285,28.808 L278.258285,28.808 L278.258285,45.944 L275.450285,45.944 L275.450285,28.808 Z M282.286857,28.808 L289.918857,28.808 C291.670857,28.808 293.062857,29.192 294.070857,29.984 C295.126857,30.848 295.678857,32.096 295.678857,33.728 C295.678857,34.616 295.438857,35.408 294.958857,36.104 C294.430857,36.872 293.686857,37.376 292.774857,37.616 C294.262857,38 295.102857,38.984 295.294857,40.664 L295.582857,43.424 C295.678857,44.48 296.038857,45.32 296.614857,45.944 L293.566857,45.944 C293.158857,45.416 292.918857,44.672 292.822857,43.712 L292.606857,41.6 C292.510857,40.664 292.222857,39.992 291.742857,39.584 C291.238857,39.152 290.494857,38.96 289.534857,38.96 L285.094857,38.96 L285.094857,45.944 L282.286857,45.944 L282.286857,28.808 Z M285.094857,31.208 L285.094857,36.56 L289.534857,36.56 C290.638857,36.56 291.478857,36.32 292.054857,35.864 C292.582857,35.384 292.846857,34.712 292.846857,33.848 C292.846857,32.912 292.582857,32.24 292.054857,31.832 C291.526857,31.4 290.686857,31.208 289.534857,31.208 L285.094857,31.208 Z"
              id="text_light" stroke="#5ECBC4" stroke-width="3" fill="#244FC4" class=""></path>
            <path
              d="M119.512,30.656 L126.16,30.656 L126.16,26.192 L128.68,26.192 L128.68,30.656 L131.08,30.656 L131.08,33.08 L128.68,33.08 L128.68,45.488 C128.68,47.408 127.672,48.368 125.656,48.368 L122.08,48.368 L121.528,45.92 C122.68,46.016 123.76,46.088 124.792,46.088 C125.704,46.088 126.16,45.68 126.16,44.864 L126.16,33.08 L119.512,33.08 L119.512,30.656 Z M111.328,32.408 C112.696,33.896 113.968,35.408 115.168,36.896 C115.888,35.024 116.296,32.984 116.416,30.824 L110.08,30.824 L110.08,28.4 L118.6,28.4 L118.6,30.224 C118.576,33.392 117.952,36.296 116.752,38.96 C117.664,40.16 118.48,41.336 119.248,42.536 L117.376,44.408 C116.8,43.4 116.176,42.392 115.456,41.36 C114.16,43.4 112.48,45.272 110.44,47 L109,44.84 C111.136,43.232 112.816,41.384 114.016,39.32 C112.72,37.592 111.256,35.84 109.624,34.016 L111.328,32.408 Z M121.264,35.336 C122.8,37.256 124,38.96 124.816,40.424 L122.848,41.816 C121.984,40.28 120.832,38.576 119.344,36.728 L121.264,35.336 Z M134.196571,36.176 L144.012571,36.176 L144.012571,33.248 C145.836571,32.192 147.612571,30.92 149.340571,29.432 L136.716571,29.432 L136.716571,27.08 L152.676571,27.08 L152.676571,29.432 C150.876571,31.208 148.836571,32.912 146.532571,34.496 L146.532571,36.176 L155.364571,36.176 L155.364571,38.624 L146.532571,38.624 L146.532571,45.848 C146.532571,47.456 145.716571,48.272 144.132571,48.272 L139.860571,48.272 L139.188571,45.848 C140.388571,45.896 141.684571,45.92 143.100571,45.92 C143.700571,45.92 144.012571,45.632 144.012571,45.056 L144.012571,38.624 L134.196571,38.624 L134.196571,36.176 Z M162.177143,26.096 L164.457143,26.096 C163.449143,27.752 162.681143,29.408 162.153143,31.064 C161.433143,33.128 161.097143,35.216 161.097143,37.304 C161.097143,39.368 161.433143,41.456 162.153143,43.544 C162.681143,45.176 163.449143,46.832 164.457143,48.512 L162.177143,48.512 C161.025143,46.928 160.161143,45.296 159.537143,43.616 C158.793143,41.6 158.433143,39.488 158.433143,37.328 C158.433143,35.12 158.793143,33.032 159.537143,31.016 C160.161143,29.288 161.025143,27.656 162.177143,26.096 Z M172.253714,33.944 L177.077714,33.944 L177.077714,30.56 L179.381714,30.56 L179.381714,33.944 L183.941714,33.944 L183.941714,36.2 L179.381714,36.2 L179.381714,36.824 C181.565714,38.576 183.413714,40.328 184.901714,42.056 L183.269714,43.712 C182.261714,42.368 180.965714,40.976 179.381714,39.536 L179.381714,47.096 L177.077714,47.096 L177.077714,38.36 C175.805714,40.928 174.317714,43.016 172.589714,44.624 L171.101714,42.224 C173.285714,40.712 175.013714,38.696 176.309714,36.2 L172.253714,36.2 L172.253714,33.944 Z M185.237714,48.248 L183.293714,48.248 L182.669714,45.992 L184.733714,46.064 C185.357714,46.064 185.693714,45.632 185.693714,44.816 L185.693714,29.48 L176.741714,29.48 L176.741714,27.272 L188.045714,27.272 L188.045714,45.488 C188.045714,47.312 187.109714,48.248 185.237714,48.248 Z M168.149714,30.224 L170.501714,30.224 L170.501714,48.464 L168.149714,48.464 L168.149714,30.224 Z M172.205714,26 C173.117714,27.056 173.909714,28.256 174.629714,29.552 L172.589714,30.608 C171.821714,29.24 171.005714,28.016 170.093714,26.96 L172.205714,26 Z M191.762286,26.096 L194.042286,26.096 C195.170286,27.656 196.058286,29.288 196.682286,31.016 C197.402286,33.032 197.786286,35.12 197.786286,37.328 C197.786286,39.488 197.402286,41.6 196.682286,43.616 C196.058286,45.296 195.170286,46.928 194.042286,48.512 L191.762286,48.512 C192.746286,46.832 193.514286,45.176 194.066286,43.544 C194.762286,41.456 195.122286,39.368 195.122286,37.304 C195.122286,35.216 194.762286,33.128 194.066286,31.064 C193.514286,29.408 192.746286,27.752 191.762286,26.096 Z M209.779428,28.808 L216.883428,28.808 C221.011428,28.808 223.099428,30.56 223.099428,34.064 C223.099428,37.592 221.011428,39.368 216.835428,39.368 L212.587428,39.368 L212.587428,45.944 L209.779428,45.944 L209.779428,28.808 Z M212.587428,31.208 L212.587428,36.968 L216.667428,36.968 C217.915428,36.968 218.827428,36.728 219.403428,36.296 C219.979428,35.84 220.267428,35.096 220.267428,34.064 C220.267428,33.032 219.955428,32.312 219.379428,31.88 C218.803428,31.424 217.891428,31.208 216.667428,31.208 L212.587428,31.208 Z M227.776,42.32 C228.304,42.32 228.736,42.488 229.12,42.872 C229.48,43.232 229.672,43.688 229.672,44.216 C229.672,44.744 229.48,45.176 229.12,45.56 C228.736,45.896 228.304,46.088 227.776,46.088 C227.248,46.088 226.792,45.896 226.456,45.56 C226.072,45.176 225.904,44.744 225.904,44.216 C225.904,43.688 226.072,43.232 226.456,42.872 C226.792,42.488 227.248,42.32 227.776,42.32 Z M242.097143,28.808 L249.201143,28.808 C253.329143,28.808 255.417143,30.56 255.417143,34.064 C255.417143,37.592 253.329143,39.368 249.153143,39.368 L244.905143,39.368 L244.905143,45.944 L242.097143,45.944 L242.097143,28.808 Z M244.905143,31.208 L244.905143,36.968 L248.985143,36.968 C250.233143,36.968 251.145143,36.728 251.721143,36.296 C252.297143,35.84 252.585143,35.096 252.585143,34.064 C252.585143,33.032 252.273143,32.312 251.697143,31.88 C251.121143,31.424 250.209143,31.208 248.985143,31.208 L244.905143,31.208 Z M263.357714,28.808 L266.549714,28.808 L273.101714,45.944 L270.101714,45.944 L268.541714,41.648 L261.365714,41.648 L259.805714,45.944 L256.805714,45.944 L263.357714,28.808 Z M262.205714,39.344 L267.701714,39.344 L265.013714,31.832 L264.917714,31.832 L262.205714,39.344 Z M275.450285,28.808 L278.258285,28.808 L278.258285,45.944 L275.450285,45.944 L275.450285,28.808 Z M282.286857,28.808 L289.918857,28.808 C291.670857,28.808 293.062857,29.192 294.070857,29.984 C295.126857,30.848 295.678857,32.096 295.678857,33.728 C295.678857,34.616 295.438857,35.408 294.958857,36.104 C294.430857,36.872 293.686857,37.376 292.774857,37.616 L292.774857,37.664 C294.262857,38 295.102857,38.984 295.294857,40.664 L295.582857,43.424 C295.678857,44.48 296.038857,45.32 296.614857,45.944 L293.566857,45.944 C293.158857,45.416 292.918857,44.672 292.822857,43.712 L292.606857,41.6 C292.510857,40.664 292.222857,39.992 291.742857,39.584 C291.238857,39.152 290.494857,38.96 289.534857,38.96 L285.094857,38.96 L285.094857,45.944 L282.286857,45.944 L282.286857,28.808 Z M285.094857,31.208 L285.094857,36.56 L289.534857,36.56 C290.638857,36.56 291.478857,36.32 292.054857,35.864 C292.582857,35.384 292.846857,34.712 292.846857,33.848 C292.846857,32.912 292.582857,32.24 292.054857,31.832 C291.526857,31.4 290.686857,31.208 289.534857,31.208 L285.094857,31.208 Z"
              id="text" fill="#244FC4" class=""></path>
            <playerPairBet v-bind="playerPairBetChipsData" />
          </g>
        </g>
        <g id="BP_Q" transform="translate(966, 108)">
          <g id="BP_Q_I" class="" @click="calcBetPoint('BP_Q_I', 'BP_Q_B')">
            <polygon points="0 0 321.15625 0 399.667969 75 37.6679688 75" class=""></polygon>
            <path
              d="M116.512,30.56 L123.16,30.56 L123.16,26.096 L125.68,26.096 L125.68,30.56 L128.08,30.56 L128.08,32.984 L125.68,32.984 L125.68,45.392 C125.68,47.312 124.672,48.272 122.656,48.272 L119.08,48.272 L118.528,45.824 C119.68,45.92 120.76,45.992 121.792,45.992 C122.704,45.992 123.16,45.584 123.16,44.768 L123.16,32.984 L116.512,32.984 L116.512,30.56 Z M108.328,32.312 C109.696,33.8 110.968,35.312 112.168,36.8 C112.888,34.928 113.296,32.888 113.416,30.728 L107.08,30.728 L107.08,28.304 L115.6,28.304 L115.6,30.128 C115.576,33.296 114.952,36.2 113.752,38.864 C114.664,40.064 115.48,41.24 116.248,42.44 L114.376,44.312 C113.8,43.304 113.176,42.296 112.456,41.264 C111.16,43.304 109.48,45.176 107.44,46.904 L106,44.744 C108.136,43.136 109.816,41.288 111.016,39.224 C109.72,37.496 108.256,35.744 106.624,33.92 L108.328,32.312 Z M118.264,35.24 C119.8,37.16 121,38.864 121.816,40.328 L119.848,41.72 C118.984,40.184 117.832,38.48 116.344,36.632 L118.264,35.24 Z M131.196572,36.08 L141.012571,36.08 L141.012571,33.152 C142.836571,32.096 144.612571,30.824 146.340572,29.336 L133.716571,29.336 L133.716571,26.984 L149.676572,26.984 L149.676572,29.336 C147.876571,31.112 145.836571,32.816 143.532572,34.4 L143.532572,36.08 L152.364572,36.08 L152.364572,38.528 L143.532572,38.528 L143.532572,45.752 C143.532572,47.36 142.716571,48.176 141.132571,48.176 L136.860571,48.176 L136.188571,45.752 C137.388572,45.8 138.684571,45.824 140.100572,45.824 C140.700571,45.824 141.012571,45.536 141.012571,44.96 L141.012571,38.528 L131.196572,38.528 L131.196572,36.08 Z M159.177143,26 L161.457143,26 C160.449143,27.656 159.681143,29.312 159.153143,30.968 C158.433143,33.032 158.097143,35.12 158.097143,37.208 C158.097143,39.272 158.433143,41.36 159.153143,43.448 C159.681143,45.08 160.449143,46.736 161.457143,48.416 L159.177143,48.416 C158.025143,46.832 157.161143,45.2 156.537143,43.52 C155.793143,41.504 155.433143,39.392 155.433143,37.232 C155.433143,35.024 155.793143,32.936 156.537143,30.92 C157.161143,29.192 158.025143,27.56 159.177143,26 Z M170.045714,36.656 L176.045714,36.656 L176.045714,32.144 L178.589715,32.144 L178.589715,36.656 L184.709714,36.656 L184.709714,39.08 L178.589715,39.08 L178.589715,45.08 L185.885714,45.08 L185.885714,47.528 L168.629714,47.528 L168.629714,45.08 L176.045714,45.08 L176.045714,39.08 L170.045714,39.08 L170.045714,36.656 Z M176.261714,26.048 C176.621714,26.816 176.981714,27.68 177.317714,28.616 L185.885714,28.616 L185.885714,31.04 L168.389714,31.04 L168.389714,35.984 C168.317714,41.144 167.549714,45.296 166.109714,48.416 L163.973714,46.52 C165.173714,43.976 165.797714,40.472 165.845714,35.984 L165.845714,28.616 L174.557714,28.616 C174.221714,27.872 173.861714,27.176 173.453714,26.528 L176.261714,26.048 Z M188.762286,26 L191.042286,26 C192.170286,27.56 193.058286,29.192 193.682286,30.92 C194.402286,32.936 194.786286,35.024 194.786286,37.232 C194.786286,39.392 194.402286,41.504 193.682286,43.52 C193.058286,45.2 192.170286,46.832 191.042286,48.416 L188.762286,48.416 C189.746286,46.736 190.514286,45.08 191.066286,43.448 C191.762286,41.36 192.122286,39.272 192.122286,37.208 C192.122286,35.12 191.762286,33.032 191.066286,30.968 C190.514286,29.312 189.746286,27.656 188.762286,26 Z M206.779429,28.712 L214.627429,28.712 C216.331429,28.712 217.675429,29.12 218.635429,29.936 C219.523429,30.704 219.979429,31.736 219.979429,33.032 C219.979429,33.992 219.739429,34.808 219.283429,35.48 C218.827429,36.104 218.179429,36.56 217.315429,36.896 C218.443429,37.112 219.283429,37.568 219.859429,38.264 C220.411429,38.936 220.699429,39.872 220.699429,41.024 C220.699429,42.752 220.099429,44.024 218.923429,44.84 C217.915429,45.512 216.475429,45.848 214.651429,45.848 L206.779429,45.848 L206.779429,28.712 Z M209.587429,31.016 L209.587429,35.912 L213.883429,35.912 C215.083429,35.912 215.923429,35.696 216.427429,35.312 C216.907429,34.904 217.171429,34.256 217.171429,33.368 C217.171429,32.552 216.907429,31.952 216.427429,31.592 C215.899429,31.208 215.083429,31.016 213.931429,31.016 L209.587429,31.016 Z M209.587429,38.216 L209.587429,43.544 L214.243429,43.544 C215.299429,43.544 216.139429,43.376 216.739429,43.04 C217.507429,42.608 217.891429,41.936 217.891429,40.976 C217.891429,39.992 217.603429,39.296 217.051429,38.864 C216.475429,38.432 215.563429,38.216 214.315429,38.216 L209.587429,38.216 Z M225.616,42.224 C226.144,42.224 226.576,42.392 226.960001,42.776 C227.320001,43.136 227.512001,43.592 227.512001,44.12 C227.512001,44.648 227.320001,45.08 226.960001,45.464 C226.576,45.8 226.144,45.992 225.616,45.992 C225.088001,45.992 224.632001,45.8 224.296001,45.464 C223.912001,45.08 223.744,44.648 223.744,44.12 C223.744,43.592 223.912001,43.136 224.296001,42.776 C224.632001,42.392 225.088001,42.224 225.616,42.224 Z M239.937143,28.712 L247.041143,28.712 C251.169143,28.712 253.257143,30.464 253.257143,33.968 C253.257143,37.496 251.169143,39.272 246.993143,39.272 L242.745143,39.272 L242.745143,45.848 L239.937143,45.848 L239.937143,28.712 Z M242.745143,31.112 L242.745143,36.872 L246.825143,36.872 C248.073143,36.872 248.985143,36.632 249.561143,36.2 C250.137143,35.744 250.425143,35 250.425143,33.968 C250.425143,32.936 250.113143,32.216 249.537143,31.784 C248.961144,31.328 248.049143,31.112 246.825143,31.112 L242.745143,31.112 Z M261.197715,28.712 L264.389715,28.712 L270.941715,45.848 L267.941715,45.848 L266.381715,41.552 L259.205715,41.552 L257.645715,45.848 L254.645715,45.848 L261.197715,28.712 Z M260.045715,39.248 L265.541715,39.248 L262.853715,31.736 L262.757715,31.736 L260.045715,39.248 Z M273.290286,28.712 L276.098286,28.712 L276.098286,45.848 L273.290286,45.848 L273.290286,28.712 Z M280.126858,28.712 L287.758858,28.712 C289.510858,28.712 290.902858,29.096 291.910858,29.888 C292.966858,30.752 293.518858,32 293.518858,33.632 C293.518858,34.52 293.278858,35.312 292.798858,36.008 C292.270858,36.776 291.526858,37.28 290.614858,37.52 L290.614858,37.568 C292.102858,37.904 292.942858,38.888 293.134858,40.568 L293.422858,43.328 C293.518858,44.384 293.878858,45.224 294.454858,45.848 L291.406858,45.848 C290.998858,45.32 290.758858,44.576 290.662858,43.616 L290.446858,41.504 C290.350858,40.568 290.062858,39.896 289.582858,39.488 C289.078858,39.056 288.334858,38.864 287.374858,38.864 L282.934858,38.864 L282.934858,45.848 L280.126858,45.848 L280.126858,28.712 Z M282.934858,31.112 L282.934858,36.464 L287.374858,36.464 C288.478858,36.464 289.318858,36.224 289.894858,35.768 C290.422858,35.288 290.686858,34.616 290.686858,33.752 C290.686858,32.816 290.422858,32.144 289.894858,31.736 C289.366858,31.304 288.526858,31.112 287.374858,31.112 L282.934858,31.112 Z"
              id="text_light" stroke="#E68888" stroke-width="3" fill="#AB2B20" class=""></path>
            <path
              d="M116.512,30.56 L123.16,30.56 L123.16,26.096 L125.68,26.096 L125.68,30.56 L128.08,30.56 L128.08,32.984 L125.68,32.984 L125.68,45.392 C125.68,47.312 124.672,48.272 122.656,48.272 L119.08,48.272 L118.528,45.824 C119.68,45.92 120.76,45.992 121.792,45.992 C122.704,45.992 123.16,45.584 123.16,44.768 L123.16,32.984 L116.512,32.984 L116.512,30.56 Z M108.328,32.312 C109.696,33.8 110.968,35.312 112.168,36.8 C112.888,34.928 113.296,32.888 113.416,30.728 L107.08,30.728 L107.08,28.304 L115.6,28.304 L115.6,30.128 C115.576,33.296 114.952,36.2 113.752,38.864 C114.664,40.064 115.48,41.24 116.248,42.44 L114.376,44.312 C113.8,43.304 113.176,42.296 112.456,41.264 C111.16,43.304 109.48,45.176 107.44,46.904 L106,44.744 C108.136,43.136 109.816,41.288 111.016,39.224 C109.72,37.496 108.256,35.744 106.624,33.92 L108.328,32.312 Z M118.264,35.24 C119.8,37.16 121,38.864 121.816,40.328 L119.848,41.72 C118.984,40.184 117.832,38.48 116.344,36.632 L118.264,35.24 Z M131.196572,36.08 L141.012571,36.08 L141.012571,33.152 C142.836571,32.096 144.612571,30.824 146.340572,29.336 L133.716571,29.336 L133.716571,26.984 L149.676572,26.984 L149.676572,29.336 C147.876571,31.112 145.836571,32.816 143.532572,34.4 L143.532572,36.08 L152.364572,36.08 L152.364572,38.528 L143.532572,38.528 L143.532572,45.752 C143.532572,47.36 142.716571,48.176 141.132571,48.176 L136.860571,48.176 L136.188571,45.752 C137.388572,45.8 138.684571,45.824 140.100572,45.824 C140.700571,45.824 141.012571,45.536 141.012571,44.96 L141.012571,38.528 L131.196572,38.528 L131.196572,36.08 Z M159.177143,26 L161.457143,26 C160.449143,27.656 159.681143,29.312 159.153143,30.968 C158.433143,33.032 158.097143,35.12 158.097143,37.208 C158.097143,39.272 158.433143,41.36 159.153143,43.448 C159.681143,45.08 160.449143,46.736 161.457143,48.416 L159.177143,48.416 C158.025143,46.832 157.161143,45.2 156.537143,43.52 C155.793143,41.504 155.433143,39.392 155.433143,37.232 C155.433143,35.024 155.793143,32.936 156.537143,30.92 C157.161143,29.192 158.025143,27.56 159.177143,26 Z M170.045714,36.656 L176.045714,36.656 L176.045714,32.144 L178.589715,32.144 L178.589715,36.656 L184.709714,36.656 L184.709714,39.08 L178.589715,39.08 L178.589715,45.08 L185.885714,45.08 L185.885714,47.528 L168.629714,47.528 L168.629714,45.08 L176.045714,45.08 L176.045714,39.08 L170.045714,39.08 L170.045714,36.656 Z M176.261714,26.048 C176.621714,26.816 176.981714,27.68 177.317714,28.616 L185.885714,28.616 L185.885714,31.04 L168.389714,31.04 L168.389714,35.984 C168.317714,41.144 167.549714,45.296 166.109714,48.416 L163.973714,46.52 C165.173714,43.976 165.797714,40.472 165.845714,35.984 L165.845714,28.616 L174.557714,28.616 C174.221714,27.872 173.861714,27.176 173.453714,26.528 L176.261714,26.048 Z M188.762286,26 L191.042286,26 C192.170286,27.56 193.058286,29.192 193.682286,30.92 C194.402286,32.936 194.786286,35.024 194.786286,37.232 C194.786286,39.392 194.402286,41.504 193.682286,43.52 C193.058286,45.2 192.170286,46.832 191.042286,48.416 L188.762286,48.416 C189.746286,46.736 190.514286,45.08 191.066286,43.448 C191.762286,41.36 192.122286,39.272 192.122286,37.208 C192.122286,35.12 191.762286,33.032 191.066286,30.968 C190.514286,29.312 189.746286,27.656 188.762286,26 Z M206.779429,28.712 L214.627429,28.712 C216.331429,28.712 217.675429,29.12 218.635429,29.936 C219.523429,30.704 219.979429,31.736 219.979429,33.032 C219.979429,33.992 219.739429,34.808 219.283429,35.48 C218.827429,36.104 218.179429,36.56 217.315429,36.896 C218.443429,37.112 219.283429,37.568 219.859429,38.264 C220.411429,38.936 220.699429,39.872 220.699429,41.024 C220.699429,42.752 220.099429,44.024 218.923429,44.84 C217.915429,45.512 216.475429,45.848 214.651429,45.848 L206.779429,45.848 L206.779429,28.712 Z M209.587429,31.016 L209.587429,35.912 L213.883429,35.912 C215.083429,35.912 215.923429,35.696 216.427429,35.312 C216.907429,34.904 217.171429,34.256 217.171429,33.368 C217.171429,32.552 216.907429,31.952 216.427429,31.592 C215.899429,31.208 215.083429,31.016 213.931429,31.016 L209.587429,31.016 Z M209.587429,38.216 L209.587429,43.544 L214.243429,43.544 C215.299429,43.544 216.139429,43.376 216.739429,43.04 C217.507429,42.608 217.891429,41.936 217.891429,40.976 C217.891429,39.992 217.603429,39.296 217.051429,38.864 C216.475429,38.432 215.563429,38.216 214.315429,38.216 L209.587429,38.216 Z M225.616,42.224 C226.144,42.224 226.576,42.392 226.960001,42.776 C227.320001,43.136 227.512001,43.592 227.512001,44.12 C227.512001,44.648 227.320001,45.08 226.960001,45.464 C226.576,45.8 226.144,45.992 225.616,45.992 C225.088001,45.992 224.632001,45.8 224.296001,45.464 C223.912001,45.08 223.744,44.648 223.744,44.12 C223.744,43.592 223.912001,43.136 224.296001,42.776 C224.632001,42.392 225.088001,42.224 225.616,42.224 Z M239.937143,28.712 L247.041143,28.712 C251.169143,28.712 253.257143,30.464 253.257143,33.968 C253.257143,37.496 251.169143,39.272 246.993143,39.272 L242.745143,39.272 L242.745143,45.848 L239.937143,45.848 L239.937143,28.712 Z M242.745143,31.112 L242.745143,36.872 L246.825143,36.872 C248.073143,36.872 248.985143,36.632 249.561143,36.2 C250.137143,35.744 250.425143,35 250.425143,33.968 C250.425143,32.936 250.113143,32.216 249.537143,31.784 C248.961144,31.328 248.049143,31.112 246.825143,31.112 L242.745143,31.112 Z M261.197715,28.712 L264.389715,28.712 L270.941715,45.848 L267.941715,45.848 L266.381715,41.552 L259.205715,41.552 L257.645715,45.848 L254.645715,45.848 L261.197715,28.712 Z M260.045715,39.248 L265.541715,39.248 L262.853715,31.736 L262.757715,31.736 L260.045715,39.248 Z M273.290286,28.712 L276.098286,28.712 L276.098286,45.848 L273.290286,45.848 L273.290286,28.712 Z M280.126858,28.712 L287.758858,28.712 C289.510858,28.712 290.902858,29.096 291.910858,29.888 C292.966858,30.752 293.518858,32 293.518858,33.632 C293.518858,34.52 293.278858,35.312 292.798858,36.008 C292.270858,36.776 291.526858,37.28 290.614858,37.52 L290.614858,37.568 C292.102858,37.904 292.942858,38.888 293.134858,40.568 L293.422858,43.328 C293.518858,44.384 293.878858,45.224 294.454858,45.848 L291.406858,45.848 C290.998858,45.32 290.758858,44.576 290.662858,43.616 L290.446858,41.504 C290.350858,40.568 290.062858,39.896 289.582858,39.488 C289.078858,39.056 288.334858,38.864 287.374858,38.864 L282.934858,38.864 L282.934858,45.848 L280.126858,45.848 L280.126858,28.712 Z M282.934858,31.112 L282.934858,36.464 L287.374858,36.464 C288.478858,36.464 289.318858,36.224 289.894858,35.768 C290.422858,35.288 290.686858,34.616 290.686858,33.752 C290.686858,32.816 290.422858,32.144 289.894858,31.736 C289.366858,31.304 288.526858,31.112 287.374858,31.112 L282.934858,31.112 Z"
              id="text" fill="#AB2B20" class=""></path>
            <bankerPairBet v-bind="bankerPairBetChipsData" />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="less">
@import url('@/assets/styles/baccarat-table-svg');

.baccarat-table-box {
  width: 1366px;
  // width: 100%;
  height: 528px;
  will-change: transform;
  left: 0;

  &:before {
    content: "";
    background-image: url("@/assets/images/bg_table.jpg");
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }

  svg {
    width: 100%;
  }
}
</style>
