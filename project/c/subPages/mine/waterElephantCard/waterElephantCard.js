const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aIndex:0,
    unavailableSxtCount:0,// 不可用数量
    usableSxtCount:0,// 可用数量
    list:[],
    showNoCard:false,
    pageNo:1,
    hasNoData: false,
    usableImgUrl:[
      '/images/card/zhuxiao.png',
      '',
      '/images/card/used.png',
      '/images/card/lost.png',
      '/images/card/dongjie.png'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //可用的是一次性给完数据，不可用的通过分页给
    this.setData({
      aIndex: 0,
      unavailableSxtCount: 0,// 不可用数量
      usableSxtCount: 0,// 可用数量
      list: [],
      showNoCard: false,
      pageNo: 1,
      hasNoData: false
    })
    // 查询水象通数量
    this.querySxtCount();
    // 查询可用卡数据
    this.querySxtCardList(1);
  },
  /**
   * tab拦切换
   */
  changeTab(e){
    let index = e.target.dataset.index;
    // 先清空数据
    this.setData({
      aIndex: index,
      list: [],
      pageNo:1,
      hasNoData:false
    });
    // 查询水象通数量
    this.querySxtCount();
    // 调用接口
    if (this.data.aIndex == 0) {
      this.querySxtCardList(1);
    } else if (this.data.aIndex == 1) {
      this.querySxtCardList(0, this.data.pageNo);
    }
  },

  /**
   * 去绑卡
   */
  goPage(){
    wx.navigateTo({
      url: "/subPages/mine/waterElephantCard/bindCard/bindCard"
    })
  },
  /**
   * 查询水象通数量接口
   */
  querySxtCount() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token
    }
    app.ajax.postApi('querySxtCount', formData).then(({data:res})=>{
      wx.hideLoading()
      let data = res.data;
      if(res.status===1){
        this.setData({
          unavailableSxtCount: data.unavailableSxtCount,
          usableSxtCount: data.usableSxtCount,
          showNoCard:true
        })
      }
    })
  },
  /**
   * 查询水象通列表接口
   */
  querySxtCardList(usableStatus, currentPage) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token,
      usableStatus,//1(可用)，0（不可用）
      currentPage: currentPage||'1'//页码
    }
    app.ajax.postApi('querySxtCardList', formData).then(({data:res}) => {
      wx.hideLoading()
      let data = res.data;
      for(let i=0;i<data.length;i++){
        let leftAmount = data[i].leftAmount.toFixed(2);
        let leftAmountArr = leftAmount.split(".");
        data[i].integer = leftAmountArr[0];
        data[i].part = leftAmountArr[1];
      }

      if (res.status === 1) {
        this.setData({
          list:this.data.list.concat(data)
        })
      }else{
        // 没数据了
        this.setData({
          hasNoData:true
        })
      }
    })
  },
  /**
   * 触底事件
   */
  lower(){
    if (this.data.aIndex == 1){
      if (this.data.hasNoData){
        return;
      }
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      this.querySxtCardList(0, this.data.pageNo)
    }
    
    
  }


})