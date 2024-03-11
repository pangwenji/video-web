<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, onBeforeMount, toRefs, ref, watch, provide, watchEffect } from 'vue';
import { useUserStore, useWsInfoStore } from '@/store'
import forceLogoutDialog from './components/setting/forceLogoutDialog.vue';
import loginDialog from './components/setting/loginDialog.vue';
import tool from './utils/tool';
import mySocket from '@/utils/mySocket'
import { ElMessageBox } from 'element-plus';
const userStore = useUserStore()
const router = useRouter()
const wsInfoStore = useWsInfoStore()

const forceLogoutDialogRef = ref()
const loginDialogRef = ref()

watch(userStore.$state, () => {
  if (userStore.userStatus === 'off') {
    // forceLogoutDialogRef.value.open()
    loginDialogRef.value.open(true)
  }
  if (userStore.userStatus === "ok") {
    loginDialogRef.value.open(false)
    setTimeout(() => {
      init()
    });
  }
})

// ws 重连次数
const wsConnectCount = ref(0)
const wsHeaerBeatTimer = ref(0)

onBeforeMount(() => {
  userStore.userStatus = 'processing'
})

function init() {
  // 连接ws
  const { status, data, open, close, send, disconnectedInfo } = mySocket()
  watch(disconnectedInfo, val => {
    wsConnectCount.value = 7
    ElMessageBox.alert(val.reason, '', {
      confirmButtonText: '确定',
      showCancelButton: false,
      showConfirmButton: false,
      showClose: false,
    })
  })
  watch(status, val => {
    wsInfoStore.updateWsStatus(val)
    const pathName = router.currentRoute.value.name
    const roomId = router.currentRoute.value.query.roomId
    if (val === "OPEN") {
      wsConnectCount.value = 0
      if (pathName === "room") {
        // send(JSON.stringify({
        //   event: "join_table",
        //   data: {
        //     table_code: roomId
        //   }
        // }))
      } else {
        // send(JSON.stringify({
        //   event: "get_lobby",
        //   data: {}
        // }))
      }
      wsHeaerBeatTimer.value = setInterval(() => {
        send(JSON.stringify({
          event: "ping"
        }))
      }, 1000 * 30);
    }
    if (val === "CLOSED") {
      wsConnectCount.value = wsConnectCount.value + 1
      setTimeout(() => {
        if (val === "CLOSED" && wsConnectCount.value >= 6) {
          ElMessageBox.alert(
            '连线中央服务器失败，请稍后再试',
            {
              dangerouslyUseHTMLString: true,
              showClose: false,
              showCancelButton: false,
              showConfirmButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              closeOnHashChange: false,
              customStyle: {
                backgroundColor: "rgba(0, 0, 0, .6)",
                border: `1px solid hsla(0,0%,59%, .6)`,
                padding: `8px 24px`,
                lineHeight: 1.4,
                fontSize: "17px",
                borderRadius: "4px",
                textAlign: "center",
                color: "#fff",
                boxShadow: `0 4px 16px 2px rgba(0, 0, 0, .74)`
              }
            }
          )
          return
        }
        if (status.value === "CLOSED") reconnect()
      }, 1000);
    }
  })
  function reconnect() {
    close()
    open()
  }
  watch(data, val => {
    wsInfoStore.updateMsgList(val)
  })
  wsInfoStore.bindEvent('open', open)
  wsInfoStore.bindEvent('send', send)
  wsInfoStore.bindEvent('close', close)
}
// 桌台内的各项状态
// const roomStatus = ref({
//   videoPlayer: false,
//   wsLink: false,
//   tableInfos: false,
//   routeMaps: false
// })

// function updateRoomStatus(item, bool) {
//   roomStatus.value[item] = bool
// }

// function roomIsReady() {
//   let itemKeys = Object.keys(roomStatus.value)
//   let isReady = true
//   for (let i in itemKeys) {
//     if (roomStatus.value[itemKeys[i]] === false) {
//       isReady = false
//     }
//   }
//   if (isReady) {
//     // 房间就绪
//   } else {
//     // 继续等待
//   }
// }

function checkLocalUserSetting() {
  const userSetting = tool.local.get("userSetting")
  if (!userSetting) {
    tool.local.set("userSetting", {
      tableType: 1,
      chipStyle: 1,
      language: "zh-cn",
      music: false,
    })
  }
}

onMounted(() => {
  checkLocalUserSetting()
})
onUnmounted(() => {
  clearInterval(wsHeaerBeatTimer.value)
  wsHeaerBeatTimer.value = 0
})
</script>

<template>
  <RouterView />
  <forceLogoutDialog ref="forceLogoutDialogRef" />
  <loginDialog ref="loginDialogRef" />
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  /* display: flex; */
  /* min-width: 1230px; */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
