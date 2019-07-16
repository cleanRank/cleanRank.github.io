import Vue from 'vue'
import App from '@/App'
import VueRouter from 'vue-router'
import routes, { beforeEach, afterEach } from './router/' // 引入路由表
import '@babel/polyfill' // 部分es6语法兼容
import store from './store/index' // vuex 单向数据里 core
import 'lib/lrz.all.bundle'
import 'nprogress/nprogress.css'
import loadPlugin from 'lib/loadPlugin' // loding
import { sync } from 'vuex-router-sync'
import { formatTimeAmt } from 'lib/until'
import * as filter from 'lib/filter' // 全局过滤器
import http from 'config/index'
import './plugins/element.js'
import '@/assets/scss/base.scss'
let config = require('./lib/im/webim.config.js')

require('./lib/im/strophe.js')
require('./lib/im/utils.js')
import websdk from "easemob-websdk"
//
import webrtc from "easemob-webrtc"
//
import emedia from "easemob-emedia"
let WebIM = require('./lib/im/connection.js')

// WebIM.WebRTC = webrtc
// import config from './lib/im_test/WebIMConfig'
WebIM.config = config.default
console.log(WebIM,'WebIM')

// 初始化插件
Vue.use(VueRouter)
Vue.use(loadPlugin)
Vue.prototype.$http = http
Vue.prototype.$formatTimeAmt = formatTimeAmt
Vue.prototype.$pageSize = 10

// WebIM.EMedia = emedia
// Vue.prototype.$webIM = WebIM
// console.log(WebIM.WebRTC,'WebIM')
Vue.prototype.$imconn  = WebIM.conn = new websdk.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
})
// Vue.prototype.$imconn  = WebIM.conn = new WebIM.connection({
//   isHttpDNS: WebIM.config.isHttpDNS,
//   isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
//   https: WebIM.config.https,
//   url: WebIM.config.xmppURL,
//   isAutoLogin: false,
//   heartBeatWait: WebIM.config.heartBeatWait,
//   autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
//   autoReconnectInterval: WebIM.config.autoReconnectInterval,
//   isStropheLog: WebIM.config.isStropheLog,
//   delivery: WebIM.config.delivery,
//   appKey: WebIM.config.appkey
// })
Vue.prototype.$imoption = {
  apiUrl: WebIM.config.apiURL,
  user: '',
  pwd: '',
  appKey: WebIM.config.appkey,
  success: function (re) {
    console.log('登录IM成功==>', re)
    localStorage.setItem('userId',re.user.username)
  },
  error: function (err) {
    console.log('登录IM失败==>', err)
  }
}
WebIM.call = new WebIM.WebRTC.Call({
  connection: WebIM.conn,

  mediaStreamConstaints: {
    audio: true,
    video: true
  },

  listener: {
    onOtherUserOpenVoice: function (from, opened) {
      console.log("from open:", opened, " voice .", from)
    },
    onOtherUserOpenVideo: function (from, opened) {
      console.log("from open:", opened, " voideo .", from)
    },
    onAcceptCall: function (from, options, enableVoice, enableVideo) {
      console.log("onAcceptCall", from, options, enableVoice, enableVideo)
    },
    onGotRemoteStream: function (stream, streamType) {
      console.log("onGotRemoteStream")
      // me.channel.setRemote(stream, streamType)
    },
    onGotLocalStream: function (stream, streamType) {
      console.log("onGotLocalStream ", "Stream Type: ", streamType)
      // me.channel.setLocal(stream, streamType)
    },
    onRinging: function (caller, streamType) {
      console.log("onRinging", caller)
      // me.channel.ringing(caller, streamType)
    },
    onTermCall: function (reason) {
      //"ok"      -> 'HANGUP'     "success" -> 'HANGUP'   "timeout"          -> 'NORESPONSE'
      //"decline" -> 'REJECT'     "busy"    -> 'BUSY'     "failed-transport" -> 'FAIL'
      // TODO reason undefine if reason is busy
      console.log("onTermCall", reason)
      if (reason && (reason == "busy" || reason == "BUSY")) {
        message.error("Target is busy. Try it later.")
      }
      if (reason && (reason == "timeout" || reason == "noresponse")) {
        message.error("Target no response. Try it later.")
      }
      if (reason && (reason == "decline" || reason == "reject")) {
        message.error("Target reject.")
      }
      if (reason && (reason == "failed-transport" || reason == "fail")) {
        message.error("Call failed. Try it later.")
      }
      if (reason && (reason == "ok" || reason == "success" || reason == "hangup")) {
        message.success("Target hangup. ")
      }


      // WebIM.call.caller = ""
      // WebIM.call.callee = ""
      // me.channel.close()
    },
    onIceConnectionStateChange: function (iceState) {
      console.log("onIceConnectionStateChange")
      // checking
      // connected completed
      // disconnected failed
      // closed
      // console.log('onIceConnectionStateChange', iceState);
      if (iceState == "disconnected") {
        if (!me.rtcTimeoutID) {
          //console.warn("Warn. disconnect. notify offline");

          me.rtcTimeoutID = setTimeout(function () {
            if (!(WebIM.call.pattern && WebIM.call.pattern.hangup)) {
              message.success("Target is offline")
              var closeButton = document.getElementById("webrtc_close")
              closeButton && closeButton.click()
            }
          }, 10000)
        }
      } else if (iceState == "connected") {
        if (me.rtcTimeoutID) {
          clearTimeout(me.rtcTimeoutID)
          me.rtcTimeoutID = null
        }
      }
    },
    onError: function (e) {
      if (e && e.message) {
        var close = false
        switch (e.message) {
          case "CALLLING_EACH_OTHER_AT_THE_SAME_TIME":
            e.message = "Target is calling. Please try again later."
            close = true
            break
          case "TARGET_OFFLINE":
            e.message = "Target is offline."
            break
        }
        if (close) {
          var closeButton = document.getElementById("webrtc_close")
          closeButton && closeButton.click()
        }
      }
      message.error(e && e.message ? e.message : "An error occured when calling webrtc")
    },
    onInvite: function (from, rtcOption) {
      const { confrId, password, gid } = rtcOption
      const { appkey, xmppURL } = WebIM.config
      const { avModal, multiAV } = me.props
      let host = xmppURL.split(".")
      host = "@" + host[1] + "." + host[2]
      from = from.replace(appkey + "_", "")
      from = from.replace(host, "")
      let callback = (confr) => {
        me.props.setRtcOptions(confr)
        confirm({
          title: from + "邀请您进入多人会议",
          okText: "确认",
          cancelText: "拒绝",
          onOk() {
            if(avModal){
              message.info("您正在进行视频通话，不能接受其它邀请")
              return
            }
            me.props.showMultiAVModal()
            me.props.setGid(gid)

            setTimeout(() => {
              const tkt = confr.ticket
              WebIM.EMService.joinConferenceWithTicket(confr.confrId, tkt, "user ext field").then(function () {
                WebIM.EMService.publish({ audio: true, video: true }, "user ext field").catch(function (e) {
                  console.error(e)
                })
              }).catch(function (e) {
                console.error(e)
              })
            }, 0)
          },
          onCancel() {
            console.log("Cancel")
          }
        })
      }
      emedia.mgr.getConferenceTkt(confrId, password).then(function (confr) {
        callback(confr)
      })
    }
  }
})
WebIM.conn.registerConfrIQHandler && (WebIM.conn.registerConfrIQHandler())
const router = new VueRouter({
  routes
})
sync(store, router)
router.beforeEach(beforeEach)
router.afterEach(afterEach)
// 过滤器注册
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
/* eslint-disable no-new */
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
