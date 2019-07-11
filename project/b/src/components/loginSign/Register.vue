<template id="">
  <div class="">
      <section class="registerWrap">
        <section class="formcla login_from" id="registerForm">
            <div class="inp flex">
                <!-- <label class="cell_0">手机号</label> -->
                <p class="cell_1"><input type="tel" maxlength="11" name="mobile" placeholder="输入真实手机号" id="telPhone"  data-validate="phone" autocomplete="off" v-model="iphoneNum" reg="phone"></p>
            </div>
            <valid-code type="1" ref="validCodeDom" :iphoneNum="iphoneNum" :status="status"></valid-code>
            <div class="inp flex">
                <!-- <label class="cell_0">密　码</label> -->
                <p class="pawd cell_1"><input type="password" name="password" placeholder="请输入6-12位数字和英文组合的密码"  data-validate="password" v-model="passWord" reg="password"></p>
            </div>
            <div class="inp flex">
                <!-- <label class="cell_0">邀请码</label> -->
                <p class="cell_1"><input type="text"  name="inviteCode" placeholder="请输入邀请码" v-model="inviteCode" pass="true"></p>
            </div>
            <div class="read">
              <input type="checkbox" class="agree" name="xieyi" data-required="true" data-descriptions="xieyi" checked="checked" id="checkXieyi" pass="true" v-model="isAgree">
              <label for="checkXieyi">
              我已阅读并同意
              <router-link to="/yhzcxy">《用户注册协议》</router-link>
            </label>
          </div>
            <button type="button" name="button" class="btnCom" @click="completeRegister" id="btnCom">完成注册</button>
        </section>
    </section>
    <div class="popup hide" id="successWrap">
        <div class="opa"></div>
        <div class="ts-cont">
            <div class="success"></div>
            <p>恭喜你注册成功！</p>
            <a class="btnOk" href="javascript:;">确定</a>
        </div>
    </div>
</div>
</template>
<script type="text/javascript">
  import { mapActions } from 'vuex'
  import changeBg from '@/mixin/'
  import ValidCode from './ValidCode'
  export default {
    beforeRouteLeave (to, from, next) {
      // 离开这个页面的时候必须清除掉倒计时，否则有可能造成重复计时
      window.interval && clearInterval(window.interval)
      delete window.interval
      if (to.name == 'Yhzcxy') {
        window.sessionStorage.setItem('iphoneNum', this.iphoneNum)
      } else {
        window.sessionStorage.removeItem('iphoneNum')
      }
      next()
    },
    mixins: [changeBg],
    data () {
      return {
        iphoneNum: window.sessionStorage.getItem('iphoneNum') || '',
        passWord: '',
        inviteCode: '',
        isAgree: true,
        status: ''
      }
    },
    components: {
      "valid-code": ValidCode
    },
    methods: {
      ...mapActions([
        "updateToast",
        "updateUserInfo",
        "showOneBtnDialog"
      ]),
      completeRegister () {
        if (!this.checkAll($('#registerForm'))) { return false }
        if (this.$data.inviteCode == '') {
          // if (!/^[0-9]{8}$/.test(this.$data.inviteCode)) {
          //   this.updateToast({
          //     msg: '请输入正确的邀请码'
          //   })
          //   return false
          // }
          this.updateToast({
            msg: '请输入邀请码'
          })
          return false
        }
        if (!this.$data.isAgree) {
          this.updateToast({
            msg: '请勾选已阅读并同意用户注册协议'
          })
          return false
        }
        this.status = ''
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.Regist,
          data: {
            mobile: this.$data.iphoneNum,
            password: this.$data.passWord,
            mobileValidCode: this.$refs.validCodeDom.$data.valideCode,
            inviteCode: this.$data.inviteCode,
            channel: this.$store.state.config.fromChannel
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == 1) {
            this.updateToast({msg: '恭喜你注册成功！'})
            const {token, uid, mobile, openId} = res
            window.sessionStorage.setItem('token', token)
            window.sessionStorage.setItem('mobile', mobile)
            window.sessionStorage.setItem('uid', uid)
            window.sessionStorage.setItem('userId', openId)
            res.userId = openId
            res.loginTokenWanKaState = 2
            // 接口返回的登陆信息缓存到vuex userInfo.js里面
            this.updateUserInfo({ ...res })
            if (this.$store.state.route.from.name&&window.history.length>2) {
              window.history.go(-2)
            } else {
              this.$router.push('/')
            }
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
<style media="screen">

</style>
