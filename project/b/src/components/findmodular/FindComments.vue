<template>
  <div class="find-comments">
    <FindCommentItem v-for="(comment, index) in comments" :key="'comment' + comment.id" :now="nowTime" :commentInfo="comment" @commentDel="commentDel(index)" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgTxtNo: this.$route.query.imgTxtNo,
      comments: [],
      commentPageNo: 1,
      isFetchingData: false,
      isLastPageComment: false,
      nowTime: 0,
      isFirstToast: true
    }
  },
  created () {
    this.fetchComment()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll, false)
  },
  methods: {
    commentDel (index) {
      this.commentPageNo = 1
      this.fetchComment(true)
    },
    isBottomReached () {
      if (document.body.scrollHeight > document.documentElement.clientHeight) {
        return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
      } else {
        return false
      }
    },
    onScroll () {
      if (this.isBottomReached()) {
        this.fetchComment()
      }
    },
    fetchComment (forceFetch) {
      if (this.isFetchingData) {
        return true
      }
      if (!forceFetch && this.isLastPageComment) {
        if (this.isFirstToast) {
          this.showToast({ msg: '没有更多数据' })
          this.isFirstToast = false
        }
        return true
      }
      this.isFetchingData = true
      this.showLoad(true)
      return this.$post({
        url: this.$store.state.api.QueryUserComment,
        data: {
          imgTxtNo: this.imgTxtNo,
          pageNo: this.commentPageNo,
          mobile: this.$store.state.userInfo.mobile
        }
      }).then(({ data: res }) => {
        this.showLoad(false)
        this.isFetchingData = false
        this.nowTime = +res.servertime
        const { data } = res
        if (this.commentPageNo == 1) {
          this.$set(this.$data, 'comments', data)
        } else {
          this.comments.push(...data)
        }
        if (this.commentPageNo >= +res.pageCount) {
          this.isLastPageComment = true
        } else {
          this.commentPageNo += 1
        }
      })
    }
  },
  components: {
    FindCommentItem: resolve => { require(['./FindCommentItem'], resolve) }
  }
}
</script>

