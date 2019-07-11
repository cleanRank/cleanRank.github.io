<template>
  <section class="billdateContainer" data-title="设置账单日">
    <div class="billdate_wrap_box">
      <div class="billdate_box">
        <h6 class="setbill_title">设置还款日</h6>
        <p class="note_p">您可以根据自己的发薪日从以下日期中选择适合您的还款日。</p>
        <div class="billdate_list flex">
          <span class="cell_1" v-for="(item,index) in billdateNum" :key="index" :class="{s_active:item.iscur}" @click="setCur(index)">{{item.billdate}}</span>
        </div>
        <p class="note_p top_bor flex" v-if="billDate-4>0">
          <span class="cell_1">账单日<b class="c_blue current_date">{{billDate-4>0?billDate-4:0}}</b>日</span>
          <span class="cell_1">还款日<b class="c_blue repayment_date">{{billDate || 0}}</b>日</span>
        </p>
        <!-- <p class="caption_p" v-if="billDate-4>0">每月<b class="current_date">{{billDate-4}}</b>日，我们会把上个月<b class="previous_date">{{billDate-4}}</b>日至本月<b class="current_date">{{billDate}}</b>日的所有分期汇总成一份账单，您最迟要在本月<b class="repayment_date">{{billDate}}</b>日还清本月账单。</p> -->
        <input type="button" class="confirmBtns" value="确定" @click="setBill">
      </div>
    </div>
    <div class="field-tooltipWrap bgblock"></div>
  </section>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        billDate: '',
        billdateNum: []
      }
    },
    created () {
      this.showLoad(false)
      this.billdateShow()
    },
    methods: {
      ...mapActions([
        "updateGoodsInfo"
      ]),
      billdateShow () {
        this.billdateNum = [{
          billdate: 5,
          iscur: false
        }, {
          billdate: 10,
          iscur: false
        }, {
          billdate: 15,
          iscur: false
        }, {
          billdate: 20,
          iscur: false
        }, {
          billdate: 25,
          iscur: false
        }]
      },
      setCur (index) {
        this.billdateNum.map(function (v, i) {
          i==index? v.iscur=true: v.iscur=false
        })
        this.billdateNum[index].iscur = true
        this.billDate = this.billdateNum[index].billdate
        this.$set(this.$data, 'billDate', this.billDate)
      },
      setBill () {
        if (this.billDate<4) {
          this.showToast({msg: '请选择账单日'})
          return false
        }
        this.showLoad(true)
        // 设置还款日
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.SetBillDate,
          data: {
            uid,
            token,
            billDate: this.billDate
          }
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status === "1") {
            let billDate = this.billDate
            let billfig = '1'
            this.$emit('billfig', {billDate, billfig})
            this.updateGoodsInfo({billDate: this.billDate})
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .billdate_wrap_box{
    overflow: hidden;
    position: fixed;
    width: 100%;
    z-index: 3;
    @include px2rem(bottom, 30);
  }
  .bgblock{
    background: rgba(0,0,0,0.5);
    z-index: 2;
  }
  .confirmBtns{
    width: 100%;
    background: #FAFAFA;
    @include px2rem(height, 98);
    border: none;
    border-top: 1px solid $borderColor;
    color: $mainColor;
    @include font-dpr(30);
    @include px2rem(margin-top, 30);
  }
  .setbill_title{
    color: #222333;
    @include font-dpr(30);
    text-align: center;
    font-weight: bold;
    @include px2rem(padding-top, 40);
  }
</style>
