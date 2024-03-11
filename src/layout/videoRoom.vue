<template>
    <div class="video-room">
        <div class="room-header">
            <roomHeader ref="roomHeaderRef" :headLeft="headLeft" :userList="userList" :ontimeTableInfo="ontimeTableInfo"
                :roomDetail="roomDetail" :tablePlayExplain="tablePlayExplain" />
        </div>
        <div class="baccarat-table">
            <baccaratTable ref="baccaratTableRef" :chipQueta="chipQueta" :tableUserInfoList="tableUserInfoList"
                :tableOtherUserBetChips="tableOtherUserBetChips" :userSeat="userSeat" :forbidenBet="forbidenBet" />
            <betControll ref="betControllRef" :chipQueta="chipQueta" :tableInfo="ontimeTableInfo"
                :tableTimer="tableTimer" />
        </div>
        <div class="route-operate-box">
            <div class="route-map-block">
                <routeMaps ref="routeMapRef" :mapList="tableListInfo.mapList" :mapId="tableListInfo.tableId"
                    class="route-maps-wrap" v-bind:style="scaleRate" />
            </div>
            <div class="history-sum">
                <!-- 历史胜负汇总 -->
                <div class="total-bet-log">
                    <ul>
                        <li class="li-item">
                            <span class="li-name">局</span>
                            <span class="li-num">{{ tableBetLog.total }}</span>
                        </li>
                        <li class="li-item li-banker">
                            <span class="li-name ">庄</span>
                            <span class="li-num">{{ tableBetLog.banker }}</span>
                        </li>
                        <li class="li-item li-player">
                            <span class="li-name">闲</span>
                            <span class="li-num">{{ tableBetLog.player }}</span>
                        </li>
                        <li class="li-item li-tie">
                            <span class="li-name ">和</span>
                            <span class="li-num">{{ tableBetLog.tie }}</span>
                        </li>
                        <li class="li-item li-banker-pair">
                            <span class="li-name ">庄对</span>
                            <span class="li-num">{{ tableBetLog.banker_pair }}</span>
                        </li>
                        <li class="li-item li-player-pair">
                            <span class="li-name ">闲对</span>
                            <span class="li-num">{{ tableBetLog.player_pair }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="recommend-by-route">
                <!-- 根据路图推荐 -->
                <!-- 庄问路-闲问路 -->
                <askForRoad ref="askForRoadRef" v-bind="tableListInfo" :round-id="ontimeTableInfo.number" />
            </div>
            <div class="setting-pannel">
                <!-- 设置面板 -->
                <div class="setting-box-top">
                    <div class="flex-wrap">
                        <!-- <div class="pannel-item pannel-reward">
                            <i class="icon-reward"></i>
                            <span>打赏小费</span>
                        </div>
                        <div class="pannel-item pannel-switch-table">
                            <i class="icon-switch-table"></i>
                            <span>快速换桌</span>
                        </div> -->
                        <div class="pannel-item pannel-back-to-lobby" @click="backToLobby">
                            <i class="icon-back-lobby"></i>
                            <span>返回大厅</span>
                        </div>
                        <div class="pannel-item pannle-bet-log" @click="userBetHistoryDialogRef.open()">
                            <i class="icon-bet-log"></i>
                            <span>投注记录</span>
                        </div>
                    </div>
                </div>
                <div class="setting-box-bottom">
                    <ul>
                        <!-- <li> <i class="setting-box-bottom-icon icon-network-status"></i> <span>网络状态</span> </li>
                        <li> <i class="setting-box-bottom-icon icon-voice"></i> <span>声音设置</span> </li> -->
                        <li class="system-setting">
                            <i class="setting-box-bottom-icon icon-system"></i>
                            <el-dropdown @handleOpen="openSetting" trigger="click" @command="settingMenuClick"
                                placement="bottom-end">
                                <span>系统设置</span>
                                <template #dropdown>
                                    <div class="setting-wrap">
                                        <div class="set-account">
                                            <div class="set-title">{{ $tc("home.account", 2) }}</div>
                                            <div class="item-li" @click="userInfoSetDialogRef.open()">{{
                $t("home.setNickname") }}</div>
                                        </div>
                                        <div class="set-game">
                                            <div class="set-title">{{ $tc("home.game", 2) }}</div>
                                            <div class="item-li" command="set-coin-style"
                                                @click="setChipStyleRef.open()">{{
                $t("home.chipStyle") }}</div>
                                            <div class="item-li" command="set-bet-interface" style="display: none;"
                                                @click="setTableStyleRef.open()">{{ $t("home.betTableStyle") }}</div>
                                            <div class="item-li" command="set-livemode" style="display: none;">{{
                $t("home.liveModel") }}</div>
                                            <div class="item-li" command="set-handicap" @click="setHandicapRef.open()">
                                                {{ $t("home.setHandicap") }}</div>
                                        </div>
                                        <div class="set-system-notice">
                                            <div class="set-title">{{ $t("home.system") }}</div>
                                            <div class="item-li" command="set-notice-style"
                                                @click="setRouteRecommantRef.open()">{{
                $t("home.setNotice") }}</div>
                                            <div class="item-li" command="set-language" @click="setLanguageRef.open()">
                                                {{ $t("home.setLanguage")
                                                }}</div>
                                            <div class="item-li" command="set-problems" @click="faqRef.open()">{{
                $t("home.usualProblem") }}</div>
                                        </div>
                                    </div>
                                </template>
                            </el-dropdown>
                        </li>
                        <li @click="toLogout"> <i class="setting-box-bottom-icon icon-logout"></i><span>安全退出</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="instant-msg">
                <div class="msg-box-title"> 即时信息 </div>
                <div class="msg-list">
                    <ul>
                        <li v-for="msgLi in wsMsgList">
                            <div class="msg-info">
                                <span class="msg-type">{{ msgLi.type || "系统" }}</span>
                                <span class="msg-timestamp">{{ msgLi.created_at }}</span>
                            </div>
                            <div class="msg-content">
                                {{ msgLi.text || `欢迎光临 马尼拉晨丽度假城 [${roomDetail.code}] 桌` }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Transition>
            <lotteryDraw :table-rank-info="tableRankInfo" ref="lotteryDrawRef" v-if="showLotteryDraw" />
        </Transition>
        <userBetHistoryDialog ref="userBetHistoryDialogRef" />
        <userInfoSetDialog ref="userInfoSetDialogRef" />
        <setLanguage ref="setLanguageRef" />
        <setRouteRecommant ref="setRouteRecommantRef" />
        <setHandicap ref="setHandicapRef" />
        <setChipStyle ref="setChipStyleRef" @success="betControllRef.updateChipType()" />
        <setTableStyle ref="setTableStyleRef" />
        <FAQ ref="faqRef" />
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, onBeforeMount, nextTick, computed, watch, onUnmounted, provide, watchEffect } from 'vue';
import routeMaps from '@/components/routeMaps/index.vue'
// import routeMaps from '@/components/routeMaps/map2.vue'
import { useRouter } from "vue-router"
import tool from '@/utils/tool';
import { useWsInfoStore, useUserStore } from '@/store'
import { ElMessage } from 'element-plus';
import lotteryDraw from '@/components/lotteryDraw.vue';
import baccaratTable from '@/components/baccaratTable.vue'
import roomHeader from '@/components/videoRoom/roomHeader.vue'
import betControll from '@/components/videoRoom/betControll.vue';
import userBetHistoryDialog from '@/components/setting/userBetHistoryDialog.vue';
import setLanguage from '@/components/setting/setLanguage.vue';
import userInfoSetDialog from '@/components/setting/userInfoSetDialog.vue'
import setRouteRecommant from '@/components/setting/setRouteRecommant.vue';
import setHandicap from '@/components/setting/setHandicap.vue';
import setChipStyle from '@/components/setting/setChipStyle.vue';
import setTableStyle from '@/components/setting/setTableStyle.vue';
import FAQ from '@/components/setting/FAQ.vue'
import askForRoad from '@/components/routeMaps/askForRoad.vue';
// import askForRoad from '@/components/routeMaps/askForRoad2.vue';

import user from '@/api/user';
import game from '@/api/game';

const router = useRouter()
const wsInfoStore = useWsInfoStore()
const userStore = useUserStore()

const roomHeaderRef = ref()
const askForRoadRef = ref()
const userInfoSetDialogRef = ref()
const setLanguageRef = ref()
const setRouteRecommantRef = ref()
const setHandicapRef = ref()
const setChipStyleRef = ref()
const setTableStyleRef = ref()
const faqRef = ref()

const roomDetail = ref()
// 开奖对局数据信息
const lotteryDrawRef = ref()
const userBetHistoryDialogRef = ref()

const tableRankInfo = ref()
const showLotteryDraw = ref(false)
// webscoket 消息列表
const wsMsgList = ref([])
// 桌台房间内的用户列表
const userList = ref([])
// 桌台下注倒计时
const tableTimer = ref(0)

const chipQueta = tool.local.get('localChipQueta') ? ref(tool.local.get('localChipQueta')) : ref(5)

// 当前桌台用户信息
const tableUserInfoList = ref({})

// 桌台id
const roomId = ref("")

// 桌台历史对局 局数和谁赢 
const tableBetLog = ref({
    banker: 0,
    banker_pair: 0,
    info: [],
    player: 0,
    player_pair: 0,
    tie: 0,
})

// 实时桌台房间的信息
const ontimeTableInfo = ref({})
// 桌台 玩法信息
const tablePlayExplain = ref([])
// headLeft
const headLeft = ref({})

// 禁止下注
const forbidenBet = ref(false)

// 用户标识
const userSpecialMark = ref(2) // 1 为特殊账号 不用提示 退出房间

// 桌台房间内的座位分配
const seatDefault = ref([5, 6, 3, 7, 2, 8])

const seatList = {
    seat2: null,
    seat3: null,
    seat5: null,
    seat6: null,
    seat7: null,
    seat8: null,
    seatPang: null
}
const tableSeatUsersList = ref({})

const userStayTime = ref(0) // 5分钟 当前用户在桌台房间停留时间

watch(userStayTime, val => {
    if (val >= 5 * 60) {
        ElMessage.warning("已经超过5分钟没有下注了，返回大厅")
        // 主动退出房间
        router.replace({
            name: 'main',
            query: {
                token: router.currentRoute.value.query.token
            }
        })
        return
    }
    if (val === 2 * 60) {
        ElMessage.warning("您已2分钟没有下注，超时将返回大厅")
    }
})

// 桌台 svg 
const baccaratTableRef = ref()

const betControllRef = ref()

onBeforeMount(async () => {
    const urlToken = router.currentRoute.value.query.token
    if (!urlToken) {
        ElMessage.error({
            message: "身份凭证错误或不存在"
        })
        return
    }
    if (router.currentRoute.value.query && router.currentRoute.value.query.roomId) {
        const localRoomDetail = roomDetail.value || tool.local.get('roomDetail')
        roomId.value = router.currentRoute.value.query.roomId
        if (!localRoomDetail || !roomId.value) {
            router.replace({
                name: 'main',
                query: {
                    token: urlToken
                }
            })
            return
        }
    } else {
        router.replace({
            name: 'main',
            query: {
                token: tool.local.get('token')
            }
        })
        return
    }
    // 接口获取当前桌台的信息
    const tableCode = router.currentRoute.value.query.roomId
    const lastTableInfo = await updateTableInfo(tableCode)
    if(lastTableInfo) {
        roomDetail.value = lastTableInfo
        // 使用 接口的 record 数据
        updateMapList(lastTableInfo.records)
    } else {
        ElMessage.error('获取最新桌台信息出错')
    }

    // 当前桌台的即时信息列表
    await game.tableNoticeMsgList(tableCode).then(res => {
        if (res.code === 200) {
            convertPlayerNoticeList(res.data)
        }
    }).catch(err => {
        console.log('获取即时信息列表出错', err);
    })
    // wsMsgList.value = wsInfoStore.msgList
    wsInfoStore.send(JSON.stringify({
        event: "get_table_lobby",
        data: {
            code: roomDetail.value.code,
        }
    }))
})

onMounted(() => {
    window.addEventListener('resize', () => {
        roomResize()
    })
    nextTick(() => {
        roomResize()
    })
    userSpecialMark.value = userStore.$state.is_special || 2
    resetStayTime()
})

function openSetting(e) {
    console.log('打开设置', e);
}

function settingMenuClick() {

}

const timeCounter = ref(0)
function timeCounting() {
    timeCounter.value = setInterval(() => {
        userStayTime.value += 10
    }, 1000 * 10);
}

function resetStayTime() {
    if (userSpecialMark.value && userSpecialMark.value === 1) {
        if (timeCounter.value) clearInterval(timeCounter.value)
        return
    }
    clearInterval(timeCounter.value)
    timeCounter.value = 0
    userStayTime.value = 0
    timeCounting()
}

// 处理用户的即时消息列表
function convertPlayerNoticeList(list) {
    const arr = []
    if (list && list.length) {
        for (let i in list) {
            const { amount, created_at, game_play, table_code, username, } = list[i]
            let text = ''
            try {
                text = `玩家:${username} 在桌台${table_code}赢得 ${amount}`
            } catch (error) {
                text = ''
            }
            arr.push({
                ...list[i],
                text
            })
        }
    }
    wsMsgList.value = arr
}

// 开奖弹出动画
function toLotteryDraw(info) {
    tableRankInfo.value = info
    showLotteryDraw.value = true
    // 播放器框 缩放
    controllLivePlayer('scale', 'big')
    setTimeout(() => {
        showLotteryDraw.value = false
        controllLivePlayer('scale', 'small')
    }, 5000);
}

// 播放器操控
function controllLivePlayer(action, data) {
    if (roomHeaderRef.value && roomHeaderRef.value.$refs && roomHeaderRef.value.$refs.tableLivePlayerRef) {
        if (action === 'scale') {
            roomHeaderRef.value.$refs.tableLivePlayerRef.playerScale(data)
        }
        if (action === "destory") {
            roomHeaderRef.value.$refs.tableLivePlayerRef.destoryPlayer()
        }
    }
}

onUnmounted(() => {
    resetRoom()
})

const routeMapRef = ref()
// 房间信息
const tableListInfo = ref({
    mapList: [],
    tableId: ""
})

watch(() => tableListInfo.value.mapList, val => {
    if (val && val.length) {
        // 主动触发问路结果
        askForRoadRef.value.init(val)
    }
})

// 保存当前桌台的局号
const tableRankNum = ref("-")
const userSeat = ref(0)

// ws-event get_table_lobby 
// userInfo 当前桌台的用户列表
// history 当前桌台的历史开奖记录
// winner 底部历史胜局和总局数
// 当前用户的下注信息
const userBetInfos = ref({})

// 路图缩放
const scaleRateX = ref(600 / 864)
const scaleRateY = ref(240 / 324)
const scaleRate = computed(() => {
    return {
        transform: `scale(${scaleRateX.value}, ${scaleRateY.value})`,
    }
})

const countNoBet = ref(0)
const userIsBet = ref(false)
// countNoBet 未投注的数量
watch(countNoBet, val => {
    if (val >= 4) {
        router.replace({
            name: 'main',
            query: {
                token: router.currentRoute.value.query.token
            }
        })
    }
})

// ws 重连
watch(() => wsInfoStore.status, val => {
    if (val === 'OPEN') {
        if (userStore.$state.user_nick && roomDetail.value && userSeat.value) {
            wsInfoStore.send(JSON.stringify({
                event: "join_table",
                data: {
                    table_code: roomDetail.value.code,
                    nick_name: userStore.$state.user_nick,
                    seat: userSeat.value, // 计算 座位 
                }
            }))
        }
    }
})

// ws 搜索下注信息
watch(() => wsInfoStore.msgList.search_bet, (newVal, oldVal) => {
    console.log('ws-search_bet', newVal);
})

// ws 实时桌台数据 2s一次
watch(() => wsInfoStore.msgList.inside_table_info, (newVal, oldVal) => {

    const { number, table_id, betMoney, count_people, table_total, total_money, total_people, user_list, winner } = newVal
    if (table_id === roomId.value) {
        // number 当前局号
        // table_id 桌台id
        // 右上角 
        // betMoney  下注总金额
        // count_people 下注总人数
        // winner 当前下注信息
        ontimeTableInfo.value = newVal
        // 底部-历史胜局统计 table_total
        tableBetLog.value = table_total
        // 左上角
        //  total_money 桌台玩家总金额
        //  total_people 总人数
        //  user_list 桌台玩家列表
        userList.value = user_list
        headLeft.value = {
            table_code: table_id,
            number: number || "-",
            total_people,
            total_money,
        }
    }
})

// ws 
watch(() => wsInfoStore.msgList.join_table, (newVal, oldVal) => {
    const { nick_name, seat, table_code } = newVal
    console.log(`用户: ${nick_name} 进入了桌台 ${table_code},座位 ${seat}`);
});

// 新增 table_error 桌台状态 异常
watch(() => wsInfoStore.msgList.table_error, val => {
    console.log('event-桌台状态异常', val);
})

// 接收 中大奖 消息
watch(() => wsInfoStore.msgList.open_bonus, val => {
    console.log('open_bonus 接收中大奖消息', val);
    // wsMsgList
})

// 桌台开盘 从接口更新最新桌台状态信息
watch(() => wsInfoStore.msgList.open_table_notify, async val => {
    const { notify_table_status, notify_table_open, table_id } = val
    if (table_id === headLeft.value.table_id && notify_table_open) {
        const lastTableInfo = await updateTableInfo(table_id)
        if(lastTableInfo) {
            roomDetail.value = lastTableInfo
            // 使用 接口的 record 数据 更新路图
            updateMapList(lastTableInfo.records)
        }
    }
})

const tableOtherUserBetChips = ref()
// ws-面向所有玩家推送的下注信息
watch(() => wsInfoStore.msgList.site_bet, (newVal, oldVal) => {
    // 桌台下注信息 bet
    const { bet } = newVal
    tableOtherUserBetChips.value = bet
})

const lotteryDrawTimer = ref(0)
const SEIReceivedMark = ref(false)

// 等待SEI 进行开奖动画 未获取或超时使用ws的open_result
const waitSEIToDraw = data => {
    setTimeout(() => {
        lotteryDrawTimer.value = lotteryDrawTimer.value + 1
        if (SEIReceivedMark) {
            // 开始等待SEI-等到了SEI-将Mark置为false-并打开动画
            SEIReceivedMark.value = false
            return toLotteryDraw(data)
        }
        // 开始等待SEI查看lotteryDrawTimer
        if (lotteryDrawTimer.value >= 6) {
            lotteryDrawTimer.value = 0
            // 计数超过6-将计数置为0-并打开动画
            return toLotteryDraw(data)
        }
        // 没有SEI和计时结束-继续
        waitSEIToDraw(data)
    }, 500);
}

// ws-开奖结果（与SEI相对应）
watch(() => wsInfoStore.msgList.open_result, (newVal, oldVal) => {
    const { history, new_number, table_id, total, banker, player } = newVal
    if (table_id === roomId.value) {
        tableBetLog.value = total
        // 开奖时 即时更新最新的局号
        ontimeTableInfo.value = {
            ...ontimeTableInfo,
            number: new_number
        }
        updateMapList(history)
        clearTableChips()
        waitSEIToDraw({
            tableId: table_id,
            bankerCard: banker,
            playerCard: player
        })
        // 计数 当前用户没有投注
        if (!userIsBet.value) {
            countNoBet.value += 1
        }
        userIsBet.value = false

        // 获得到开奖事件后 发送事件获取当前用户的盈亏
        checkUserIsWin()
    }
})

const isSEITimeLock = ref(false)
// ws 开奖倒计时 存在SEI的倒计时 时使用SEI的
watch(() => wsInfoStore.msgList.open_timer, (newVal) => {
    if (!isSEITimeLock.value) {
        // sei没有收到倒计时，使用ws的倒计时
        tableTimer.value = Number(newVal.time)
        isSEITimeLock.value = false
    }
})

// 牌组换靴 => 洗牌中
// 换靴时：清空路图，停止下注，
watch(() => wsInfoStore.msgList.event_change_round, async (newVal, oldVal) => {
    const { change_round, round_id, table_code, handler_change_shoe } = newVal

    if (change_round && table_code === ontimeTableInfo.value.table_id) {
        // 是否手动换靴
        if(handler_change_shoe) {
            const lastTableInfo = await updateTableInfo(table_code)
            if(lastTableInfo) {
                roomDetail.value = lastTableInfo
                tableListInfo.value = {
                    ...tableListInfo.value,
                    mapList: lastTableInfo.records
                }
            }
        } else {
            tableListInfo.value = {
                ...tableListInfo.value,
                mapList: [],
            }
            wsInfoStore.send(JSON.stringify({
                event: "get_table_lobby",
                data: {
                    code: roomDetail.value.code,
                }
            }))
            askForRoadRef.value.clear()
            // routeMapRef.value.drawRouteBg()
        }
    }
})


watch(() => wsInfoStore.tableLobbyInfos, async (newVal, oldVal) => {
    // 页面初始化所有信息 init
    if (!newVal || !newVal.table) {
        return
    }
    const { table, winner, userInfo, bet_total, play_explain, bet, history, open_timer, have_seat } = newVal
    // 数据获取完全后显示
    // 底部-桌台-历史胜负信息
    tableBetLog.value = winner
    // userInfo 桌台用户信息-列表 : { userList, money }
    userList.value = userInfo.userList
    // history 桌台历史记录 开奖记录-路图 
    // tableListInfo.value = {
    //     mapList: history,
    //     tableId: table.table_code
    // }
    // bet 当前桌台下注信息-筹码位置-座位
    // bet_total 顶部右上角 下注信息
    ontimeTableInfo.value = {
        ...bet_total,
        number: table.round_id,
        table_code: table.table_code,
        winner: bet_total.list,
    }
    headLeft.value = {
        table_code: table.round_id,
        number: table.round_id,
        total_people: userInfo.userList.length,
        total_money: userInfo.money
    }
    // play_explain 当前桌台玩法信息
    tablePlayExplain.value = tablePlayExplainEdit(play_explain)
    // table 当前桌台局号和桌台code

    roomDetail.value = {
        ...roomDetail.value,
        code: table.table_code,
        round_id: table.round_id
    }

    // 获取当前局 的下注倒计时 open_timer
    // if(Number(open_timer)>=0) {
    //     tableTimer.value = Number(open_timer)
    // }

    // 分配座位 have_seat 1=> 可以分配
    // have_seat === 0时的2种情况：a. 其他桌有座位，b. 这个桌已有座位  直接分配旁座

    // 优先根据 userList 中的用户列表处理用户信息
    tableUserInfoProcess(userInfo.userList, have_seat)
    // 当前桌台下注信息（不处理座位信息
    if (bet && Object.keys(bet).length === 2) await tableBetInfoProcess(bet)
    // 处理完 下注信息之后 发送 join_table
    wsInfoStore.send(JSON.stringify({
        event: "join_table",
        data: {
            table_code: roomDetail.value.code,
            nick_name: userStore.$state.user_nick,
            seat: userSeat.value, // 计算 座位 
        }
    }))
    ElMessage.success({
        message: `当前座位: ${userSeat.value}`
    })
})

// 当前桌台的用户列表处理 （处理座位 和 分配座位
function tableUserInfoProcess(userList, have_seat) {
    if (Array.isArray(userList) && userList.length) {
        let hadOneSeat = false
        for (let i in userList) {
            const { money, user_nick, seat } = userList[i]
            const isOwner = user_nick === userStore.$state.user_nick
            if (isOwner) {
                userSeat.value = userSeatSet(seat)
                hadOneSeat = true
                tableUserInfoList.value = {
                    ...tableUserInfoList.value,
                    [userSeat.value]: {
                        user_nick: user_nick,
                        money,
                        isOwner: isOwner,
                        chips: {}
                    }
                }
            } else {
                tableUserInfoList.value = {
                    ...tableUserInfoList.value,
                    [userSeatSet(seat)]: {
                        user_nick: user_nick,
                        money,
                        isOwner: isOwner,
                        chips: {}
                    }
                }
            }

        }
        if (!hadOneSeat) {
            if (have_seat === 0) {
                // 不需要分配数字座位
                userSeat.value = userSeatSet(1)
            } else {
                userSeat.value = userSeatSet()
            }
            if (userStore.$state.user_nick) {
                tableUserInfoList.value = {
                    ...tableUserInfoList.value,
                    [userSeatSet(userSeat.value)]: {
                        user_nick: userStore.$state.user_nick,
                        money: userStore.$state.money,
                        isOwner: true,
                        chips: {}
                    }
                }
            }
        }
        // console.log("不是第一个进入桌台的用户", tableUserInfoList.value)
    } else {
        // 当前用户为进入桌台的第一个用户
        if (have_seat === 0) {
            // 不需要分配数字座位
            userSeat.value = userSeatSet(1)
        } else {
            userSeat.value = userSeatSet()
        }
        if (userStore.$state.user_nick) {
            tableUserInfoList.value = {
                ...tableUserInfoList.value,
                [userSeat.value]: {
                    user_nick: userStore.$state.user_nick,
                    isOwner: true,
                    chips: {}
                }
            }
        }
    }
}

// 处理桌台下注信息，不分配用户座位
function tableBetInfoProcess(bet) {
    // 处理下注信息之前 所有用户包括当前用户都已经获得一个 座位，
    return new Promise((resolve, reject) => {
        try {
            const { normal, sideBet } = bet // normal => 非旁座玩家的下注信息， sideBet => 旁座的下注总金额
            if (normal && normal.length) {
                for (let i in normal) {
                    const user_bet_data = normal[i]
                    const play_style_keys = Object.keys(user_bet_data)
                    const user_chips = {}
                    let u_data = {
                        u_seat: 1,
                        unique: "",
                        user_nick: "",
                        isOwner: false
                    }
                    // 下注数据结构 需要修改
                    for (let k in play_style_keys) {
                        const { user_nick, seat, unique } = user_bet_data[play_style_keys[k]]
                        // 普通位置的下注数据 
                        const seat_num = Object.keys(seat)[0]
                        const chip = seat[seat_num]
                        user_chips[play_style_keys[k]] = chip
                        u_data.u_seat = seat_num
                        u_data.unique = unique
                        u_data.isOwner = user_nick === userStore.$state.user_nick
                        u_data.user_nick = user_nick
                    }
                    // 判断是否需要另外分配座位
                    const isUserInList = tableUserInfoList.value[u_data.u_seat] && Object.keys(tableUserInfoList.value[u_data.u_seat]).length !== 0
                    if (isUserInList) {
                        tableUserInfoList.value = {
                            ...tableUserInfoList.value,
                            [u_data.u_seat]: {
                                user_nick: u_data.user_nick,
                                chips: user_chips,
                                unique: u_data.unique
                            }
                        }
                    } else {
                        tableUserInfoList.value = {
                            ...tableUserInfoList.value,
                            [userSeatSet(u_data.u_seat)]: {
                                user_nick: u_data.user_nick,
                                chips: user_chips,
                                unique: u_data.unique
                            }
                        }
                    }
                }
            }
            tableUserInfoList.value = {
                ...tableUserInfoList.value,
                sideBet: sideBet || {}
            }
            // 下注信息处理完成
            resolve(tableUserInfoList.value)
        } catch (error) {
            reject(error)
        }
    })
}

// 分配 和 设置用户座位
function userSeatSet(seat) {
    // 当数组为空时，返回1
    if (seatDefault.value.length === 0) {
        return 1;
    }
    // 当传入的参数为1时，直接返回1
    if (seat === 1) {
        return 1;
    }
    // 查找值在数组中的索引
    const index = seatDefault.value.indexOf(seat);
    if (index !== -1) {
        seatDefault.value.splice(index, 1);
        return seat
    }
    const default_seat = seatDefault.value.shift();
    return default_seat
}

// 接口更新 当前桌台信息
function updateTableInfo(table_code) {
    return new Promise((resolve, reject)=> {
        game.tableInfo(table_code).then(res=> {
            if(res.code === 200) {
                resolve(res.data)
            } else {
                resolve(false)
            }
        }).catch(err=> {
            reject(err)
        })
    })
}

// 检查用户盈亏
function checkUserIsWin() {
    const { code, round_id } = roomDetail.value
    if (!code || !round_id) {
        return
    }
    wsInfoStore.send(JSON.stringify({
        event: "search_win",
        data: {
            table_code: roomDetail.value.code,
            number: roomDetail.value.round_id
        }
    }))
}

// 对局结果列表
const tableHistory = ref({})
const countdown_time_cache = ref({})
function SEIDataCatch(data) {
    const { b, n, p, count, i, t } = data
    if (b && p) {
        // b => banker对应的牌面信息 p => player对应的牌面信息 n => 下一局的局号
        if (!tableHistory.value[n]) {
            tableHistory.value[n] = {
                ...data,
                player: data.p,
                banker: data.b,
                bureau_number: data.n
            }
            SEIReceivedMark.value = true
            // 接收到SEI信息开奖之后的处理
            // 处理用户的输赢
            // 清空桌台筹码
            clearTableChips()
            // 确定桌台的状态
            return
        }
    }
    if (count && i) {
        // i => table_id
        // t => timer
        if (!countdown_time_cache.value[t]) {
            countdown_time_cache.value[t] = true
            // console.log('当前倒计时使用sei的', t);
            isSEITimeLock.value = true
            tableTimer.value = Number(t)
        }
        if (t === 0) {
            countdown_time_cache.value = {}
            isSEITimeLock.value = false
        }
    }
}

function updateChipQueta(chipData) {
    chipQueta.value = chipData
    tool.local.set('localChipQueta', chipData)
}
// 下注信息更新
function updateUserBetInfos(info) {
    // userBetInfos.value = info
    const { seat, chips, content } = info;
    toBet(seat, {
        [content]: {
            [chips]: 1
        }
    }, chips, info)
}

function toBet(seat, chipData, chips, info) {
    const { number, table_id } = ontimeTableInfo.value
    if (!number || !table_id) {
        ElMessage.error({
            message: '当前桌台无法下注'
        })
        return
    }
    // let contentKeys = Object.keys(chips)
    // if (contentKeys.length === 0) {
    //     return
    // }
    // console.log('下注信息-contentKeys', contentKeys)
    // const chipsObj = {}
    // for (let i in contentKeys) {
    //     chipsObj[contentKeys[i]] = chips[contentKeys[i]].chips
    // }
    // console.log('下注信息-chipsObj', chipsObj);
    game.onBet({
        round_id: number,
        table_code: table_id,
        seat: seat,
        chips: chipData,
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success({
                message: "下注成功"
            })
            betControllRef.value.updateUserInfo({ chipData, chips })
            userBetInfos.value = {}
            userIsBet.value = true
            countNoBet.value = 0
            // 重新计算时间
            resetStayTime()
            // 下注成功 放置筹码
            baccaratTableRef.value.setChipsPosition(info.seat, info.content, info.chips)
        } else {
            ElMessage.error({
                message: res.message || "下注出错"
            })
        }
    })
}

