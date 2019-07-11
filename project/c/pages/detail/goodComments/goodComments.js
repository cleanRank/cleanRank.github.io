Component({
  properties: {
    comments: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal.length > 0) {
          this.initCommentsData(newVal)
        }
      }
    },
    sumCount: {
      type: String,
      value: '0'
    },
    feedbackRate: {
      type: String,
      value: '0'
    }
  },
  data: {
    commentsList: []
  },
  methods: {
    initCommentsData(newVal) {
      newVal.forEach((item) => {
        if (item.productCommentPicture) {
          item.productCommentPicture = item.productCommentPicture.split(',')
        } else {
          item.productCommentPicture = []
        }
      })
      this.setData({
        commentsList: newVal
      })
    },
    // 去评论详情
    goCommentList() {
      if (this.data.commentsList.length > 0) {
        this.triggerEvent('tapCommentList')
      }
    },
    // 图片预览
    previewImg(e) {
      var imgUrl = e.currentTarget.dataset.url
      var index = e.currentTarget.dataset.index
      var urls = this.data.commentsList[index].productCommentPicture
      wx.previewImage({
        current: imgUrl, // 当前显示图片的http链接
        urls
      })
    }
  }
})
