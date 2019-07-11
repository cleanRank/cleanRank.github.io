<template>
  <section class="find-comment-item">
    <img src="" alt="" class="fci-photo">
    <main class="fci-main">
      <h5 class="fci-hd">
        <span class="fci-hd-name">{{comment.mobile}}</span>
        <span class="fci-hd-thumb" :class="{thumbedup: comment.isagree == '1'}" @click="toggleAgreeState">{{comment.laudSum}}</span>
      </h5>
      <p class="fci-bd">{{comment.content}}</p>
      <div class="fci-ft">
        <span class="fci-time">{{comment.createDate | timeFormat(5)}}</span>
        <span class="fci-del" v-if="comment.delFlag == '1'" @click="delUserComment">删除</span>
      </div>
    </main>
  </section>
</template>

<script>
// import moment from 'moment'
// moment.locale('zh-cn')
export default {
  props: {
    commentInfo: {
      required: true,
      type: Object
    },
    now: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      comment: this.commentInfo,
      isCommitting: false
    }
  },
  methods: {
    // commentTime () {
    //   /**
    //    * @type {moment.Moment}
    //    */
    //   if (+this.now - +this.comment.createDate < 50000) {
    //     return '刚刚'
    //   }
    //   const createDate = moment(+this.comment.createDate)
    //   if (createDate.isSameOrAfter(+this.now, 'day')) {
    //     return createDate.from(+this.now)
    //   } else {
    //     return createDate.format('YYYY-MM-DD HH:mm:ss')
    //   }
    // },
    delUserComment () {
      const { uid, token, mobile } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.DelUserComment,
        data: {
          imgTxtNo: this.comment.imgTxtNo,
          commentNo: this.comment.id,
          uid,
          token,
          mobile
        }
      }).then(({ data: res }) => {
        if (res.status == 1) {
          this.showToast({ msg: '删除成功' })
          this.$emit('commentDel')
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
      let url = this.$store.state.api.AgreeUserComment
      if (this.comment.isagree == '1') {
        increaseNum = -1
        url = this.$store.state.api.CancelAgreeUserComment
      }

      this.$post({
        url,
        data: {
          imgTxtNo: this.comment.imgTxtNo,
          commentNo: this.comment.id,
          uid,
          token,
          mobile
        }
      }).then(({ data: res }) => {
        if (res.status == 1) {
          this.$set(this.$data.comment, 'laudSum', +this.comment.laudSum + increaseNum)
          this.$set(this.$data.comment, 'isagree', this.comment.isagree == '1' ? '0' : '1')
        } else {
          this.showToast({ msg: res.statusDetail })
        }
        this.isCommitting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.fci-bd {
  line-height: 1.7;
  @include font-dpr(26);
  word-wrap: break-word;
  white-space: normal;
  word-break: break-all;
}
</style>



<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.find-comment-item {
  @include display-flex;
  @include px2rem(padding, 23 30);
  .fci-photo {
    @include px2rem(width, 70);
    @include px2rem(height, 70);
    @include px2rem(border-radius, 5);
    background: url(../../assets/icon/find/photo.png) no-repeat 50% 50%/contain;
    overflow: hidden;
  }
  .fci-main {
    @include flex(1);
    @include px2rem(margin-left, 20);
  }
  .fci-hd {
    @include display-flex;
    @include justify-content(space-between);
    @include font-dpr(24);
    color: #666;
  }
  .fci-hd-thumb {
    @include px2rem(padding-left, 40);
    background: url(../../assets/icon/find/thumbUp.svg) no-repeat 0 50%/.34667rem;
    &.thumbedup {
      background-image: url(../../assets/icon/find/thumbedUp.svg);
    }
  }
  .fci-ft {
    color: #666;
    .fci-time {
      display: inline-block;
      @include px2rem(margin-right, 18);
    }
  }
}
</style>
