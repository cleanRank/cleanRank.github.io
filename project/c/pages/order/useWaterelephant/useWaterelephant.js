const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    curCardList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curCardList = JSON.parse(options.curCardList)
    var totalPrice = options.totalPrice
    this.setData({
      totalPrice
    })
    if (curCardList.length>0) {
      this.setData({
        curCardList
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCardList()
  },
  // 查询水象通可用卡列表
  getCardList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('querySxtCardList', {
      uid,
      token,
      usableStatus: 1
    }).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        // 回显选中水象通卡列表
        res.data.filter(item => {
          let arr = this.data.curCardList.map(v => v.cardNo)
          if (arr.includes(item.cardNo)) {
            item.checked = true
          }
        })
        this.setData({
          cardList: res.data
        })
        this.initBtnStatus()
      }

    })
  },
  initBtnStatus () {
    let leftAmount = 0
    this.data.curCardList.forEach((item, idx) => {
      leftAmount += item.leftAmount
    })
    if (this.data.totalPrice <= leftAmount) {
      this.data.cardList.filter(item => {
        let arr = this.data.curCardList.map(v => v.cardNo)
        if (!arr.includes(item.cardNo)) {
          item.disabled = true
        }
      })
    } else {
      for (var i = 0; i < this.data.cardList.length; i++) {
        this.data.cardList[i].disabled = false
      }
    }
    this.setData({
      cardList: this.data.cardList
    })
  },
  changeCard(cardNo) {
    if (cardNo) {
      this.data.curCardList.forEach((item, index) => {
        if (cardNo == item.cardNo) {
          this.data.curCardList.splice(index, 1)
        }
      })
    } else {
      this.initBtnStatus()
    }
  },
  // 选择使用卡
  tapCard(e) {
    let cardId = e.currentTarget.dataset.card
    let leftAmount = 0  
    /*
      1.循环当前卡列表
      2.选择当前
          未选中  
            先判断订单金额是否大于 选中卡片的金额总和
              大于
                则让当前为选中状态，并把当前卡片信息push到选中卡列表
              小于
                不做处理
          已选中
            取消选中，并删除选中数组中的当前元素


          计算循环
          循环当前选中卡列表，计算出选中水象通卡的总金额
            订单总金额小于等于水象通总金额
              找出卡列表与选中卡列表不等的数据 置位不可选中
            反之
              初始化卡列表 
     
    */  
    this.data.cardList.forEach((item) => {
      if (item.id == cardId) {
        if (item.checked) {
          // 取消选择
          item.checked = false
          this.changeCard(item.cardNo)
        } else {
          // 先去判断金额
          this.data.curCardList.forEach((_item, idx) => {
            leftAmount += _item.leftAmount
          })
          console.log('leftAmount:'+leftAmount)
          if (this.data.totalPrice > leftAmount) {
            item.checked = true
            var curCard = {
              cardNo: item.cardNo,
              leftAmount: item.leftAmount
            }
            this.data.curCardList.push(curCard)
          }
        }
      }
    })
    this.changeCard()
    this.setData({
      cardList: this.data.cardList
    })
    
  },
  // 确定使用卡
  confirmUse() {
    console.log(this.data.curCardList)
    if (this.data.curCardList.length>0) {
      wx.setStorageSync('curCardList', this.data.curCardList)
    } else {
      try {
        wx.removeStorageSync('curCardList')
      } catch (e) {
        console.log(e)
      }
    }
    wx.navigateBack({
      delta: 1
    })
  }
})
