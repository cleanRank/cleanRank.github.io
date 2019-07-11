/*
 * 水象优品 入口文件 main.js
 * 简介：vue2.0 + vuex + vue-router + axios + es6 + webpack
 *
*/
import 'babel-polyfill'
import 'lib/lrz.all.bundle'
import Vue from 'vue'                            // vue core
import VueRouter from 'vue-router'               // vue 路由
import routes, { beforeEach, afterEach } from './router/'         // 引入路由表
import { sync } from 'vuex-router-sync'
import App from '@/App'
import formValid from 'lib/formValid'
import loadPlugin from 'lib/loadPlugin'
import store from 'store/'      // vuex 单向数据里 core
import VueAwesomeSwiper from 'vue-awesome-swiper'   // 轮播图
import http from 'lib/httpPlugin'
import dialog from 'lib/dialogPlugin'
import VueLazyload from 'vue-lazyload'
 // 初始化插件w
// import tracker from 'lib/bigDataTracker'
 // 初始化插件
Vue.use(VueRouter)                               // 声明使用vue-router
Vue.use(http)
Vue.use(dialog)
Vue.use(formValid)
Vue.use(loadPlugin)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  preLoad: 1.2,
  listenEvents: [ 'scroll', "touchmove", "transitionend", "animationend" ]
})
import * as fiters from './filter/'      // vuex 单向数据里 core
 // 初始化插件
Vue.use(VueRouter)                               // 声明使用vue-router
Vue.use(formValid)
// Vue.use(tracker)
Object.keys(fiters).forEach(_item => {
  Vue.filter(_item, fiters[_item])
})
const router = new VueRouter({
  routes
})
sync(store, router)
router.beforeEach(beforeEach)
router.afterEach(afterEach)
/* 自定义全局指令-iosx兼容 start */
const windowHeight = window.innerHeight
Vue.directive('formBlur', {
  inserted (el, binding) {
    var isiOSX = /iphone/gi.test(navigator.userAgent) && (window.screen.height == 812 && window.screen.width == 375)
    if (isiOSX) {
      el.addEventListener('blur', function () {
        let windowFocusHeight = window.innerHeight
        if (windowHeight == windowFocusHeight) {
          return
        }
        let currentPosition
        let speed = 1 // 页面滚动距离
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop
        currentPosition -= speed
        window.scrollTo(0, currentPosition) // 页面向上滚动
        currentPosition += speed // speed变量
        window.scrollTo(0, currentPosition) // 页面向下滚动
      })
    }
  }
})
/* 自定义全局指令-iosx兼容 end */
const initVue = () => {
  new Vue({
    el: '#app',
    router,
    store,
    ...App
  })
}
if (!window.appSource) {
  // 启动vue实例
  initVue()
}
// 只有在本地开发环境才加载vconsole 便于调试
if (process.env.NODE_ENV !== 'production') {
  require('eruda').init({
    tool: ['console', 'elements', 'network', 'resources', 'sources']
  })
}
// 引入mock模拟本地开发数据
if (process.env.NODE_ENV == 'mock') {
  require('../mock/')
}
// 神策埋点
// 区分上下线，关闭log
const show_log_flag = process.env.NODE_ENV !== 'production'
import sensors from 'sa-sdk-javascript'
sensors.init({
  server_url: process.env.SENSORS,
  name: 'sa',
  // heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
  heatmap_url: "./static/heatmap.min.js",
  // web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
  web_url: "https://shuixiangyoupin.cloud.sensorsdata.cn",
  show_log: show_log_flag,
  use_app_track: true,
  use_client_time: true,
  heatmap: {
    // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.7
    clickmap: 'default',
    //  是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.9.1
    scroll_notice_map: 'default'
  }
})
const distinct_id = sensors.store.getDistinctId()
sensors.login(distinct_id)
sensors.quick('autoTrack')
// 平台类型
let platform_type = 'H5'
if (store.state.config.fromChannel == 'sxypApp') {
  platform_type = store.state.config.Plat
}
// 合伙人等级（初级、中级）
let partnershipLevel = store.state.userInfo.memberLevel || ''
switch (partnershipLevel) {
  case "1":
    partnershipLevel = '初级'
    break
  case "2":
    partnershipLevel = '中级'
    break
  default:
    partnershipLevel = ''
}
sensors.registerPage({
  platform_type: platform_type,
  partnerOrNot: partnershipLevel != '',
  partnershipLevel
})
