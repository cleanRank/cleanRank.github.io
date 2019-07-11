import {tracker} from './analytics';
import _ from 'lodash';
// import store from 'store';

const trackerPlugin = {};
// const eventNameMapping = {
//   indexDataBannerhome: {eventAction: 'event', eventLabel: 'banner图'},
//   indexDataNavigation: {eventAction: 'event', eventLabel: 'indexDataNavigation'}
// }

trackerPlugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    bdTrack: {
      get () {
        const {userInfo, config, route} = this.$store.state
        return (eventInfo, e) => {
          const commons = {
            cookie: window.document.cookie,
            devType: this.$store.state.config.Plat || '',
            ver: '0',
            uidType: '',
            uid: (config.Plat == 'IOS' ? userInfo.fingerprint.idfa : userInfo.fingerprint.imei) || '',
            sr: screen.width + "*" + screen.height,
            srp: screen.width + "*" + screen.height,
            userId: userInfo.uid || '',
            appName: '',
            appVersion: '',
            appSmallVersion: '',
            trafficChannel: '', // 下载渠道
            IP: '', // IP地址
            networkType: '', // 网络类型
            time: new Date().getTime(),
            entryURL: this.$route.fullPath || '',
            entryPageTitle: this.$route.meta.title || '',
            referrerURL: route.from.fullPath || '',
            referrerPageTitle: route.from.meta.title || '',
            intcmp: '',
            skuId: '',
            spuID: '',
            spuName: '',
            skuName: '',
            productType: '',
            spuCategoryLv1: '',
            spuCategoryLv2: '',
            spuCategoryLv1ID: '',
            spuCategoryLv2ID: '',
            productData: '',
            eventCategory: 'event',
            hitType: 1, // 点击类型: 0曝光，1:启动2:退出3:点击4:下载5:升级等
            orderId: '',
            orderRevenue: '', //订单金额
            // orderBusinessType: '', //订单业务类型
            producrNumber: 1,
            price: '',
            redPracket: '',
            orderId3: '',
            monthPay: '',
            channel: route.from.meta.title || '',
            systemType: 'h5',
            appType: config.fromChannel || '',
            startFrom: '', // 应用app启动来源
            // param: JSON.stringify(route.query), // 参数字符串
            eventAction: '',
            eventLabel: '',
            dataPage: this.$route.fullPath || '',
            widgetID: '', // event产生在页面上特定页面的特定位置（模块）
            rollID: 1, // 第几行
            rowName: '', // 行标题名称
            poseID: 1, // 第几列
            contentType: '', // 商品类型，其他类型
            contentID: '', // 内容ID
            contentName: '', // 内容名称
            pushId: '',
            sendTime: ''
          };
          let newInfo = {}
          // 位置信息
          if (e) {
            /**
             * @type {HTMLElement}
             */
            const tag = e.currentTarget || e
            const bdid = tag.getAttribute('data-bdid')
            const bdindex = +tag.getAttribute('data-bdindex')
            const erow = +tag.getAttribute('data-erow')
            const modname = tag.getAttribute('data-modname')
            let row = 1, colunm = bdindex + 1
            if (erow) {
              row = Math.floor(bdindex / erow)
              colunm = bdindex % erow
              row += 1
              colunm += 1
            }
            newInfo = {
              widgetID: modname,
              rollID: row,
              poseID: colunm,
              contentID: bdid
            }
            // const eventName = eventNameMapping[modname] || {}
          }
          let event = _.assign({}, commons, eventInfo, newInfo);
          try {
            if (tracker.preCallApi()) {
              tracker.setCommonColumns(event);
              tracker.sendDataToServer(tracker.parseParam(event));
              tracker.updatePreVisitTime(Date.now());
            }
          } catch(e) {}
        }
      }
    }
  })
}

export default trackerPlugin;
