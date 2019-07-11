const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasReceived:1,// 是否已经收到货
    showLog:false,// 是否显示物流
    logDisabled:true,// 是否禁用输入框（物流单号）
    data:{},
    logistics:'',// 已选的物流公司
    logisticsList:[],// 物流公司列表
    remark:'',// 备注内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let serviceOrderId = options.serviceOrderId
    this.setData({
      serviceOrderId
    })
    
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let selectedAddress = wx.getStorageSync('selectedAddress')
    if(selectedAddress){
      this.setData({
        selectedAddress
      })
    }
    
    this.init()
  },
  /**
   * 查看信息
   */
  init(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { serviceOrderId } = this.data
    let formData = {
      uid,
      token,
      serviceOrderId
    }
    app.ajax.postApi('afterSaleProgressSend', formData).then(({ data: res }) => {
      wx.hideLoading()
      console.log(res)
      if (res.status == 1) {
        var res = res.data
        let compressList = res.compressList
        let logisticsList = []
        compressList.forEach((item)=>{
          logisticsList.push(item.expressDesc)
        })

        let selectedAddress = this.data.selectedAddress
        console.log(selectedAddress)
        if(selectedAddress){
          res.consumerAddressNo = selectedAddress.addressNo // 地址编码
          res.consumerRecipientName = selectedAddress.consignee // 收货人
          res.consumerRecipientPhone = selectedAddress.consigneeMobile  // 收货电话
          res.consumerRecipientAddress = selectedAddress.addProvince+selectedAddress.addCity+selectedAddress.addCounty+selectedAddress.addTown+selectedAddress.addDetail  // 收货地址
        }

        this.setData({
          data:res,
          logisticsList
        })
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  },
  /**
   * 更换地址
   */
  changeAddress(){
    let url = '/pages/mine/address/address?isEnbleClick=1'
    wx.navigateTo({
      url
    })
  },
  /**
   * 是否收到
   */
  changeBtn(e){
    let index = e.currentTarget.dataset.index
    // 未收到货，隐藏物流信息
    let showLog = index==0?true:false
    this.setData({
      hasReceived:index,
      showLog
    })
  },
  /**
   * 物流切换
   */
  bindPickerChange(e){
    let value = e.detail.value
    this.setData({
      logistics:this.data.logisticsList[value],
      expressName:this.data.data.compressList[value].expressKey,
      logDisabled:false
    })
  },
  /**
   * 物流单号
   */
  getExpressCode(e){
    let expressCode = e.detail.value
    // 去掉空格和特殊符号
    expressCode = expressCode.replace(/([^\da-zA-Z]+)/g, '')
    this.setData({
      expressCode
    })
    return expressCode
  },
  /**
   * 输入备注
   */
  input(e){
    let remark = e.detail.value
    this.setData({
      remark
    })
  },
  /**
   * 提交
   */
  submit(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { serviceOrderId,hasReceived,expressName,expressCode,remark } = this.data
    let { consumerAddressNo } = this.data.data
    
    let formData = {
      uid,
      token,
      serviceOrderId,
      consumerAddressNo,// 收货地址编码
      hasReceived,// 是否收到货
      expressName,// 物流编码
      expressCode,// 物流单号
      remark// 备注
    }
    if(!expressName&&hasReceived==1){
      wx.showToast({
        title: '请选择物流公司',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    if(!expressCode&&hasReceived==1){
      wx.showToast({
        title: '请输入物流单号',
        duration: 2000,
        icon: 'none'
      })
      return
    }
    app.ajax.postApi('afterSaleProgressSendSubmit', formData).then(({ data: res }) => {
      wx.hideLoading()
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          icon: 'none'
        })
        wx.setStorageSync('aftersaleIndex', '1')
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1000)
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  },


})