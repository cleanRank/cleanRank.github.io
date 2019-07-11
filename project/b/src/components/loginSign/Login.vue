<template>
  <section class="loginWrap">
   <div class="formcla login_from" id="loginForm">
       <div class="inp flex">
           <!--<label class="cell_0">手机号</label>-->
           <p class="cell_1"><input type="tel" maxlength="11" name="uname" reg="phone" autofocus="autofocus" placeholder="请输入手机号码" data-validate="phone" autocomplete="off" v-model="uname"></p>
       </div>
       <div class="inp flex">
           <!--<label class="cell_0">密　码</label>-->
           <p class="pawd cell_1"><input type="password" reg="password" name="password" data-validate="password" autocomplete="off" placeholder="请输入密码" v-model="passWord"></p>
       </div>
       <div class="wj_register flex">
         <router-link to="/register" class="cell_1 register_btn">注册</router-link>
         <router-link to="/foregetPw" class="cell_1 forget_btn">忘记密码</router-link>
       </div>
       <button class="btnCom" @click="login" type="button" id="btnCom">登录</button>
      <!-- <button class="btnCom" @click="quickRegister" type="button" id="btnCom2"></button> -->
   </div>
</section>

</template>
<script type="text/javascript">
  import { mapGetters, mapActions } from 'vuex'
  import changeBg from '@/mixin/'
  import Base64 from 'lib/Base64'
  export default {
    data () {
      return {
        uname: '',
        passWord: ''
      }
    },
    mixins: [changeBg],
    created () {
      this.showLoad(false)
    },
    computed: {
      ...mapGetters({
        dialog: "getDialogInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateToast",
        "updateUserInfo"
      ]),
      login () {
        if (!this.checkAll($('#loginForm'))) { return false }
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.LoginH5,
          data: {
            uname: this.$data.uname,
            password: Base64.encode(this.$data.passWord)
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status === "1") {
            const {token, uid, mobile, openId} = res
            window.sessionStorage.setItem('token', token)
            window.sessionStorage.setItem('mobile', mobile)
            window.sessionStorage.setItem('uid', uid)
            window.sessionStorage.setItem('userId', openId)
            res.userId = openId
            res.loginTokenWanKaState = 2
            // 接口返回的登陆信息缓存到vuex userInfo.js里面
            this.updateUserInfo({ ...res })
            if (this.$store.state.route.from.name) {
              if (this.$store.state.route.from.name == 'Moviepage2') {
                this.$router.push('/moviepage2')
              } else {
                window.history.go(-1)
              }
            } else {
              this.$router.push('/')
            }
          } else {
            this.updateToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
