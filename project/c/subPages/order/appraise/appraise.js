const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars:[1,1,1,1,1],
    productCommentGrade:5, 
    productCommentContent:'', 
    anonymousComment:0,//不需要匿名
    uploaderNum: 0,// 已上传的数量
    showUpload: true,// 是否显示上传按钮
    imgList:[],// 已上传图片集合
    isOver:false//评论窗口是否完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let listData = options.listData;
    listData = JSON.parse(listData);
    console.log(listData)
    this.setData({
      orderId: listData.orderId,
      productImage: listData.productImage,
      productNo: listData.productNo,
      productName: listData.productName,
      activeData: listData
    })
  },
  /**
   * 五颗星星切换
   */
  changeStar(e){
    let index = e.currentTarget.dataset.index;
    let stars = [];
    for(let i=0;i<5;i++){
      i <= index ? stars.push(1) : stars.push(2)
    }
    this.setData({ stars, productCommentGrade:index+1})
  },
  /**
   * 输入框事件
   */
  textareaInput(e){
    this.setData({ productCommentContent:e.detail.value})
  },
  /**
   * 匿名切换
   */
  checkboxChange(){
    let anonymousComment = this.data.anonymousComment;
    if (anonymousComment==1){
      this.setData({ anonymousComment: 0 })
    } else if (anonymousComment == 0){
      this.setData({ anonymousComment: 1 })
    }
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      promotionFlag: flag
    })
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 发布
   */
  submit(e){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token, nickName, mobile: phonenumber } = wx.getStorageSync('miniProgramUserinfo')
    let { orderId, productNo, productName, productCommentGrade, productCommentContent, anonymousComment } = this.data
    let productCommentPicture = this.data.imgList.join(',')
    let formData = {
      uid,
      token,
      nickName,
      phonenumber,
      productNo,
      productName,
      orderId,
      productCommentGrade,//评价等级默认5星
      productCommentPicture,//图片地址
      productCommentContent,//评论内容
      anonymousComment//是否匿名（0不需要匿名，1匿名）
    }
    if (productCommentContent.length<1){
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    app.ajax.postApi('addProductComment', formData).then(({data:res}) => {
      wx.hideLoading()
      if (res.status==1){
        wx.showToast({
          title: res.statusMessage,
          icon: 'none',
          duration: 2000
        })
        if(e!='share'){
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }else{
          // 调用分享
          this.showOrder();
        }
      }else{
        wx.showToast({
          title: res.statusMessage,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 分享
   */
  showOrder(){
    wx.showLoading({
      title: '加载晒单信息...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        var { uid, inviteCode, token } = wx.getStorageSync('miniProgramUserinfo')
        let { orderId } = this.data;
        app.ajax.postApi('productCommentShare', {
          page: 'subPages/order/appraise/appraise',
          width: 300,
          uid,
          token,
          orderId
        }).then(({
          data: res
        }) => {
          wx.hideLoading()
          if (res.status == '1') {
            console.log(res.data)
            let promotionData = { shareImg: res.data.pic }
            this.setData({
              promotionData,
              promotionFlag: true,
              isOver:true
            })
          } else {
            wx.showToast({
              title: res.statusDetail,
              duration: 2000,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  /**
   * 评论并分享
   */
  share(e) {
    this.submit('share');// 先评论
  },
  /**
   * 删除图片
   */
  clearImg: function (e) {
    var index = e.currentTarget.dataset.index;
    let imgList = this.data.imgList;
    let url = imgList.splice(index,1);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token,
      url
    }
    app.ajax.postApi('deleteUrl', formData).then(({data:res}) => {
      wx.hideLoading()

      this.setData({
        uploaderNum: this.data.imgList.length - 1,
        showUpload: true,
        imgList
      })
    })

  },
  /**
   * 展示图片
   */
  showImg: function (e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: this.data.imgList[e.currentTarget.dataset.index]
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
      count: 6-this.data.imgList.length,
      sizeType: ['compressed'], // 压缩图
      sourceType: ['album', 'camera'], // 相机，相册
      success: res => {
        console.log(res)
        //图片在微信服务器的地址（集合）
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);

        // 循环转换成base64，然后上传到服务器
        
        wx.showLoading({
          title: '图片上传中...',
          mask: true
        })

        let aIndex = 0;// 用来计算接口响应次数
        tempFilePaths.forEach((item)=>{
          // 从微信读取图片，转换成base64
          wx.getFileSystemManager().readFile({
            filePath: item,
            encoding: 'base64',
            success: res => {
              let base64ImgUrl = res.data
              let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
              let formData = {
                uid,
                token,
                userInfoFlag:0,
                img: base64ImgUrl
              }
              app.ajax.postApi('sendImageName', formData).then(({data:res}) => {
                aIndex ++
                if (aIndex == tempFilePaths.length){
                  // 最后一次
                  wx.hideLoading()
                }
                if (res.status==1){
                  // 图片上传成功
                  let imgList = this.data.imgList;
                  imgList.push(res.data);//图片在我们服务器的地址
                  this.setData({
                    imgList
                  })
                  if (aIndex == tempFilePaths.length) {
                    // 循环的最后一次
                    if (this.data.imgList.length < 6) {
                      this.setData({
                        showUpload: true
                      })
                    }
                  }
                }else{
                  //上传失败
                  wx.showToast({
                    title: res.data.statusMessage,
                    icon: 'none',
                    duration: 2000
                  })
                }
              })

            },
            fail: res => {
              console.log(res)
              wx.showToast({
                title: '图片转码失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        })
      },
      fail:res=>{
        this.setData({
          showUpload: true
        })
      }
    })
  },
  /**
   * 分享
   */
  onShareAppMessage(option) {
    let activeData = this.data.activeData
    let title = activeData.productName
    let path = `/pages/detail/detail?productNo=${activeData.productNo}&isActivity=${activeData.isactivity}&activityNo=${activeData.activityNo}`
    let imageUrl = this.data.promotionData.shareImg
    return {
      title,
      path,
      imageUrl
    }
  }

})