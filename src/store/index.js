import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useConfigStore from './modules/config'
import useWsInfoStore from './modules/wsInfo'

const pinia = createPinia()

export {
  useUserStore,
  useConfigStore,
  useWsInfoStore,
}
export default pinia
