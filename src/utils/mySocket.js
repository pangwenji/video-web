import { useWebSocket } from '@vueuse/core'
import tool from './tool';
import { ref } from 'vue'


export default function () {
  const wsUrl = import.meta.env.VITE_APP_WS_URL;
  const token = tool.local.get('token') || ""
  const disconnectedInfo = ref()
  const { status, data, open, close, send } = useWebSocket(`${wsUrl}?token=${token}`, {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.log('ws connect error');
      },
    },
    onConnected(e) {
      console.log('ws已连接', e);
    },
    onDisconnected(e, v) {
      console.log('a接收主动断开', e, v);
      const { code, reason } = v
      // 退出登录，登录token失效，
      close()

      if (code && code === 4000) {
        disconnectedInfo.value = v
        // token 为空 被断开
        console.log(`token 为空 被断开`, { e, v });
      }
      if (code && code === 4001) {
        disconnectedInfo.value = v
        // token被更新。退出当前账号，不再连接
        console.log('token被更新。退出当前账号', reason);
      }
    }
  })

  return {
    status, data, open, close, send, disconnectedInfo
  }
}
