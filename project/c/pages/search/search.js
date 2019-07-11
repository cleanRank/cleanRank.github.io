// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHisList: [],   // 搜索历史列表
    searchHotList: [],    // 热门列表
    defineWord: '',       // 默认文案
    searchWord: '',        // 预备搜索文案
    completeList: [],    // 刷出的补充列表
    navList: [            // 导航栏的数据
      { name: '综合', selected: true, orderNo: 0 },
      { name: '按销量', selected: false, orderNo: 1 },
      { name: '按价格', selected: false, hasIcon: 'sortDefault', orderNo: 2 }
    ],
    notYetSearch: true,
    goodsList: [
      // {
      //   "proImage":"http://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/20a769b0-e26b-416a-9801-729d000c5533.jpg?x-oss-process=image/resize,m_lfit,h_600,w_500,limit_1",
      //   "price": "799.11",
      //   "productName": "1101添加一个商品验证主流程2",
      // }
    ],            // 记录所有搜索出的商品
    formData: {             // 搜索时提交的数据
      productName: '',
      orderNo: 0,
      pageNo: 1,
      deAc: 0
    },
    topDistance: 0,
    noMorePage: false,
    pageReady: false,
    pageName:'搜索'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // 调用获取热词接口
    this.getHotWords()
    this.setData({
      searchHisList: wx.getStorageSync('historyWorks') || [],
    })
  },

  // 获取输入框中的文字
  getSearchWord (word) {
    // 将回传的文字赋值给预搜索文案
    this.setData({searchWord: word.detail})
    // 如果文字非空，将文字传送给补全接口
    if (this.data.searchWord) {
      this.callCompleteApi(this.data.searchWord)  
    } else {
      // 清空补全列表
      // 清空商品列表
      // 将未搜索改为true
      this.setData({
        'completeList': [],
        'goodsList': [],
        'notYetSearch': true
      })
    }
  },

  // 调用文字补全接口
  callCompleteApi (work) {
    app.ajax.postApi('AutoCompletion', {
      'searchword': work
    }).then(res => {
      let comData = res.data.data
      comData = comData.map(val => {
        return { text: val }
      })
      this.setData({
        'completeList': comData
      })
    })
  },

  // 获取热门文字
  getHotWords () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.ajax.postApi('searchHotWord').then(res => {
      let hotData = res.data.data
      let temHotList = hotData.SearchHotWord.map((val) => {
        return Object.assign({}, {text: val.hotWord}, val)
      })
      this.setData({
        defineWord: hotData.Searchfordefault,
        searchHotList: temHotList,
        pageReady: true
      })
      wx.hideLoading()
    })
  },

  /**
   * 点击了搜索历史的标签
  */
  // skipSearchHis ({e, fromTrigger = false}) {
  skipSearchHis(e) {
    let item = null
    // 判断是否WXML标签data传过来的，还是用组件trigger传过来的
    if (e.currentTarget.dataset.hasOwnProperty('item')) {
      item = e.currentTarget.dataset.item
    } else {
      item = e.detail
      this.setData({
        searchWord: item.text
      })
    }
    this.sendSearchFn(item.text)
    // 给子组件输入框赋值
    this.selectComponent("#searchCom").importVal(item.text)
  },

  /**
   * 点击了热门搜索的标签
  */
  skipSearchHot (e) {
    let item = e.detail
    if (item.jumpType) {
      console.log('跳转活动')
      wx.navigateTo({
        url: `../index/activityPage/activityPage?versionid=${item.jumpParam}`,
      })
    } else {
      wx.navigateTo({
        url: `../detail/detail?productNo=${item.jumpParam}`,
      })
    }
    
  },

  /**
   * 点击搜索按钮的方法
  */
  searchFn () {
    // 导航栏默认数据
    var navList = [            
      { name: '综合', selected: true, orderNo: 0 },
      { name: '按销量', selected: false, orderNo: 1 },
      { name: '按价格', selected: false, hasIcon: 'sortDefault', orderNo: 2 }
    ]
    this.setData({
      navList
    })
    // 如果没有搜索文字直接搜默认文字
    if (this.data.searchWord) {
      this.sendSearchFn(this.data.searchWord)
    } else {
      this.sendSearchFn(this.data.defineWord)
    }
    
  },

  /**
   * 发送搜索请求 word 需要搜索的关键字 needRecord
  */
  sendSearchFn(word) {
    // 收起软键盘
    this.selectComponent("#searchCom").cancelFocus()
    // 关闭待补全列表且清空内容
    this.setData({'completeList': []})

    // 发送搜词请求
    // 此次是点击搜索按钮发起的请求，所以页码是1
    // 排序为综合
    this.setData({
      'formData.orderNo': 0,
      'formData.productName': word.replace(/(^\s+)/g, ""),
      'formData.pageNo': 1,
      'formData.deAc': 0,
      'noMorePage': false
    })
    this.searchWordReq ()

    // if (needRecord) {
    
    // }
  },

  /**
   * 发送搜索关键字的请求
   * */ 
  searchWordReq () {
    // 如果没有更多翻页数据了，则不用再发送请求
    if (this.data.noMorePage) {
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this
    let formData = this.data.formData
    app.ajax.postApi('AppletProductSearch', formData).then(res => {
      let goodsData = res.data
      // 如果页码大于1，说明是翻页，数据要紧接着上一段记录
      if (formData.pageNo > 1) {
        wx.hideLoading()
        if (goodsData.status == 1) {
          // 有记录
          let temGoodsList = _this.data.goodsList
          _this.setData({ goodsList: temGoodsList.concat(goodsData.data) })
           
        } else {
          _this.setData({
            'formData.pageNo': 0,
            'noMorePage': true
          })
          // 无记录
          wx.showToast({
            title: '没有更多商品了！',
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
          'goodsList': goodsData.data,
          'notYetSearch': false
        })
        // scroll回到顶部
        _this.backToTop()
      } else {
        // 搜索失败
        _this.setData({
          'goodsList': [],
          'notYetSearch': false
        })

      }
      // 增加本地缓存记录
      _this.addHistoryStorage()
      wx.hideLoading()
    })
  },

  /**
   * 增加本地缓存
  */
  addHistoryStorage () {
    let historyStack = wx.getStorageSync('historyWorks') || []
    if (historyStack.length > 9) {
      historyStack.pop()
    }

    // 如果历史纪录栈中有数据，则遍历查找将其过滤掉
    if (historyStack.length) {
      historyStack = historyStack.filter(obj => {
        return obj.text != this.data.formData.productName
      })
    }

    // 在历史记录栈中添加记录
    historyStack.unshift({ 'text': this.data.formData.productName })
    // 将新搜索的字段存入本地且加到data中
    wx.setStorageSync('historyWorks', [...new Set(historyStack)])
    this.setData({
      searchHisList: wx.getStorageSync('historyWorks') || []
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
        temFormData['deAc'] = 0
      } else {
        // 给排序icon换倒序图
        temNavList[2]['hasIcon'] = 'sortDes'
        // 发送信息改为降序
        temFormData['deAc'] = 1
      }
    } else {
      // 点击了其他
      // 将价格标签icon复位
      temNavList[2]['hasIcon'] = 'sortDefault'
      // 发送信息改为升序
      temFormData['deAc'] = 0
    }

    // 点击选项卡之后页码就要重置为1
    temFormData.pageNo = 1
    // 将选择后的导航列表赋值给data
    // 将选择的提交项赋值给formData
    this.setData({
      'navList': temNavList,
      "formData": temFormData,
      'noMorePage': false
    })

    this.searchWordReq()
  },

  /**
   * 点击了清空历史按钮
  */
  clearHisTips () {
    wx.setStorageSync('historyWorks', [])
    this.setData({
      searchHisList: wx.getStorageSync('historyWorks') || []
    })
  },

  /**
   * 滑动到底启动翻页
  */
  scrolltolower () {
    let formData = JSON.parse(JSON.stringify(this.data.formData))
    formData.pageNo += 1
    this.setData({ formData })
    this.searchWordReq()
  },

  /**
   * 选择了商品
  */
  selectGood (e) {
    const { item } = e.currentTarget.dataset
    let productNo = item.productNo
    let isActivity = item.isActivity || 0
    let activityNo = item.activityNo || ''
    wx.navigateTo({
      url: `/pages/detail/detail?productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`
    })
  },

  /**
   * 回到顶部
   * */ 
  backToTop () {
    this.setData({ 'topDistance': 0 })
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})