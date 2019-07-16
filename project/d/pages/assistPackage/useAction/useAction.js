import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityIdList: [], // 活动优惠
    activityIdListOptions: [],
    actionInfo: [], //可用优惠券列表
    indx: 0,
    noSelectAction: false,
    usedCrmPopDefVOList: [], //当前使用的优惠活动
    usableCrmPopDefVOList: [], //可用活动列表
    usedCurActionPopId: 0, //当前使用的优惠活动Id
  },
  // 不使用优惠活动
  selectNoneAction() {
    if (this.data.noSelectAction === false) {
      this.data.actionInfo.forEach(v => {
        v.isCheck = false
      })
    }
    this.setData({
      noSelectAction: true,
      actionInfo: this.data.actionInfo
    })
    app.globalData.actionInfo.activityIdList = []


  },
  // 使用优惠活动
  selectAction(e) {
    let item = e.currentTarget.dataset.list
    let index = e.currentTarget.dataset.index
    let noCheck = this.data.actionInfo[index].isCheck
    this.setData({
      noSelectAction: false
    })

    if (this.data.indx !== index) {
      this.setData({
        ['actionInfo[' + this.data.indx + '].isCheck']: false,
      })
    }
    //对于从当前可用优惠券与当前点击的优惠活动对比  如果为同一个活动，选择不选择优惠券，不同，之前获取的当前可用优惠券为不选择状态
    if (this.data.usableCrmPopDefVOList.length) {
      if (this.data.usedCurActionPopId != this.data.actionInfo[index].popId) {
        for (let x = 0; x < this.data.actionInfo.length; x++) {
          if (this.data.usedCurActionPopId == this.data.actionInfo[x].popId) {

            this.setData({
              ['actionInfo[' + x + '].isCheck']: false,
              noSelectAction: true
            })
          }
        }
      }
      this.setData({
        ['actionInfo[' + index + '].isCheck']: !noCheck,
        noSelectAction: true
      })
      this.data.actionInfo.forEach(v => {
        if (v.isCheck === true) {
          let activityIdList = []
          activityIdList.push(v.popId)
          this.setData({
            noSelectAction: false,
            activityIdList: [...activityIdList]
          })
        }
      })
      this.setData({
        indx: index,
        actionInfo: this.data.actionInfo,
      })
    } else {
      this.setData({
        ['actionInfo[' + index + '].isCheck']: true,
      })
      this.data.actionInfo.forEach(v => {
        let x = []
        if (v.isCheck == true) {
          // app.globalData.actionInfo['selectActionDetail'] = v
          x.push(v.popId)
          app.globalData.actionInfo['activityIdList'] = x
        }
      })
    }
    this.data.indx = index
  },
  // 确定使用优惠活动
  confirm() {
    app.globalData.actionConfirm = true
    if (this.data.noSelectAction) {
      app.globalData.actionInfo['activityIdList'] = []
      app.globalData.actionInfo['takeActivityFlag'] = 0
    } else {
      app.globalData.actionInfo.activityIdList = this.data.activityIdList
      app.globalData.actionInfo['takeActivityFlag'] = 1
    }
    let x = this.data.actionInfo
    for (let i = 0; i < x.length; i++) {
      let m = app.globalData.actionInfo.activityIdList
      if (app.globalData.actionInfo.activityIdList) {

        for (let z = 0; z < m.length; z++) {
          if (m[0].popId == x[i].popId) {
            app.globalData.actionInfo["selectActionDetail"] = x[i]
          }
        }
      }
      if (x[i].isCheck === true) {
        app.globalData.actionInfo['takeActivityFlag'] = 1
      }
    }
    app.globalData.couponInfo.usedActionTicketId = null
    app.globalData.couponInfo.usedCashTicketId = null
    app.globalData.couponInfo.usedDiscountTicketId = null
    wx.navigateBack({
      url: `/pages/assistPackage/confirmOrder/confirmOrder?activityIdList=${JSON.stringify(app.globalData.actionInfo.activityIdList)}`
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.actionConfirm = false
    app.globalData.ticketConfirm = false

    let that = this;
    app.$http.createConfirmOrderPage(Object.assign({}, {
      goodsList: app.globalData.goodList,
      orderActivityBo: {
        takeActivityFlag: app.globalData.actionInfo.takeActivityFlag,
        activityIdList: app.globalData.actionInfo.activityIdList,
      },
      orderTicketBo: {
        usedActionTicketId: app.globalData.couponInfo.usedActionTicketId,
        usedCashTicketId: app.globalData.couponInfo.usedCashTicketId,
        usedDiscountTicketId: app.globalData.couponInfo.usedDiscountTicketId
      },
      shopId: app.globalData.shopInfo.shopId,
      sourceFrom: 3
    })).then(res => {
      if (app.globalData.actionInfo.takeActivityFlag == 0) {
        that.setData({
          noSelectAction: true,
        })
        app.globalData.actionInfo['usedCrmPopDefVOList'] = []
      }

      if (!res.result.orderActivityVo.usableCrmPopDefVOList || !res.result.orderActivityVo.usableCrmPopDefVOList.length) {
        that.setData({
          noSelectAction: true,
          usableCrmPopDefVOList: [], //可用优惠活动列表
          usedCrmPopDefVOList: [], //当前使用优惠活动
          actionInfo: [],
        })
      }
      this.data.usedCrmPopDefVOList = res.result.orderActivityVo.usedCrmPopDefVOList || []
      let usedCurActionPopId = '';
      let activityIdList = []
      if (res.result.orderActivityVo.usedCrmPopDefVOList.length) {
        usedCurActionPopId = res.result.orderActivityVo.usedCrmPopDefVOList[0].popId
        let x = usedCurActionPopId
        activityIdList.push(x)
      }
      res.result.orderActivityVo.usableCrmPopDefVOList.forEach(v => {
        v.beginTime = v.beginTime && formatTimeAmt(v.beginTime, 'yyyy.MM.dd hh:mm:ss')
        if (!v.endTime) {
          v.endTime = "长期"
        } else {
          v.endTime = v.endTime && formatTimeAmt(v.endTime, 'yyyy.MM.dd hh:mm:ss')
        }
        v.isCheck = false
        if (v.popId == usedCurActionPopId) {
          v.isCheck = true
        }
      })
      that.setData({
        usedCurActionPopId: usedCurActionPopId,
        activityIdList: activityIdList,
        usableCrmPopDefVOList: res.result.orderActivityVo.usableCrmPopDefVOList, //可用优惠活动列表
        actionInfo: res.result.orderActivityVo.usableCrmPopDefVOList,
        usedCrmPopDefVOList: res.result.orderActivityVo.usedCrmPopDefVOList, //当前使用优惠活动
      })
      app.globalData.actionConfirm = true

      //活动优惠
      app.globalData.actionInfo['usedCrmPopDefVOList'] = that.data.usedCrmPopDefVOList
      app.globalData.actionInfo['usableCrmPopDefVOList'] = that.data.usableCrmPopDefVOList
      app.globalData.actionInfo['activityIdList'] = that.data.activityIdList
    }).catch(res => {})

  }
})