import auth from './auth/index'
import copy from './copy/index'
import eleObserver from './eleObserver/index'


export default {
  install (Vue) {
    Vue.directive('auth', auth)
    Vue.directive('copy', copy)
    Vue.directive('resize', eleObserver)
  }
}
