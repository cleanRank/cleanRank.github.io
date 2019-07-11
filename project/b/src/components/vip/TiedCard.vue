<template>
<div id="addBankCardForm" class="formList">
  <div class="formItem flex">
    <label class="formItemLable cell_0 c_777">姓名</label>
    <input class="formItemIpt cell_1 c_333" v-model.trim="name" maxlength='10' name="name" placeholder="请输入姓名" data-required="required" reg="name" data-validate="name" autocomplete="off"/>
  </div>
  <div class="formItem flex">
    <label class="formItemLable cell_0 c_777">身份证号</label>
    <input class="formItemIpt cell_1 c_333" v-model.trim="idCardNo" maxlength='18' name="idnumbers" placeholder="请输入有效证件号" data-required="required" reg="idnumbers" data-validate="idnumbers" autocomplete="off"/>
  </div>
  <div class="formItem flex">
    <label class="formItemLable cell_0 c_777">银行卡号</label>
    <input class="formItemIpt cell_1 c_333" v-model.trim="cardNo" maxlength='19' name="bankCardNo" placeholder="请输入银行卡号" data-required="required" onkeyup="value=value.replace(/[^\d]/g,'')" reg="bankCardNo" data-validate="bankCardNo" autocomplete="off"/>
  </div>
  <div class="formItem flex">
    <label class="formItemLable cell_0 c_777">手机号</label>
    <p class="formItemIpt cell_1">{{$store.state.userInfo.mobile}}</p>
    <button
     :class="['getCodeBtn', timeDown!=0?'dis_color':'']"
     :disabled="timeDown != 0"
     @click="getmobileCode">{{timeDown==0?'获取验证码':timeDown}}</button>
  </div>
  <div class="formItem flex">
    <label class="formItemLable cell_0 c_777">验证码</label>
    <input class="formItemIpt cell_1 c_333" v-model.trim="smsCode" maxlength='6' pass="true" autocomplete="off"/>
  </div>
  <div class="horizontalLine"></div>
  <button class="btnCom bindingSubmit" @click="bindBankCcard">绑定</button>
</div>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      timeDown: 0, // 倒计时
      name: '',
      idCardNo: '', // 身份证号
      cardNo: '', // 银行卡号
      smsCode: '', // 短信验证码
      uniqueCode: '' // 绑卡唯一码（预绑卡接口返回）
    }
  },
  created () {
    this.showLoad(false)
  },
  methods: {
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
    bindBankCcard () {
      // 确认绑卡
      if (!this.checkAll($('#addBankCardForm'))) { return false }
      let reg = /^[0-9]{6}$/
      if (!this.smsCode) {
        this.showToast({msg: '请输入短信验证码'})
      } else if (!reg.test(this.smsCode)) {
        this.showToast({msg: '短信验证码错误!'})
      } else {
        this.showLoad(true)
        let {uid, token, mobile} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.sureBindCard,
          data: {
            uid,
            token,
            phoneNo: mobile,
            cardNo: this.cardNo,
            name: this.name,
            idCardNo: this.idCardNo,
            uniqueCode: this.uniqueCode,
            smsCode: this.smsCode
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == 1) {
            this.showToast({ msg: '绑卡成功' })
            setTimeout(() => {
              window.history.go(-1)
            }, 1000)
          } else {
            this.showToast({ msg: res.statusMessage })
          }
        })
      }
    },
    getmobileCode () {
      // 获取短信验证码
      if (!this.checkAll($('#addBankCardForm'))) { return false }
      this.showLoad(true)
      let {uid, token, mobile} = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.readyBindCard,
        data: {
          uid,
          token,
          phoneNo: mobile,
          cardNo: this.cardNo,
          name: this.name,
          idCardNo: this.idCardNo
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == 1) {
          this.showToast({msg: '验证码发送成功'})
          this.uniqueCode = res.data.uniqueCode
          this.timeDwon()
        } else {
          this.showToast({ msg: res.statusMessage })
        }
      })
    }
  }
}
</script>
