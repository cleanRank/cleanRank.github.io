<template>
  <section class="mybank_wrap" v-if="isLoding">
    <div v-if="bankcartObj.length>0">
      <ul>
        <li class="bank_list" v-for="(item, i) in bankcartObj" :key="i">
          <p class="cardTypeStr_title">{{item.cardTypeStr}}</p>
          <div :class="{'myBank': item.canChange==1 && ($store.state.config.fromChannel != 'sxypApp' || ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) >= 140))}" @click="goBankcard(item.canChange)">
            <p class="bank_name bank_p">{{item.bankName}}</p>
            <p class="bank_card bank_p">{{item.bankCardNum}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="nodata_order">
      <img src="../../assets/icon/icon/blank_bank_icon.png">
      <p>暂时还没有绑定银行卡哦~</p>
    </div>
    <div class="add_addr_wrap" :class="{'position_btn':bankcartObj.length==0}" v-if="(bankcartObj.length==0 && creditline==1)">
      <router-link tag="a" to="/addbankcard" class="btnCom">去绑卡</router-link>
    </div>
  </section>
</template>
<script>
  import { mapActions } from 'vuex'
  import { getHiddenText, app } from 'lib/until'
  import Base64 from 'lib/Base64'
  export default {
    data () {
      return {
        bankcartObj: [],
        creditline: '',
        isLoding: false
      }
    },
    created () {
      this.bankCartShow()
    },
    methods: {
      ...mapActions([
        "updateUserInfo"
      ]),
      bankCartShow () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.BankCardShowSX,
          data: {
            uid: uid,
            token: token,
            rates: ''
          }
        }).then(data => {
          this.showLoad(false)
          this.isLoding = true
          let res = data.data
          let { idName, idNumber } = res.data[0]
          if (idName !='' && idNumber !='') {
            this.updateUserInfo({
              idName: idName,
              idNumber: idNumber,
              isFrom: 'api'
            })
          }
          this.$set(this.$data, 'creditline', res.creditline)
          if (res.status == "1") {
            res.data.forEach((v, i, a) => {
              if (a) {
                let len = a[i].bankCardNum.length
                a[i].bankCardNum = getHiddenText(a[i].bankCardNum, 0, len-5, 4)
              }
            })
            this.$set(this.$data, 'bankcartObj', res.data)
          } else {
//            this.showToast({msg: res.statusDetail})
          }
        })
      },
      goBankcard (canChange) {
        // 换绑卡
        let fromChannel = this.$store.state.config.fromChannel
        if (canChange == 1) {
          if (fromChannel == 'sxypApp') {
            // 客户端
            if (+(this.$store.state.config.ver.replace(/\./g, '')) >= 140) {
              let {idName, idNumber} = this.$store.state.userInfo
              let obj = {
                idNum: idNumber,
                idName: idName
              }
              app.goBindBankCard(obj)
            }
          } else {
            // h5
            // 绑卡页面
            let userId = this.$store.state.userInfo.userId
            let url = process.env.SXBTURL['ADDBANKCARD']
            let callUrl = window.location.href.indexOf('?') > -1 ? window.location.href : window.location.href + '?userId=' + userId
            const callBackUrl = Base64.encode(callUrl)
            window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
          }
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      document.querySelector('body').style.background = '$bgColor'
      next()
    },
    beforeRouteLeave (to, from, next) {
      // document.querySelector('body').style.background = '#FFF'
      next()
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  .position_btn{
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
  }
</style>
