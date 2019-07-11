<template>
  <section class="find-wrap">
    <main class="find-main">
      <!-- <h1 class="find-title">{{staticData.name}}</h1> -->
      <div class="find-body" v-html="decodeHTML(staticData.content || '')"></div>
      <footer class="find-footer">
        <div class="read-thumb">
          <span class="readNum">阅读 {{staticData.readCnt}}</span>
          <span class="thumb" :class="{thumbed: staticData.useragree == 1}" @click="toggleAgreeState">
            {{staticData.agreeCnt}}
          </span>
        </div>
        <div class="comment-btn" @click="toggleCommentBox($event)">评论</div>
      </footer>
      <CommentBox v-if="commentBoxShowFlag" @sendComment="addUserComment" :value="commentText" />
    </main>
    <div class="find-comments" v-if="comments.length">
      <h4 class="find-comments-title"></h4>
      <FindCommentItem v-for="(comment, index) in comments" :key="'comment' + comment.id" :now="nowTime" :commentInfo="comment" @commentDel="commentDel(index)" v-if="index < 3" />
      <div class="all-comments-btnwp"><span class="all-comments-btn" @click="goAllComments">查看全部评论</span></div>
    </div>
    <div class="find-related" v-if="staticData.relatedTopics">
      <h4 class="find-related-title"></h4>
      <div class="find-related-bd" v-html="decodeHTML(staticData.relatedTopics || '')"></div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import { html_encode } from 'lib/until'
