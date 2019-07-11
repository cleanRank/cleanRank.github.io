<template id="">
  <div class="pop_box" id="successWrap">
    <div class="opa"></div>
    <div class="tip-cont">
        <div class="">
          <p class="p_txt" v-show="dialog.loadAlert.title && dialog.loadAlert.title!=''">{{dialog.loadAlert.title}}</p>
          <span class="state">{{dialog.loadAlert.msg}}</span>
        </div>
        <div class="btn-cont flex">
          <a class="btn_comsty btn_cancle js_pop_cancel" href="javascript:;" v-show="dialog.loadAlert.lBtnText && dialog.loadAlert.lBtnText != ''" @click="cancel">{{dialog.loadAlert.lBtnText}}</a>
          <a href="javascript:;" class="btn_comsty btn_get js_pop_ok" @click="confirm">{{dialog.loadAlert.rBtnText}}</a>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        dialog: "getDialogInfo",
        userInfo: "getUserInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateToast",
        "showOneBtnDialog",
        "loginTokenWanKa"
      ]),
      // 点击左侧按钮，取消，否等
      cancel () {
        let { cancelBack } = this.dialog.loadAlert
        // 隐藏当前弹框
        this.showOneBtnDialog()
        cancelBack && cancelBack()
      },
      // 点击确定
      confirm () {
        let { confCallBack } = this.dialog.loadAlert
        // 隐藏当前弹框
        this.showOneBtnDialog()
        confCallBack && confCallBack()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/scss/app";
  .tip-cont{
    @include px2rem(width, 500);
    @include px2rem(min-height, 254);
    @include px2rem(border-radius, 12);
    @include px2rem(padding, 40);
    background: #fff;
    margin: auto;
    display: flex;
    flex-direction: column;
    .state{
      color: $color444;
      @include font-dpr(30);
      @include px2rem(line-height, 42);
      @include px2rem(padding,40 0);
    }
    .p_txt{
      @include font-dpr(28);
      @include px2rem(line-height, 40);
      padding-top: 0;
      font-weight: 500;
    }
    .btn-cont{
      border: none;
      margin-top: auto;
      justify-content: space-around;
    }
    .btn-cont a{
      border:1px solid #DBDBDB;
      @include px2rem(width, 240);
      @include px2rem(border-radius, 40);
      @include px2rem(height, 76);
      @include px2rem(line-height, 76);
    }
    .btn_cancle{
      color: $color999;
      border:1px solid transparent;
    }
    .js_pop_ok{
      color: #fff;
      background: $mainColor;
      border-color: transparent !important;
    }
  }
  #successWrap{
    z-index: 9999;
  }
</style>
