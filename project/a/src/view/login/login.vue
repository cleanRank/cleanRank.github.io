<template>
  <div class="page-login">
    <div class="login-inner">
      <div class="login-pic"></div>
      <div class="login-box">
        <img src="../../assets/img/login_logo.png" alt class="login-logo" />
        <h3 class="title">
          <div>欢迎登录陌玩聊天系统</div>
          <div>13812345678</div>
        </h3>
        <div class="input-box">
          <img src="../../assets/img/login_account.png" alt class="input-icon" />
          <el-input onmousewheel="return false" placeholder="请输入账号" maxlength="11" v-model="phone"></el-input>
        </div>
        <div class="input-box">
          <img src="../../assets/img/login_password.png" alt class="input-icon" />
          <el-input type="password" placeholder="请输入密码" oninput="if(value.length>20)value=value.slice(0,20)"
            v-model="password"></el-input>
        </div>
        <!-- <el-checkbox v-model="checked">自动登录</el-checkbox> -->
        <!-- <w-button value="登录" @click="login"></w-button> -->
        <div class="login" @click="login">登录</div>
        <!-- <div class="login-bottom">
          <span>帮助</span>
          <el-divider direction="vertical"></el-divider>
          <span>隐私</span>
          <el-divider direction="vertical"></el-divider>
          <span>条款</span>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { tracker } from "lib/analytics"
import { isPwd } from "lib/until"
export default {
  name: "login",
  data () {
    return {
      phone: "13812345678",
      password: "123789"
      // checked: false
    }
  },
  mounted () {},
  components: {},
  methods: {
    checkinput () {
      if (!this.phone) {
        this.$message({
          message: "请输入账号"
        })
        return false
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        // } else if (!/^\w{11}$/.test(this.phone)) {
        this.$message({
          message: "手机号码格式不正确"
        })
        return false
      } else if (!this.password) {
        this.$message({
          message: "请输入密码"
        })
        return false
      } else if (this.password.trim().length < 6 || !isPwd(this.password)) {
        this.$message({
          message: "密码格式不正确"
        })
        return false
      }
      return true
    },
    login () {
      if (!this.checkinput()) return
      let params = {
        mobile: this.phone.trim(),
        pwd: this.password.trim(),
        channel: "talk",
        platform: 2
      }
      this.$http.login(params).then(res => {
        if (res.appCode === "S0000") {
          tracker.setToken(res.result.token)
          this.$router.push({ path: 'home' })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .page-login {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    input::-ms-clear {
      display: none;
    }

    input::-ms-reveal {
      display: none;
    }

    .login-inner {
      display: flex;
      justify-content: center;

      .el-button {}

      .login-pic {
        width: 660px;
        height: 640px;
        background: url("../../assets/img/login_pic.png") no-repeat;
        margin-right: 100px;
      }

      .login-box {
        background: rgba(249, 249, 249, 1);
        width: 480px;
        height: 640px;
        padding: 61px 55px 0 59px;
        box-sizing: border-box;

        .login-logo {
          width: 58px;
          height: 58px;
        }

        .title {
          font-size: 20px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: 28px;
          letter-spacing: 1px;
          margin: 39px 0 40px 0;
        }

        .input-box {
          box-sizing: border-box;
          margin: 35px 0 15px 0;
          position: relative;

          .input-icon {
            position: absolute;
            top: 13px;
            left: 8px;
            width: 14px;
            height: 14px;
            z-index: 100;
          }
        }

        .el-input {
          .el-input__inner {
            border: 1px solid #dcdfe6;
            padding-left: 30px;
          }

        }

        .el-checkbox__label,
        .el-checkbox {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #fcc619;
          border-color: #fcc619;
        }

        .login {
          width: 366px;
          height: 45px;
          text-align: center;
          line-height: 45px;
          font-size: 16px;
          border-radius: 4px;
          margin-top: 40px;
          letter-spacing: 1px;
          color: #fff;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          background: linear-gradient(302deg,
              rgba(255, 165, 45, 1) 0%,
              rgba(252, 198, 25, 1) 100%);
          box-shadow: 0px 6px 12px 0px rgba(255, 128, 0, 0.15);
        }

        .login-bottom {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 12px;
          margin-top: 145px;
          text-align: center;

          span {
            padding: 0 8px;
          }

          .el-divider {
            background: rgba(153, 153, 153, 1);
          }
        }
      }

      .el-input__prefix i:before {
        font-size: 18px;
      }
    }
  }

</style>