// 处理 新增路图
function processMapList(list1, list2) {
    let uniqueRoundIds = new Set();
    let unionArray = [];
    const processArray = (arr) => arr.forEach(item => {
        if (!uniqueRoundIds.has(item.round_id)) {
            uniqueRoundIds.add(item.round_id);
            unionArray.push(item);
        }
    })
    processArray(list1)
    processArray(list2)
    return unionArray
}

// 开奖之后 根据 open_result 中的数据更新路图
function updateMapList(open_result_history) {
    tableListInfo.value = {
        ...tableListInfo.value,
        mapList: processMapList(tableListInfo.value.mapList, open_result_history)
    }
}

// 返回大厅
function backToLobby() {
    if (!tool.local.get("token") || !router.currentRoute.value.query.token) {
        ElMessage.error({
            message: "身份凭证失效"
        })
        return
    }
    router.push({
        name: "main",
        query: {
            token: tool.local.get("token")
        }
    })
}

// 退出登录
async function toLogout() {
    await user.toLogout()
    userStore.$reset()
    tool.local.remove('token')
    resetRoom()
    location.reload()
}

// 重置房间
function resetRoom() {
    // 销毁播放器
    if (roomHeaderRef.value && roomHeaderRef.value.$refs && roomHeaderRef.value.$refs.tableLivePlayerRef) {
        roomHeaderRef.value.$refs.tableLivePlayerRef.destoryPlayer()
    }
    wsInfoStore.send(JSON.stringify({
        event: "leave_table",
        data: {
            table_code: roomDetail.value.code
        }
    }))
    clearInterval(timeCounter.value)
    userStayTime.value = 0
}

