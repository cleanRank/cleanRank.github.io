const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab1: 0,
    loadFlag: [false, false, false], //分页是否到底
    size: 8, // 每页条数
    page: [1, 1, 1], // 当前nav当前页码
    form: {
      orderId: '',
      billType: ['商品明细', '商品类别'],
      InvoiceRise : ['个人', '单位'],
      bankAccount: '',
      email: '',
      company:'',
      dutyParagraph: '',
      address: '',
      telphone: '',
      bankName: '',
    },
    phone:'',
    current1: '',
    current: '',
    isAddInvoice: true,
    content: '',
    titleType: '',
    invoiceType: '电子普通发票',
    isCompany: false,
    orderId: ''
  },
  selectBill: function () {
    wx.navigateTo({
      url: '/pages/assistPackage/InvoiceInfo/InvoiceInfo?orderId='+ this.data.orderId 
    })
  },
  submit: function () {
    this.getInvoice('printInvoice',this.data.orderId,()=>{
      wx.navigateBack({
        url: '/pages/assistPackage/InvoiceCenter/InvoiceCenter'
      })
    })
  },
  modify () {
    this.getInvoice('updateUserInvoice','',()=>{
      wx.navigateBack({
      url: '/pages/assistPackage/InvoiceCenter/InvoiceCenter'
    })
    })
  },
  getEmail (e) {
    this.setData({
      email:e.detail.value
    })
  },
  getNumber (e) {
    this.setData({
      [`form.${e.currentTarget.dataset.value}`]:e.detail.value
    })
  },
  //添加抬头公用方法
  getInvoice (api,id,func) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (this.data.form.email!='')  {
      if (str.test(this.data.form.email)) {
        let params = {
          content: this.data.content||this.data.form.billType[0],
          titleType: this.data.titleType=='单位'?2:1,
          titleName: '个人',
          phone: this.data.phone,
          email: this.data.form.email,
          invoiceType:this.data.invoiceType=='电子普通发票'?1:2,
          orderId: id
        }
        if (this.data.titleType=='单位') {
          params.address = this.data.form.address
          params.phone = this.data.form.telphone||this.data.phone
          params.bankName = this.data.form.bankName
          params.bankAccount = this.data.form.bankAccount
          if (this.data.form.company!=''&&this.data.form.dutyParagraph!='') {
            params.titleName = this.data.form.company
            params.netCode = this.data.form.dutyParagraph
          } else {
            wx.showToast({
              title: '请输入必填项',
              icon: 'none',
              duration: 2000
            })
            return ;
          }
        }
        app.$http[api](params).then(res => { //获取可用优惠活动
          wx.showToast({
            title: res.appMesg,
            icon: 'none',
            duration: 1500,
            mask: false,
            success: func
          });   

        }).catch(res => {})
      } else {
        wx.showToast({
          title: '请检查邮箱格式',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none',
        duration: 2000
      })
    }
  },
  saveInvoice:function () {
    this.getInvoice('addUserInvoice')
  },
  chooseBill (e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      content: e.currentTarget.dataset.item
    })
  },
  chooseInvoice (e) {
    this.setData({
      current1: e.currentTarget.dataset.index,
      titleType: e.currentTarget.dataset.item
    })
    if (this.data.titleType=='单位') {
      this.setData({
        isCompany: true
      })
    } else {
      this.setData({
        isCompany: false
      })
    }
  },
  getRiseDetail (id) {
    app.$http.getCardLstList({invoiceId:id}).then(res => { //获取可用优惠活动  
      this.setData({
        content: res.result.content,
        titleName: res.result.titleName,
        [form+'.email']: res.result.email,
        // ["form['address']"]:res.result.address,
        // ["form['bankName']"]:res.result.bankName,
        // ["form['bankAccount']"]:res.result.bankAccount,
        // ["form['invoiceType']"]:res.result.invoiceType==1?'个人':'单位',
        // ["form['netCode']"]:res.result.netCode,
      })
      console.log(this.data.form)
    }).catch(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.setData({
      phone: wx.getStorageSync("mobile")
    })
  },
  onLoad: function (options) {
    if (options.isAddInvoice) {
      this.setData({
        isAddInvoice: options.isAddInvoice
      })
    }
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    }
    if(options.invoiceId||options.invoiceId==0) {
      this.getRiseDetail (options.invoiceId)
    }
    this.data.currentTab1 = 0
  }


})