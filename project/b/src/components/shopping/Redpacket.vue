<template>
<section class="hbWrap">
  <div class="wrapper" v-if="radList.length>0">
      <ul class="couponsBox">
      <!-- <li  class="use_item" v-for="(radList, index) in radList" :key="index" >
        <div class="redBg">
          <p class="p_top flex"> <span class="span01 cell_1">{{radList.parValue}}</span> <span class="span02 cell_0">{{radList.showName}}</span> </p>
          <p class="p_bottom flex"> <span class="cell_1" v-if="!radList.minOrderMoney||radList.minOrderMoney==0.00"></span> <span class="cell_1" v-else>满{{radList.minOrderMoney}}立减</span><span class="cell_0">{{radList.otherRuleDesc}}</span> </p>
        </div>
        <p class="term flex"> <span class="cell_1">有效期至{{radList.endTime | timeFormat(1)}}</span> <span class="cell_0" v-if="radList.useStatus==2">未使用</span> </p>
      </li> -->
      <li class="couponsItem flex couponsOk" v-for="(radList, i) in radList" :key="i" @click="bindEvent(radList)">
          <img class="couponsLeftImg" src="../../assets/icon/member/coupons-ok.png">
          <div class="couponsDetail flex">
            <p class="couponsMoney">
              <span class="couponsMoneyNum">{{radList.parValue}}</span>
              <span class="couponsScope">元</span>
              <span v-if="!radList.minOrderMoney||radList.minOrderMoney==0.00"></span>
              <span v-else class="couponsScope">（满{{radList.minOrderMoney}}-{{radList.parValue}})</span>
            </p>
            <p class="couponsTit">{{radList.showName}}</p>
            <div class="couponsTimeLimit">
              <p class="couponsTimeLimitTxt">{{radList.startTime | timeFormat(6)}}-{{radList.endTime | timeFormat(6)}}</p>
              <p class="couponsRule" v-if="radList.otherRuleDesc" @click.stop="viewRules(radList)" :class="radList.isshowRuleDesc ? 'couponsRuleImgTop' : 'couponsRuleImgBot'">
                优惠券使用规则<img class="couponsRuleImg" src="../../assets/icon/member/rule-ok.png" v-if="radList.useStatus==2">
                <img class="couponsRuleImg" src="../../assets/icon/member/rule-no.png" v-else>
              </p>
            </div>
          </div>
          <div class="couponsRuleDetail" v-if="radList.otherRuleDesc && radList.isshowRuleDesc">
            <img class="couponsRuleDetailLine" src="../../assets/icon/member/coupons-line.png">
            <div class="couponsRuleDetailTxt">{{radList.otherRuleDesc}}</div>
          </div>
        </li>
    </ul>
    <p class="nouse_reb"><input type="button" value="不使用红包" class="btnCom"  @click="bindEvent(0)" /></p>
  </div>
</section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        radList: [],
        selectedRad: []
      }
    },
    created () {
      this.showLoad(false)
      this.myCouponShow()
    },
    computed: {
      ...mapGetters({
        goodsInfo: "getGoodsInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateGoodsInfo"
      ]),
      myCouponShow () {
        if (this.goodsInfo.radJsons) {
          let data = this.goodsInfo.radJsons
          this.$set(this.$data, 'radList', data)
        }
      },
      viewRules (radList) {
        radList.isshowRuleDesc = !radList.isshowRuleDesc
      },
      bindEvent (val, e) {
        if (val == 0) {
          this.selectedRad = {
            redBagId: '',
            radname: '',
            redBagValue: '0',
            upPage: 'redpacket'
          }
        } else {
          this.selectedRad = {
            redBagId: val.id,
            redBagValue: val.parValue,
            radname: val.showName,
            upPage: 'redpacket'
          }
        }
        this.updateGoodsInfo(this.selectedRad)
        window.history.go(-1)
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  .hbWrap{
    padding: 0.32rem;
  }
  .couponsBox{
    padding-bottom: 1.28rem !important;
  }
  .nouse_reb{
    background: #fff;
    position: fixed;
    bottom: 0;
    padding: 0.32rem 0;
    width: 100%;
    left: 0;
    .btnCom{
      width: 81.33%;
      background: #fd455f;
      height: 1.04rem;
      line-height: 1.04rem;
    }
  }
</style>
