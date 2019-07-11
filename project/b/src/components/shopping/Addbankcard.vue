<template>
  <section class="addbank_wrap" >
    <p class="crossBorder_txt position_cross">
      <span class="font14">*请绑定持卡人本人的银行卡</span>
      <span>（此卡仅作为商城消费使用）</span></p>
    <div class="" id="addBankCardForm" >
      <div class="inp">
        <p><input type="text" class="firstyz" v-model.trim="idName" :disabled="disabled" name="bankcardname" placeholder="输入您的姓名" maxlength="10" data-required="required" reg="name" data-validate="name" autocomplete="off" ></p>
      </div>
      <div class="inp">
        <p><input type="text" class="firstyz" v-model.trim="idNumber" :disabled="disabled" name="idnumber" placeholder="输入您的身份证号" data-required="required" maxlength="18" reg="idnumbers" data-validate="idnumbers" autocomplete="off"></p>
      </div>
      <div class="inp">
        <p><input type="tel" class="firstyz" v-model.trim="bankcardno" name="bankcardno" placeholder="输入您的储蓄卡号"  data-required="required" maxlength="19" onkeyup="value=value.replace(/[^\d]/g,'')" reg="bankCardNo" data-validate="bankCardNo" autocomplete="off"></p>
      </div>
      <div class="inp">
        <p><input type="tel" class="firstyz" v-model.trim="bankphone" name="bankphone" maxlength="11" placeholder="输入您的银行预留手机号" data-required="required" data-validate="bankPhone" reg="bankPhone" autocomplete="off"></p>
      </div>
      <div class="support_show">
        <router-link tag="a" to="/supportBankList" >查看支持的银行卡</router-link>
      </div>
      <button class="btnCom" @click="bindEvent">确定</button>
    </div>
    <Authpay></Authpay>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { getHiddenText, IdentityCodeValid } from 'lib/until'
  import shoppingmixin from 'components/shopping/mixin'
  import Authpay from 'components/shopping/cashierFloor/Authpay'
  export default {
    mixins: [shoppingmixin],
    data () {
      return {
        idName: '',
        idNumber: '',
        idNumber2: '',
        bankcardno: '',
        bankcardno2: '',
        bankphone: '',
        bankList: [],
        disabled: false,
        isAddbankcard: this.$store.state.route.query.isAddbankcard || ''
      }
    },
    beforeRouteLeave (to, from, next) {
      let _t = this
      if (to.name == 'SupportBankList') {
        if ((_t.bankcardno != '' || _t.bankphone != '') && _t.userInfo.isFrom != 'api') {
          _t.updateUserInfo({
            idName: _t.idName,
            idNumber: _t.idNumber,
            bankList: {
              bankcardno: _t.bankcardno,
              bankphone: _t.bankphone
            }
          })
        } else {
          _t.updateUserInfo({
            bankList: {
              bankcardno: _t.bankcardno,
              bankphone: _t.bankphone
            }
          })
        }
      } else {
        _t.updateUserInfo({
          upFrom: '',
          idName: '',
          idNumber: '',
          bankList: {
            bankcardno: '',
            bankphone: ''
          }
        })
      }
      next()
    },
    components: {
      Authpay
    },
    created () {
      this.showLoad(false)
      this.addbankShow()
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateUserInfo",
        "updateToast"
      ]),
      addbankShow () {
        if (this.userInfo.upFrom == 'mybankcart') {
          this.$store.state.route.meta.title = '更换银行卡'
        } else {
          this.$store.state.route.meta.title = '添加银行卡'
        }
        if (this.userInfo.isFrom == 'api') {
          let len = this.userInfo.idNumber.length
          this.idName = this.userInfo.idName
          this.idNumber = getHiddenText(this.userInfo.idNumber, 3, len-5)
          this.disabled = true
        } else {
          this.idName = this.userInfo.idName
          this.idNumber = this.userInfo.idNumber
        }
        if (this.userInfo.bankList&&this.userInfo.bankList != '') {
          this.bankcardno = this.userInfo.bankList.bankCardNum2 || this.userInfo.bankList.bankcardno
          this.bankphone = this.userInfo.bankList.bankphone
        }
        this.$set(this.$data, 'bankList', this.userInfo.bankList)
        this.$set(this.$data, 'idName', this.idName)
        this.$set(this.$data, 'idNumber', this.idNumber)
      },
      bindEvent () {
        if (!this.checkAll($('#addBankCardForm'))) { return false }
        let { uid, token } = this.userInfo
        if (this.idNumber.indexOf('*') >-1) {
          this.idNumber2 = this.userInfo.idNumber
        } else {
          if (!IdentityCodeValid(this.idNumber)) {
            this.updateToast({msg: '请输入正确身份证号码'})
            return false
          }
          this.idNumber2 = this.idNumber
        }
        let data = {
          uid: uid,
          token: token,
          idName: this.idName,
          bankphone: this.bankphone,
          idNumber: this.idNumber2,
          bankcardno: this.bankcardno
        }
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.WeiPayBindCardNew,
          data: data
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status === "1") {
            // 判断是否是绑卡/换卡
            if (this.isAddbankcard) {
              // 绑卡成功，去支付
              this.paymenInfo(0)
            } else {
              window.history.go(-1)
            }
          } else {
            this.updateToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