// 桌台玩法信息 数据处理
function tablePlayExplainEdit(play_explain) {
    const play_key_list = Object.keys(play_explain)
    if (play_key_list.length === 0) {
        return []
    }
    const arr = []
    for (let i in play_key_list) {
        const { name, ratio, play } = play_explain[play_key_list[i]]
        arr.push({
            play_code: i,
            play_desc: name,
            play_ratio: ratio,
            play
        })
    }
    return arr
}

function roomResize() {
    const wholeRoomEle = document.getElementsByClassName("video-room")[0]
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let originalWidth = 1366;
    let originalHeight = wholeRoomEle.offsetHeight;
    let scaleRatio;
    if (windowWidth > 1366) {
        scaleRatio = windowWidth / originalWidth;
        if ((originalHeight * scaleRatio) > windowHeight) {
            scaleRatio = windowHeight / originalHeight;
        }
        wholeRoomEle.style.transform = `scale(${scaleRatio}) translateX(-50%)`;
    } else {
        scaleRatio = Math.min(windowHeight / originalWidth, windowWidth / originalHeight);
        wholeRoomEle.style.transform = `rotate(90deg) scale(${scaleRatio}) translate(-50%, -50%)`;
        wholeRoomEle.style.transformOrigin = 'top left';
        wholeRoomEle.style.position = 'absolute';
    }
}

function clearTableChips() {
    baccaratTableRef.value && baccaratTableRef.value.clearTableChips()
}

// 清除座位userSeat的筹码
function clearUserChips() {
    baccaratTableRef.value && baccaratTableRef.value.clearUserChips(userSeat.value)
}

function switchforbidenBet(bool) {
    forbidenBet.value = bool
}

provide('SEIDataReport', SEIDataCatch)
provide('setChipQueta', updateChipQueta)
provide('emitToBet', toBet)
provide('emitClearChips', clearTableChips)
provide('emitClearUserChips', clearUserChips)
provide('userBetInfos', updateUserBetInfos)
provide('switchforbidenBet', switchforbidenBet)

</script>

<style scoped lang="less">
@import url('@/assets/styles/video-room');
@media (max-width: 1366px) {
    .video-room {
        transform-origin: left top;
        position: absolute;
        top: 50%;
        left: 50%;
    }
}
</style>
