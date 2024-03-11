import { defineStore } from 'pinia'
import loginApi from '@/api/login'
import userInfoApi from '@/api/user'
import tool from '@/utils/tool'
import { request } from '@/utils/request.js'
import router from '@/router'
import webRouter from '@/router/webRouter'
import { homePage } from '@/router/homePageRoutes'

const useUserStore = defineStore('user', {

  state: () => ({
    codes: undefined,
    user: undefined,
    userStatus: undefined
  }),

  getters: {
    setUserInfo(state) {
      return { ...state };
    },
  },

  actions: {

    setToken(token) {
      tool.local.set(import.meta.env.VITE_APP_TOKEN_PREFIX, token)
    },

    getToken() {
      return tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX)
    },

    clearToken() {
      tool.local.remove(import.meta.env.VITE_APP_TOKEN_PREFIX)
    },

    setInfo(data) {
      this.$patch(data)
    },

    resetUserInfo() {
      this.$reset();
    },
    requestUserInfo(params) {
      return new Promise((resolve, reject) => {
        userInfoApi.getUserInfo(params).then(response => {
          if (!response || !response.data) {
            this.clearToken()
            reject(false)
          } else {
            if(response.data && response.code === 200) {
              this.setInfo(response.data)
              resolve(response.data)
            }else {
              reject(response.message)
            }
          }
        }).catch(req_err => {
          reject(req_err)
        })
      })
    },
    updateUserInfo(data) {
      return new Promise((resolve, reject) => {
        userInfoApi.updateInfo(data).then(response => {
          if (response && response.data) {
            resolve(response)
          } else {
            reject(false)
          }
        })
      })
    },
    login(form) {
      return new Promise((resolve, reject) => {
        request({
          // url: "http://10.10.2.74:9504/agent/user/login",
          // url: "http://10.140.33.200:9504/agent/user/login",
          url: "agent/user/login",
          method: "post",
          data: form
        }).then(res => {
          if (res.code === 200 && res.data.login_url) {
            const { login_url } = res.data
            const resultToken = login_url.match(/token=([^&]+)/)
            tool.local.set('token', resultToken[1])
            const redirectUrl = `${location.origin}/#/?token=${resultToken[1]}`
            location.replace(redirectUrl)
            resolve(res.data)
            return
          } else if (res.data && res.data.token) {
            tool.local.set('token', res.data.token)
            const redirectUrl = `${location.origin}/#/?token=${res.data.token}`
            location.replace(redirectUrl)
            resolve(res.data)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    async logout() {
      await loginApi.logout()
      this.clearToken()
      this.resetUserInfo()
    },
  }

})

export default useUserStore
