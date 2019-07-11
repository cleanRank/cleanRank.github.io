<template>
  <section class="registerWrap">
    <section class="formcla login_from" id="resetPassWrodForm">
        <div class="inp flex">
            <!-- <label class="cell_0">手机号</label> -->
            <p class="cell_1"><input type="text" maxlength="11" name="mobile" placeholder="输入真实手机号" id="telPhone"  data-validate="phone" autocomplete="off" v-model="iphoneNum" maxLength='11' reg="phone"></p>
        </div>
        <valid-code type="2" ref="validCodeDom" :iphoneNum="iphoneNum" :status="status"></valid-code>
        <div class="inp flex">
            <!-- <label class="cell_0">新密码</label> -->
            <p class="pawd cell_1"><input type="password" name="password" placeholder="请输入6-12位数字和英文组合的密码"  data-validate="newPassword" v-model="newPw" reg="newPassword"></p>
        </div>
        <button type="button" name="button" class="btnCom" @click="submitPw" id="btnCom">提交</button>
    </section>
  </section>
</template>
<script type="text/javascript">
  import { mapActions } from 'vuex'
  import changeBg from '@/mixin/'
  import ValidCode from './ValidCode'
  export default {
    data () {
      return {
        newPw: '',
        iphoneNum: '',
        status: ''
      }
    },
    mixins: [changeBg],
    beforeRouteLeave (to, from, next) {
      // 离开这个页面的时候必须清除掉倒计时，否则有可能造成重复计时
      window.interval && clearInterval(window.interval)
      delete window.interval
      next()
    },
    components: {
      "valid-code": ValidCode
    },
    methods: {
      ...mapActions([
        "updateToast"
      ]),
      submitPw () {
        if (!this.checkAll($('#resetPassWrodForm'))) { return false }
        this.status = ''
        return this.$post({
          url: this.$store.state.api.FindPwd,
          data: {
            mobile: this.$data.iphoneNum,
            password: this.$data.newPw,
            mobileValidCode: this.$refs.validCodeDom.$data.valideCode,
            channel: ''
          }
        }).then(data => {
          let res = data.data
          if (res.status == 1) {
            window.history.go(-1)
          } else {
            this.status = res.status
            this.updateToast({
              msg: res.statusDetail
            })
          }
        })
      }
    },
    created () {
      this.showLoad(false)
    }
  }
</script>
