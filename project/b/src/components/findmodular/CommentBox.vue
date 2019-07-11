<template>
  <div class="comment-box">
    <div class="cbox-bd">
      <textarea v-model="comment" class="cbox-textarea" :maxlength="limit"></textarea>
    </div>
    <p class="cbox-limit">{{comment.length + '/' + limit}}个字</p>
    <div class="cbox-btn" :class="{canSend: comment.length}" @click="send">发送</div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      limit: {
        type: Number,
        default: 500
      }
    },
    data () {
      return {
        comment: this.value
      }
    },
    methods: {
      send () {
        this.comment.length && this.$emit('sendComment', this.comment)
      }
    },
    watch: {
      comment: {
        handler (val) {
          if (val.length > this.limit) {
            this.comment = val.substr(0, this.limit)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/app";
  .comment-box {
    @include px2rem(padding-bottom, 40);
  }
  .cbox-bd {
    position: relative;
    @include px2rem(height, 120);
    @include px2rem(border-radius, 4);
    border: 1px solid #cfcfcf;
  }
  .cbox-textarea {
    position: absolute;
    @include px2rem(padding, 8 12);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    color: $color333;
    line-height: 1.5;
  }
  .cbox-btn {
    text-align: center;
    color: #fff;
    @include font-dpr(30);
    @include px2rem(padding, 19);
    @include px2rem(border-radius, 4);
    @include px2rem(margin-top, 10);
    line-height: 1;
    background: #d6d6d6;
    &.canSend {
      background: $mainColor;
    }
  }
  .cbox-limit {
    @include px2rem(margin-top, 26);
    // position: absolute;
    // @include px2rem(right, 12);
    // @include px2rem(bottom, 11);
    text-align: right;
    @include font-dpr(22);
    color: #b2b2b2;
  }
</style>

