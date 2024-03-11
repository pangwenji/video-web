import { defineStore } from 'pinia'

const useWsInfoStore = defineStore('wsInfo', {

  state: () => ({
    status: undefined,
    msgList: {
      search_bet: {}, 
      inside_table_info: {},
      join_table: {},
      table_info: {},
      search_table_user: {},
      site_bet: {},
      open_result: {}
    },
    tableLobbyInfos: undefined, // 初始化桌台信息
    send: undefined, // ws send 事件
    close: undefined, // ws close 事件
    open: undefined, // ws open 事件
  }),
  getters: {
    // search_bet
    search_bet(state) {
      return state.msgList.search_bet
    }
  },

  actions: {
    updateMsgList(msg_data) {
      const { data, event, message } = JSON.parse(msg_data)
      if (event === "get_table_lobby") {
        this.tableLobbyInfos = data
      } else {
        this.msgList[event] = data
      }
    },
    clearList() {
      this.msgList = new Array()
    },
    updateWsStatus(status_string) {
      this.status = status_string
    },
    bindEvent(name, event) {
      this[name] = event
    }
  },
})

export default useWsInfoStore
