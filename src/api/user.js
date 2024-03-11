import { request } from '@/utils/request.js'

export default {
  /**
   * 更新数据
   * @returns
   */
  getUserInfo() {
    return request({
      url: 'api/user/info',
      method: 'get',
    })
  },

  /**
   * 玩家登出
   * @returns
   */
  toLogout() {
    return request({
      url: 'api/user/logout',
      method: 'post',
    })
  },
  
  /**
   * 获取用户限红列表
   * @returns
   */
  limitRedList() {
    return request({
      url: 'api/user/getUserRedLimitList',
      method: 'get',
    })
  },
 
  /**
   * 修改限红规则
   * @returns
   */
  limitRedEdit(data) {
    return request({
      url: 'api/user/setRedLimitInfo',
      method: 'post',
      data
    })
  },

  /**
   * 用户更新个人资料
   * @returns
   */
  updateInfo(data = {}) {
    return request({
      url: 'api/user/set',
      method: 'post',
      data
    })
  },
}