// import Vue from 'vue'
// Vue.use
export default {
  data () {
    return {
      imgTxtNo: this.$route.query.imgTxtNo,
      staticData: {},
      comments: [],
      commentPageNo: 1,
      isPageLoading: true,
      commentBoxShowFlag: false,
      commentText: '',
      isLastPageComment: false,
      isCommitting: false,
      nowTime: 0
    }
  },
  created () {
    this.fetchPageData()
  },
  beforeRouteUpdate (to, from, next) {
    this.imgTxtNo = to.query.imgTxtNo
    this.showLoad(true)
    this.fetchPageData()
    next()
  },
  methods: {
    decodeHTML (html) {
      return html_encode(html)
    },
    goAllComments () {
      this.$router.push({ path: 'findComments', query: { imgTxtNo: this.imgTxtNo } })
    },
    commentDel (index) {
      this.commentPageNo = 1
      this.fetchComment()
    },
    toggleCommentBox (e) {
      if (!this.$store.state.userInfo.token) {
        this.showToast({msg: '您尚未登录，请登录后再进行操作'})
        return
      }
      this.commentBoxShowFlag = !this.commentBoxShowFlag
      // this.commentText = ''
    },
    addUserComment (content) {
      if (this.isCommitting) {
        return true
      }
      this.isCommitting = true
      const { uid, token, mobile } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.AddUserComment,
        data: {
          token,
          uid,
          imgTxtNo: this.imgTxtNo,
          mobile,
          content
        }
      }).then(({ data: res }) => {
        this.commentBoxShowFlag = false
        this.isCommitting = false
        if (res.status == 1) {
          this.showToast({ msg: '评论成功' })
          if (this.comments.length < 3) {
            this.fetchComment()
          }
        } else {
          this.showToast({ msg: res.statusDetail })
        }
      })
    },
    toggleAgreeState () {
      if (!this.$store.state.userInfo.token) {
        this.showToast({msg: '您尚未登录，请登录后再进行操作'})
        return
      }
      if (this.isCommitting) {
        return true
      }
      this.isCommitting = true
      const { uid, token, mobile } = this.$store.state.userInfo
      let increaseNum = 1
      let url = this.$store.state.api.AgreeDiscoveryImgTxt
      if (this.staticData.useragree == 1) {
        increaseNum = -1
        url = this.$store.state.api.CancelAgreeDiscoveryImgTxt
      }
      this.$post({
        url,
        data: {
          imgTxtNo: this.imgTxtNo,
          mobile,
          uid,
          token
        }
      }).then(({ data: res }) => {
        if (res.status == 1) {
          this.$set(this.$data.staticData, 'useragree', 1 - this.staticData.useragree)
          this.$set(this.$data.staticData, 'agreeCnt', +this.staticData.agreeCnt + increaseNum)
        }
        this.isCommitting = false
      })
    },
    fetchPageData () {
      this.isPageLoading = true
      this.commentPageNo = 1
      axios.all([this.fetchContent(), this.fetchComment()]).then(() => {
        this.isPageLoading = false
        this.showLoad(false)
      })
    },
    fetchContent () {
      !this.isPageLoading && this.showLoad(true)
      console.log(this.$store.state.route.from.name)
      const { uid, token, mobile } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.QueryDiscoveryImgTxt,
        data: {
          imgTxtNo: this.imgTxtNo,
          isfromcomment: this.$store.state.route.from.name == 'FindComments' ? '1' : '',
          mobile,
          uid,
          token
        }
      }).then(({ data: res }) => {
        !this.isPageLoading && this.showLoad(false)
        if (res.status == 1) {
          const { data } = res
          data.agreeCnt = +data.agreeCnt
          this.$set(this.$data, 'staticData', data)
          this.$root.$emit('setTitle', data.name)
        }
      })
    },
    fetchComment () {
      if (this.commentPageNo > 1 && this.isLastPageComment) {
        this.showToast({ msg: 'no more' })
        return true
      }
      !this.isPageLoading && this.showLoad(true)
      let { uid, token, mobile } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.QueryUserComment,
        data: {
          imgTxtNo: this.imgTxtNo,
          pageNo: this.commentPageNo,
          uid,
          token,
          mobile
        }
      }).then(({ data: res }) => {
        !this.isPageLoading && this.showLoad(false)
        if (res.status == 1) {
          this.nowTime = +res.servertime
          const { data } = res
          if (this.commentPageNo == 1) {
            this.$set(this.$data, 'comments', data)
          } else {
            this.comments.push(data)
          }
          if (this.commentPageNo >= +res.pageCount) {
            this.isLastPageComment = true
          }
        } else if (res.status == 11) {
          this.$set(this.$data, 'comments', [])
        }
      })
    }
  },
  components: {
    FindCommentItem: resolve => { require(['./FindCommentItem'], resolve) },
    CommentBox: resolve => { require(['./CommentBox'], resolve) }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.find-wrap {
  @include px2rem(padding-bottom, 50);
  .find-main {
    @include px2rem(padding, 0 30);
    @include font-dpr(28);
    color: #666;
    background: #fff;
  }
}
// .find-body {
//   /deep/ img {
//     width: 100% !important;
//     height: auto !important;
//   }
// }

.find-footer {
  @include display-flex;
  @include justify-content(space-between);
  @include px2rem(padding, 48 0 35);
  line-height: 1; // .readNum {
  //   // vertical-align: middle;
  // }
  .thumb {
    @include px2rem(margin-left, 44);
    @include px2rem(padding-left, 38);
    display: inline-block;
    background: url("../../assets/icon/find/thumbUp.svg") no-repeat 0 50%/contain;
    &.thumbed {
      background-image: url(../../assets/icon/find/thumbedUp.svg);
    }
  }
  .comment-btn {
    @include px2rem(padding-right, 28);
    color: #145da1;
    background: url(../../assets/icon/find/edit.svg) 100% 50%/.307rem no-repeat;
  }
}

.find-comments-title,
.find-related-title {
  margin-left: auto;
  margin-right: auto;
  @include px2rem(margin-top, 38);
  @include px2rem(margin-bottom, 10);
  @include px2rem(height, 26);
  @include px2rem(width, 221);
  background: url(../../assets/icon/find/commentsTitle.png) 50% 50%/contain no-repeat;
}

.all-comments-btnwp {
  text-align: center;
}
.all-comments-btn {
  display: inline-block;
  line-height: 1;
  @include px2rem(padding, 0 25);
  @include px2rem(height, 42);
  @include px2rem(line-height, 42);
  @include px2rem(border-radius, 21);
  color: #145da1;
  border: 1px solid #145da1;
  text-align: center;
  // margin: 0 auto;
}

.find-related-title {
  @include px2rem(margin-bottom,
  35);
  background-image: url(../../assets/icon/find/relatedTitle.svg);
}

.find-related-bd {
  @include px2rem(margin,
  0 30);
}
</style>
