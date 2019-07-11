import { SHOW_SHARE, UPDATE_SHARE_INFO } from 'store/mutation-types'
import _ from "lodash"
import {app} from '../../lib/until'

const state = {
  title: '',
  desc: '',
  link: '',
  imgUrl: '',
  showFlag: false // 是否显示分享按钮，目前还没有使用
}

const issxypApp = /waterMall/i.test(navigator.userAgent)
const mutations = {
  // 更新分享信息
  [UPDATE_SHARE_INFO] (state, shareInfo) {
    _.merge(state, shareInfo)
  },
  // 显示分享，可以没有分享信息
  [SHOW_SHARE] (state, shareInfo) {
    if (shareInfo) {
      _.merge(state, shareInfo)
    }
    if (issxypApp) {
      // 分享
      app.shareWeb(state)
    }
  }
}

export default {
  state,
  mutations
}
