import { request } from '@/utils/request.js'

export default {
  /**
   * 桌台列表
   * @returns
   */
  tableList(params) {
    return request({
      url: '/api/game/table/list?class_id=' + params.type,
      method: 'get'
    })
  },

  /**
   * 下注
   * @returns
   */
  onBet(data = {}) {
    return request({
      url: 'api/game/bet',
      method: 'post',
      data
    })
  },

  /**
   * 投注记录
   * @returns
   */
  betHistory(params) {
    return request({
      url: 'api/game/betList',
      method: 'get',
      params
    })
  },
  
  /**
   * 取消投注
   * @returns
   */
  betCancel(data) {
    return request({
      url: 'api/game/cancelBet',
      method: 'post',
      data
    })
  },
  
  
  /**
   * 获取指定桌台的信息
   * @returns
   */
  tableInfo(tableCode) {
    return request({
      url: `api/game/table/info?table_code=${tableCode}`,
      method: 'get',
    })
  },
 
  /**
   * 获取指定桌台的即时信息
   * @returns
   */
  tableNoticeMsgList(tableCode) {
    return request({
      url: `api/game/getHighAmountList?table_code=${tableCode}`,
      method: 'get',
    })
  },
}
