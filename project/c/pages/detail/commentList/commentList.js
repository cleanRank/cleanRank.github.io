const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aIndex: 0,
    productNos: "",
    pageNo: 1,
    type: '',//空为全部，1为有图
    list: [],
    sumCount: 0,
    nongraphicalCount: 0,
    defaultImg: "https://sxyp.sxfqsc.com/static/img/tx.3712820.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productNos: options.productNos
    })

    this.getList(1, '')
  },
  /**
   * scroll-view触底
   */
  lower() {
    if (this.data.hasMoreData) {
      this.getList(this.data.pageNo, this.data.type)
    }

  },
  /**
   * tab拦切换
   */
  changeTab(e) {
    let index = e.target.dataset.index;
    this.setData({
      aIndex: index,
      pageNo: 1,
      list: [],
      type: index == 0 ? '' : index
    });
    // 调用接口
    this.getList(this.data.pageNo, this.data.type);
  },
  /**
   * 查询列表
   */
  getList(pageNo, type) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { productNos } = this.data;
    let formData = {
      uid,
      token,
      productNos,
      pageNo,
      type
    }
    app.ajax
      .postApi('selectProductComment', formData)
      .then(({ data: res }) => {
        wx.hideLoading()
        if (res.status == 1) {
          var res = res.data
          let productComments = res.productComments;
          if (productComments.length > 0) {
            this.setData({
              pageNo: pageNo + 1,
              hasMoreData: true,
              showNoData: false
            })
            // 处理图片成数组
            for (let i = 0; i < productComments.length; i++) {
              let picArr = []
              if (productComments[i].productCommentPicture) {
                picArr = productComments[i].productCommentPicture.split(',')
              }
              productComments[i].picArr = picArr
            }
            let list = this.data.list;
            list = list.concat(productComments);
            this.setData({
              list,
              sumCount: res.sumCount,
              nongraphicalCount: res.nongraphicalCount,
              feedbackRate: res.feedbackRate,  // 好评率
            });
          } else {
            this.setData({
              hasMoreData: false
            })
            if (pageNo == 1) {
              this.setData({
                showNoData: true
              })
            }
          }


        } else {
          this.setData({
            hasMoreData: false
          })
          if (pageNo == 1) {
            this.setData({
              showNoData: true
            })
          }
        }
      })

  },
  /**
   * 查看图片
   */
  previewImage(e) {
    let index = e.target.dataset.index;
    let index1 = e.target.dataset.index1;
    let urls = this.data.list[index].picArr;
    let current = urls[index1];
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls// 需要预览的图片http链接列表
    })
  }

})
