<template lang="html">
<div class="">
  <div class="y-popup" v-show="isShowTransPwd">
    <div class="y_opa" @click="closePwd"></div>
    <div class="confirm_password confirmPos">
      <p class="yp_tit yp_tit_mb flex" id="id_verify_code_title"><span class="cell_1">使用虚拟资产，需验证手机验证码</span><span class="close_btn cell_0" @click.stop="closePwd"></span></p>
      <div class="ypawdForm" id="psdList">
        <input readonly="" type="text" maxlength="1" :value="pwd1" disabled="disabled" id="pw1">
        <input readonly="" type="text" maxlength="1" :value="pwd2" disabled="disabled" id="pw2">
        <input readonly="" type="text" maxlength="1" :value="pwd3" disabled="disabled" id="pw3">
        <input readonly="" type="text" maxlength="1" :value="pwd4" disabled="disabled" id="pw4">
        <input readonly="" type="text" maxlength="1" :value="pwd5" disabled="disabled" id="pw5">
        <input readonly="" type="text" maxlength="1" :value="pwd6" disabled="disabled" id="pw6">
      </div>
      <p class="getYzmNum c_666" v-if="timeDown"><span class="c_blue">{{timeDown}}</span>秒后可重新获取</p>
      <p class="getYzmNum c_blue" v-else @click="sendValid()">重新获取验证码</p>
      <!-- <div class="tl_error">
        <div class="tl_errorr tl_errorr_w" v-show="errorTipsShow" id="id_div_error">
          <span class="icon-ti"></span>
          <p>交易密码错误</p>
        </div>
        <div class="tl_errorra" tag="div" @click="forgetPassword" id="id_div_forgetpsd">
          <a href="javascript:;">
            忘记密码?
          </a>
        </div>
      </div> -->
      <ul class="ykeyboard">
        <li class="flex">
          <span class="cell_1 span_number" @click="tapkeyboard(1)"><a href="javascript:;"><font color="#000000">1</font><i></i></a></span>
          <span class="cell_1 borlr span_number" @click="tapkeyboard(2)"><a href="javascript:;"><font color="#000000">2</font><i>ABC</i></a></span>
          <span class="cell_1 span_number" @click="tapkeyboard(3)"><a href="javascript:;"><font color="#000000">3</font><i>DEF</i></a></span>
        </li>
        <li class="flex">
          <span class="cell_1 span_number" @click="tapkeyboard(4)"><a href="javascript:;"><font color="#000000">4</font><i>GHI</i></a></span>
          <span class="cell_1 borlr span_number" @click="tapkeyboard(5)"><a href="javascript:;"><font color="#000000">5</font><i>JKL</i></a></span>
          <span class="cell_1 span_number" @click="tapkeyboard(6)"><a href="javascript:;"><font color="#000000">6</font><i>MNO</i></a></span>
        </li>
        <li class="flex">
          <span class="cell_1 span_number" @click="tapkeyboard(7)"><a href="javascript:;"><font color="#000000">7</font><i>PQRS</i></a></span>
          <span class="cell_1 borlr span_number" @click="tapkeyboard(8)"><a href="javascript:;"><font color="#000000">8</font><i>TUV</i></a></span>
          <span class="cell_1 span_number" @click="tapkeyboard(9)"><a href="javascript:;"><font color="#000000">9</font><i>WXYZ</i></a></span>
        </li>
        <li class="flex">
          <span class="cell_1 spanbg "></span>
          <span class="cell_1 borlr span_number" @click="tapkeyboard(0)"><a href="javascript:;"><font color="#000000">0</font></a></span>
          <span class="cell_1 delete" @click="deletePwd()"><b></b></span>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import mixin from 'components/shopping/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      isShowTransPwd: true,
      errorTipsShow: false,
      timeDown: 0,
      pwdLength: 0,
      pwd1: '',
      pwd2: '',
      pwd3: '',
      pwd4: '',
      pwd5: '',
      pwd6: ''
    }
  },
  created () {
    this.timeDwon()
  },
  props: {
     // code 【5】借款 【4】收银台支付 【6】确认订单水象通支付
    monthnum: {
      required: false,
      type: Number
    },
    rates: {
      required: false,
      type: Number
    },
    code: {
      required: false,
      type: String
    },
    rendarrTemp: {
      required: false,
      type: Object
    }
  },
  methods: {
    // 倒计时,重新获取验证码
    sendValid () {
      if (this.code == 6) {
        // 水象通预绑卡
        this.sxtPrePay(1).then(() => {
          if (this.timeDown>0) {
            this.timeDwon()
          }
        })
      } else {
        this.sendValidCode('1', this.code).then(() => {
          if (this.timeDown>0) {
            this.timeDwon()
          }
        })
      }
    },
    // 点击数字键盘
    tapkeyboard (num) {
      let pwdLength = parseInt(this.$data.pwdLength)
      pwdLength++
      if (pwdLength < 7) {
        this.$set(this.$data, 'pwdLength', pwdLength)
        this.$set(this.$data, 'pwd'+pwdLength, num + '')
        if (pwdLength >= 6) {
          let {pwd1, pwd2, pwd3, pwd4, pwd5, pwd6} = this.$data
          let password = pwd1 + pwd2 + pwd3 + pwd4 + pwd5 + pwd6
          if (this.monthnum) {
            // 校验短信验证码
            this.verifyPwd(password)
          } else {
            this.$emit('pwdSuccess', password)
          }
          return false
        }
      }
    },
    // 校验支付密码
    verifyPwd (password) {
      const { token, uid, mobile, userId } = this.$store.state.userInfo
      this.$store.commit('SHOWLOADINGFLAG', true)
      return this.$post({
        url: this.$store.state.api.VerifyPwd,
        data: {
          token,
          tradePwd: password,
          uid,
          mobile,
          monthnum: this.monthnum,
          rates: this.rates,
          centerUserId: userId,
          orderId: window.sessionStorage.getItem('orderId')
        }
      }).then(data => {
        let res = data.data
        if (res.status == 1) {
          this.$emit('pwdSuccess')
          this.clearPwd()
        } else {
          this.showToast({msg: res.statusDetail})
          this.$store.commit('SHOWLOADINGFLAG', false)
          this.clearPwd()
        }
      })
    },
    // 重置密码
    clearPwd () {
      this.$set(this.$data, 'pwdLength', 0)
      for (let i = 1; i<7; i++) {
        this.$set(this.$data, 'pwd'+i, '')
      }
    },
    // 倒计时
    timeDwon () {
      this.$set(this.$data, 'timeDown', 59)
      window.interval = setInterval(() => {
        if (this.$data.timeDown <= 0) {
          clearInterval(window.interval)
          return false
        }
        let second = parseInt(this.$data.timeDown) - 1
        this.$set(this.$data, 'timeDown', second)
      }, 1000)
    },
    // 删除密码
    deletePwd () {
      let pwdLength = parseInt(this.$data.pwdLength)
      pwdLength--
      if (pwdLength < 0) {
        return false
      } else {
        this.$set(this.$data, 'pwdLength', pwdLength)
        this.$set(this.$data, 'pwd'+(pwdLength+1), '')
      }
    },
    // 关闭密码框
    closePwd () {
      this.clearPwd()
      this.$emit('closePwd')
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
@import "../../assets/scss/app";
.col98{
  color: #989898;
}
.col48{
  color: #484848;
}
 .y-popup,.ts-pop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  .y_opa,.opa_bgno{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
  }
  .opa_bgno{
    background: none;
  }
}
.confirmPos{
  position: fixed;
  left: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 22;
  width: 100%;
  @include px2rem(border-radius, 20 20 0 0);
}
.yp_tit{
  @include font-dpr(32);
  @extend .col48;
  @include lh(108, 108);
  // border-bottom: 1px solid $colddd;
  box-shadow:0px 0.05rem 0.1rem 0px rgba(0,0,0,0.12);
  text-align: center;
}
.te{
  @include font-dpr(28);
  @extend .col98;
  @include px2rem(padding-bottom, 55);
  @include px2rem(padding-left, 50);
  @include px2rem(line-height, 48);
  display: block;
}
.getYzmNum{
  text-align: center;
  line-height: 2.3;
  @include font-dpr(24);
}
//输入密码 键盘
.ypawdForm{
  // @include px2rem(height, 93);
  @include px2rem(margin, 40 30 30);
  // border: 1px solid #8c8c8c;
  @extend .boradius;
  text-align: center;
  input{
    @include px2rem(height, 78);
    vertical-align: middle;
    @include px2rem(width, 78);
    @include px2rem(margin-right, 22);
    border: none;
    text-align: center;
    // border: 2px solid #DADADA;
    border-bottom: 1px solid #ccc;
    // @include px2rem(border-radius, 8);
    background: transparent;
    @include font-dpr(60);
    color: #333;
    &:last-child{
      margin-right: 0;
      // border: none;
    }
  }
}
.ykeyboard{
  text-align: center;
  background: #ffffff;
  // @include px2rem(margin-top, 44);
  li{
    &:nth-of-type(1){
      // border-top: 1px solid #d7e0e6;
    }
    border-bottom: 1px solid #d7e0e6;
    @include font-dpr(0);
    color: #000000;
    width: 100%;
    span{
      width: 33.3%;
      @include font-dpr(60);
      @include display-inline();
      @include px2rem(padding, 18 0);
      border-right: 1px solid #d7e0e6;
      box-sizing: border-box;
      &:last-child{
        border-color: transparent;
      }
      a{
        display: block;
      }
    }
    .delete{
      background: #d2d5db;
      b{
        @include px2rem(width, 46);
        @include px2rem(height, 34);
        display: inline-block;
        background: url("../../assets/icon/icon/delete.jpg") no-repeat;
        background-size: contain;
      }
    }
    .spanbg{
      background: #d2d5db;
    }
    i{
      display: block;
      @include font-dpr(24);
      font-style: normal;
      color: #232323;
    }
  }
}
.tl_errorra{
    // float:right;
    @include px2rem(padding, 44 30 0 0);
    // @include px2rem(height,50);
    @include px2rem(line-height,24);
    text-align:right;
    a{
        @include font-dpr(24);
        color: $mainColor;
    }
}
// 关闭按钮
.close_btn{
  display: block;
  @include px2rem(width, 30);
  background: url(../../assets/icon/icon/closeStageBox.png) center no-repeat;
  @include px2rem(background-size, 30 30);
  @include px2rem(margin-right, 30);
}
</style>
