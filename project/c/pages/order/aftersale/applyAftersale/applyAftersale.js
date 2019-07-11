const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeIndex: -1, // 类型的索引
    orderId: '',
    data: {},
    showView: true, // 是否显示数量按钮
    count: 1,
    refundAmount: '', //退款金额（计算后的）
    cause: '',
    causeValue: '', // 原因描述内容
    showUpload: true, // 是否显示上传按钮
    tempFileList: [], // 图片在微信服务器地址
    imgList: [], // 已上传图片集合
    isOver: false, //评论窗口是否完成
    isShowModel: false, // 是否显示售后原因弹框
    sourceType: 1 // 1前端，2后台
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId
    let orderStatus = options.orderStatus
    // 状态2 待发货
    if (orderStatus == '2') {
      wx.setNavigationBarTitle({
        title: '取消订单'
      })
      this.setData({
        showView: false
      })
    }
    this.setData({
      orderId
    })
    this.init()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 申请售后服务
   */
  init() {
    let orderId = this.data.orderId
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let {
      uid,
      token
    } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token,
      orderId
    }
    app.ajax.postApi('afterSaleApply', formData).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
        var res = res.data
        let refundAmount = Number(res.totalRefundAmount) 

        // 用户拒收时，数量不可选，隐藏了申请数量按钮，退款金额应该是*总数量的
        let afterSaleType = res.afterSaleType
        if (afterSaleType.length == 1 && res.afterSaleType[0].type == 3) {
          this.setData({
            showView: false
          })
        }



        // 订单状态是2(待发货的时候取消订单)，隐藏了申请数量按钮，退款金额应该是*总数量的
        if (!this.data.showView) {
          refundAmount = Number(res.totalRefundAmount)
          this.setData({
            count: res.canAftersaleCnt
          })
        }
        refundAmount = refundAmount.toFixed(2)
        this.setData({
          data: res,
          refundAmount
        })
      } else {
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 减少数量
   */
  subtract() {
    let count = this.data.count
    if (count <= 1) {
      return;
    }
    count--
    // let refundAmount = (Number(this.data.data.everyRefundAmount)) * count + Number(this.data.data.remainder)
    // refundAmount = refundAmount.toFixed(2)
    this.setData({
      count,
      // refundAmount
    })
    this.checkMoney(count)
  },
  //根据数量计算退款金额
  checkMoney(count){
    let data = this.data.data.refundDetailList
    data.forEach((val,index)=>{
      if (val.refundCount==count){
        this.setData({
          refundAmount: val.refundAmount
        })
      }
    })
  },
  /**
   * 增加数量
   */
  add() {
    let count = this.data.count
    if (count >= this.data.data.canAftersaleCnt) {
      return;
    }
    count++
    // let refundAmount = (Number(this.data.data.everyRefundAmount)) * count + Number(this.data.data.remainder)
    // refundAmount = refundAmount.toFixed(2)
    this.setData({
      count,
      // refundAmount
    })
    this.checkMoney(count)
  },
  /**
   * 输入数量
   */
  getCount(e) {
    let count = e.detail.value
    if (count == '') {
      return
    }
    // let refundAmount = (Number(this.data.data.everyRefundAmount)) * count + Number(this.data.data.remainder)
    // refundAmount = refundAmount.toFixed(2)
    this.setData({
      count,
      // refundAmount
    })
    return count

  },
  /**
   * 数量输入完成（完成按键，失焦）
   */
  commitCount(e) {
    let count = e.detail.value
    let canAftersaleCnt = this.data.data.canAftersaleCnt
    if (count < 1) {
      count = 1
    }
    if (count > canAftersaleCnt) {
      wx.showToast({
        title: '数量超过可申请售后数量',
        icon: 'none',
        duration: 2000
      })
      count = canAftersaleCnt
    }
    // let refundAmount = (Number(this.data.data.everyRefundAmount)) * count + Number(this.data.data.remainder)
    // refundAmount = refundAmount.toFixed(2)
    this.setData({
      count,
      // refundAmount
    })
    this.checkMoney(count)
    return count
  },
  /**
   * 退款金额的输入
   */
  changeRefundAmount(e) {
    let value = e.detail.value
  },
  /**
   * 退款金额完成
   */
  commitRefundAmount(e) {
    let value = e.detail.value
    if (value == '') {
      value = 0
    }
    value = parseFloat(value)
    if (value < 0) {
      wx.showToast({
        title: '金额不能小于0',
        icon: 'none',
        duration: 2000
      })
      value = 0
    }
    if (value > Number(this.data.data.totalRefundAmount)) {
      wx.showToast({
        title: '金额不能大于最大金额',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        refundAmount: Number(this.data.data.totalRefundAmount).toFixed(2)
      })
      return
    }
    this.setData({
      refundAmount: value.toFixed(2)
    })
  },
  /**
   * 更改类型
   */
  changeType(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    this.setData({
      typeIndex: index,
      afterSaleType: type
    })
    if(type == 3) {
      let count = this.data.data.canAftersaleCnt
      // let refundAmount = ((Number(this.data.data.everyRefundAmount)) * count + Number(this.data.data.remainder)).toFixed(2)
      this.setData({
        showView: false,
      })
      this.checkMoney(this.data.data.buycount)
    }else {
      this.setData({
        showView: true,
        // refundAmount:(Number(this.data.data.everyRefundAmount)) * this.data.count + Number(this.data.data.remainder)
      })
      this.checkMoney(this.data.count)
    }
  },
  /**
   * 售后弹框开启
   */
  showModel() {
    this.setData({
      isShowModel: true
    })
  },
  /**
   * 售后弹框关闭
   */
  hideModel() {
    let pickerIndex = this.data.pickerIndex
    if (pickerIndex === undefined) {
      wx.showToast({
        title: '请选择售后类型',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      isShowModel: false
    })
  },
  /**
   * 原因选择
   */
  bindPickerChange(e) {
    let index = e.currentTarget.dataset.index
    let afterSaleReason = this.data.data.afterSaleReason[index].reason
    this.setData({
      cause: this.data.data.afterSaleReason[index].reasonDesc,
      pickerIndex: index,
      afterSaleReason
    })
  },
  /**
   * 输入问题描述
   */
  input(e) {
    let causeValue = e.detail.value
    this.setData({
      causeValue
    })
  },

  /**
   * 删除图片
   */
  clearImg: function (e) {
    var index = e.currentTarget.dataset.index;
    let tempFileList = this.data.tempFileList;
    let imgList = this.data.imgList;
    tempFileList.splice(index, 1);
    imgList.splice(index, 1);

    this.setData({
      uploaderNum: this.data.imgList.length - 1,
      showUpload: true,
      imgList,
      tempFileList
    })

  },
  /**
   * 展示图片
   */
  showImg: function (e) {
    wx.previewImage({
      urls: this.data.tempFileList,
      current: this.data.tempFileList[e.currentTarget.dataset.index]
    })
  },
  /**
   * 上传图片
   */
  upload: function (e) {
    // 图片上传中的时候需要隐藏添加图片按钮（防止正在上传的时候继续点击添加图片）
    this.setData({
      showUpload: false
    })
    // 图片上传到微信服务器
    wx.chooseImage({
      count: 3 - this.data.imgList.length,
      sizeType: ['compressed'], // 压缩图
      sourceType: ['album', 'camera'], // 相机，相册
      success: res => {
        //图片在微信服务器的地址（集合）
        let tempFilePaths = res.tempFilePaths;

        let tempFileList = this.data.tempFileList;
        tempFileList = tempFileList.concat(tempFilePaths);
        this.setData({
          tempFileList
        })

        // 循环转换成base64，然后上传到服务器

        wx.showLoading({
          title: '图片上传中...',
          mask: true
        })
        let aIndex = 0; // 用来计算接口响应次数
        tempFilePaths.forEach((item) => {
          // 从微信读取图片，转换成base64
          wx.getFileSystemManager().readFile({
            filePath: item,
            encoding: 'base64',
            success: res => {
              let base64ImgUrl = res.data
              aIndex++
              // 图片上传成功
              let imgList = this.data.imgList;
              imgList.push(base64ImgUrl); //图片在我们服务器的地址
              this.setData({
                imgList
              })

              if (aIndex == tempFilePaths.length) {
                // 循环的最后一次
                if (this.data.imgList.length < 3) {
                  this.setData({
                    showUpload: true
                  })
                }
                wx.hideLoading()
              }

            },
            fail: res => {
              this.setData({
                tempFileList: [],
                imgList: [],
                showUpload: true
              })
              wx.showToast({
                title: '图片转码失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      fail: res => {
        console.log(res)
        this.setData({
          showUpload: true
        })
      }
    })
  },
  /**
   * 立即申请
   */
  submit() {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if(this.data.afterSaleType == 3) {
      let count = this.data.data.canAftersaleCnt
      this.setData({
        count:count
      })
    }
    let {
      uid,
      token
    } = wx.getStorageSync('miniProgramUserinfo')
    let {
      orderId,
      count: applyRefundCount,
      refundAmount: applyRefundAmount,
      afterSaleType,
      afterSaleReason,
      causeValue: afterSaleReasonDesc,
      sourceType
    } = this.data

    let images = this.data.imgList.join(',')

    if (!afterSaleType) {
      wx.showToast({
        title: '请选择售后类型',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    if (!afterSaleReason) {
      wx.showToast({
        title: '请选择售后原因',
        duration: 2000,
        icon: 'none'
      })
      return;
    }

    if (afterSaleReasonDesc.length > 0 && afterSaleReasonDesc.length < 5) {
      wx.showToast({
        title: '描述不能少于5个字',
        duration: 2000,
        icon: 'none'
      })
      return
    }


    let formData = {
      uid,
      token,
      orderId,
      applyRefundCount, // 申请售后数量
      applyRefundAmount, // 申请售后金额
      afterSaleType, //申请售后类型
      afterSaleReason, // 申请售后原因
      afterSaleReasonDesc, // 原因描述
      images, // 图片集合
      sourceType //用户来源
    }
    app.ajax.postApi('afterSaleApplySubmit', formData).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
        var res = res.data
        wx.showToast({
          title: '申请成功',
          duration: 2000,
          icon: 'none'
        })
        wx.setStorageSync('aftersaleIndex', '1')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)

      } else {
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  }
})