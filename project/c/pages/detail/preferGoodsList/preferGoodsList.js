// pages/detail/preferGoodsList/preferGoodsList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [            // 导航栏的数据
      { name: '综合', selected: true, orderNo: 0 },
      { name: '按销量', selected: false, orderNo: 1 },
      { name: '按价格', selected: false, hasIcon: 'sortDefault', orderNo: 2 }
    ],
    goodsList:[],
    formData: {             // 搜索时提交的数据
      orderNo: 0,
      pageNo: 1,
      isDesc: 0   //是否倒序 ：1-是 0-否
    },
    pageSize:20, 
    searchType:0,   //搜索类型：0-综合，1-销量，2-价格
    pageCount:1,
    fixWrap:false,
    // activityLabel:["1元两件","2元两件","3元两件","4元物件","买1000减100","满3000元减100"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activityNo = options.activityNo
    this.setData({
      activityNo
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.SearchProduct()
    this.setData({
      fixWrap:true
    })
  },
  // getWidth(){
  //   var thisWidth
  //   const query = wx.createSelectorQuery().in(this);
  //   let productList = this.data.goodsList.productList
    
  //   for(let i=0;i<productList.length;i++){
  //     let widthArr = []
  //     var labelItemLen = ''
  //     query.selectAll('.activityLabelItem_'+i).boundingClientRect((res) => {
  //         // console.log(JSON.stringify(res)) 
  //         console.log(32333)
  //         console.log(res)
  //         thisWidth = res[0].width; 
  //         widthArr.push(thisWidth)
  //         console.log(widthArr)
  //     }).exec(function(res){
  //       console.log('res')
  //       console.log(res)
  //       for(let i=0;i<res[0].length;i++){
  //         labelItemLen += res[0][i].width + 12
  //         if(labelItemLen >= 460){
  //           res[0]= res[0].slice(0,i-1)
  //           console.log(res[0])
  //         }
  //       }
  //     })
  //   }
     
  // },
  SearchProduct(){
    //如果没有更多翻页数据了，则不用再发送请求
    if(this.data.noMorePage){
      return
    }
    wx.showLoading({
      title:'加载中',
      mask: true
    })
    const _this = this
    let {isDesc,pageNo} = this.data.formData
    let formData = {
      activityNo: this.data.activityNo,
      isDesc: isDesc,
      pageNo: pageNo,
      pageSize: this.data.pageSize,
      searchType: this.data.searchType
    }
    app.ajax.postApi('SearchProduct',formData).then( res => {
      wx.hideLoading()
      let goodsData = res.data
      //如果页码大于1 说明是翻页，数据紧接着上一条记录
      if(this.data.formData.pageNo >1){
        if(goodsData.status == 1){
          //有记录
          let temGoodsList = _this.data.goodsList
          _this.setData({
            goodsList: temGoodsList.concat(goodsData.data.productList)
          })
          console.log('this.data.goodsList')
          console.log(this.data.goodsList)
          // _this.getWidth()
        }else {
          _this.setData({
            'fromData.pageNo': 0,
            'noMorePage': true
          })
          //无记录
          wx.showToast({
            title:'没有更多商品了！',
            duration: 2000,
            icon: 'none'
          })
        } 
        return
      }
      // 搜索商品列表第一页
      if (goodsData.status == 1) {
        // 搜索成功，给商品列表赋值，且表示已搜索过
        _this.setData({
          goodsList: goodsData.data.productList,
          title: goodsData.data.title
        })
        console.log('goodsList')
        console.log(this.data.goodsList)
        // setTimeout(function() {
        //   // _this.getWidth()
        // },300)
        
        // scroll回到顶部
        // _this.backToTop()
        _this.scrollTop()
      } else {
        // 搜索失败
        _this.setData({
          goodsList: [],
        })

      }
      
      // wx.hideLoading()
      // if(res.data.status == '1'){
      //   let pageCount = res.data.pageCount
      //   let goodsList = res.data.data
      //   //如果页码大于1 说明是翻页，数据紧接着上一条记录
      //   if(this.data.formData >1){
      //     wx.hideLoading()

      //   }
      //   this.setData({
      //     pageCount,
      //     goodsList
      //   })
      //   console.log(goodsList)
      // }
    })


  },
  /**)
   * 点击了导航选项
  */
 selectSortNav (e) {
    let { orderNo } = e.currentTarget.dataset.item;

    // 记录一个临时表单列表对象
    let temFormData = JSON.parse(JSON.stringify(this.data.formData))
    
    // 记录一个临时导航列表对象
    let temNavList = JSON.parse(JSON.stringify(this.data.navList))

    // 将发送信息中的orderNo赋值
    temFormData['orderNo'] = orderNo

    // 判断是否点击了按价格排序
    if (orderNo == 2) {
      // 点击了按价格排序
      // 已经选择了价格排序或第一次选择
      if (temNavList[2]['hasIcon'] == 'sortDes' || temNavList[2]['hasIcon'] == 'sortDefault') {
        // 给排序icon换正序图
        temNavList[2]['hasIcon'] = 'sortAsc'
        // 发送信息改为升序
        temFormData['isDesc'] = 0
      } else {
        // 给排序icon换倒序图
        temNavList[2]['hasIcon'] = 'sortDes'
        // 发送信息改为降序
        temFormData['isDesc'] = 1
      }
    } else {
      // 点击了其他
      // 将价格标签icon复位
      temNavList[2]['hasIcon'] = 'sortDefault'
      // 发送信息改为升序
      temFormData['isDesc'] = 0
    }

    // 点击选项卡之后页码就要重置为1
    temFormData.pageNo = 1
    // 将选择后的导航列表赋值给data
    // 将选择的提交项赋值给formData
    this.setData({
      'navList': temNavList,
      "formData": temFormData,
      searchType:orderNo
    })

    this.SearchProduct()
  },
  // 进入商品详情页
  productDetail(e){
    let info = e.currentTarget.dataset.item
    let activityNo = info.activityNo
    let isActivity = info.isActivity
    let productNo = info.productNo
    wx.navigateTo({
      url:`/pages/detail/detail?productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`
    })
  },
  // 加入购物车
  addShopCart(e){
    let info = e.currentTarget.dataset.info
    // if(info.productStock < 1){
    //   wx.showToast({
    //     title:'库存不足',
    //     duration:1500,
    //     icon:'none'
    //   })
    //   return false
    // }
    app.getUserToken.getToken().then( res => {
      var res = res
      if(res.status == 1){
        var productNo = info.productNo
        var activityNo = info.activityNo
        var {uid,token} = wx.getStorageSync('miniProgramUserinfo')
        wx.showLoading({
          title:'加载中...',
          mask: true
        })
        app.ajax.postApi('addShoppingCart', {
          uid,
          token,
          productNo:productNo,
          activityNo: activityNo,
          quantity:1
        }).then( res => {
          wx.hideLoading()
          if(res.data.status == 1){
            wx.showToast({
              title:'加入购物车成功',
              duration: 2000,
              icon:'none'
            })
          }else{
            wx.showToast({
              title: res.statusMessage,
              duration: 2000,
              icon:'none'
            })
          }
        })
      }
    })
  },
  // 滚动到顶部
  scrollTop(){
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  // 进入购物车页面
  goShopCart(){
    wx.switchTab({
      url:'/pages/shopCart/shopCart'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let formData = JSON.parse(JSON.stringify(this.data.formData))
    formData.pageNo += 1
    this.setData({ formData })
    this.SearchProduct()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})