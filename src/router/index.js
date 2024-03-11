import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store'
import NProgress from 'nprogress'
import tool from '@/utils/tool'
import 'nprogress/nprogress.css'
import routes from './webRouter.js'
const title = import.meta.env.VITE_APP_TITLE

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  let toTitle = to.meta.title ? to.meta.title : to.name
  if (to.name === "testPage") {
    next()
    return
  }
  document.title = `${toTitle} - ${title}`
  // const token = tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX)
  const token = to.query.token || tool.local.get("token")
  if (!token) {
    userStore.userStatus = 'off'
    return
  }
  try {
    tool.local.set('token', token)
    const userInfo = await userStore.requestUserInfo()
    if (!userInfo || !userInfo.account) {
      userStore.userStatus = 'off'
      return
    }
    userStore.userStatus = "ok"
  } catch (error) {
    console.log('获取用户信息出错', error);
    userStore.userStatus = 'off'
    return
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

router.onError(error => {
  console.log('router.onError', error)
  NProgress.done();
});


export default router
