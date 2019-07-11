<template>
  <section class="confirm_order invoiceContainer" id="invoiceContainer">
    <div class="order_info invoice_div">
      <h2 class="invoice_title">发票类型</h2>
      <p class="invoiceType_p" >
        <span class="invoice_type" :class="{active:item.iscur}" v-for="(item,index) in invoiceTypes" @click="setCur(index)">{{item.name}}</span>
      </p>
    </div>
    <div class="invoice_div">
      <h2 class="invoice_title">发票抬头</h2>
      <div class="radio_div flex invoiceBox">
        <p class="cell_1 radio_item"> <input type="radio" class="radio_check" id="personal_input" name="radio" v-model="invoiceTitle" value="1" checked="" /> <label for="personal_input">个人</label> </p>
        <p class="cell_1 radio_item"> <input type="radio" class="radio_check" id="company_input" name="radio" v-model="invoiceTitle" value="2" /> <label for="company_input"> 单位</label> </p>
      </div>
      <input type="text" v-model="invoiceUnit" placeholder="请填写单位名称" class="unit_conment" required="required" maxlength="100" v-show="invoiceTitle==2" />
    </div>
    <div class="invoice_div">
      <h2 class="invoice_title">发票内容</h2>
      <div class="radio_div invoicecontentBox">
        <p class="radio_item"> <input type="radio" class="radio_check" name="radioContent" id="detail_input" value="1" v-model="invoiceContent" checked="" /> <label for="detail_input">明细</label> </p>
        <p class="radio_item"> <input type="radio" class="radio_check" name="radioContent" id="supplies_input" value="2" v-model="invoiceContent" /> <label for="supplies_input">耗材</label> </p>
        <p class="radio_item"> <input type="radio" class="radio_check" name="radioContent" id="office_input" value="3" v-model="invoiceContent" /> <label for="office_input">办公用品</label> </p>
        <p class="radio_item"> <input type="radio" class="radio_check" name="radioContent" id="computer_input" value="4" v-model="invoiceContent" /> <label for="computer_input">电脑配件</label> </p>
      </div>
    </div>
    <input type="button" class="confirm_btn invoicekeep_btn" value="确定" @click="bindEvent" />
    <div class="popupContainer" v-if="fig==1">
      <div class="invoice_popup">
        <h1 class="notice_title">发票须知</h1>
        <div class="notice_conment">
          <p class="notice_p">1.水象优品提供的发票种类为商业零售发票。<br>
            2.开具发票的金额以实际支付的金额为准。<br>
            3.开具商业零售发票时，抬头默认为收货人“个人姓名”，请需要更改抬头的客户在修改信息中进行修改。<br>
            4.商业零售发票信息与您输入的信息一致的情况下，发票一经开出，恕不退换。<br>
            5.优惠券抵扣的金额不能包含在开票金额中。<br>
            6.为了您能更快收到商品，商品会由合作商直接发货，而发票由水象优品出具，所以会分开给您寄送。
          </p>
        </div>
        <input type="button" class="confirm_btn keep_btn close_btn" value="我知道了" @click="closePopup">
      </div>
    </div>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        invoiceJson: [],
        invoiceTypes: [],
        invoiceType: '0',
        invoiceTitle: '1',
        invoiceUnit: '',
        invoiceContent: '1',
        fig: '0'
      }
    },
    created () {
      this.showLoad(false)
      this.inTitle()
      this.$nextTick(() => {
        this.showPopup()
      })
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo",
        goodsInfo: "getGoodsInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateToast",
        "updateGoodsInfo"
      ]),
      inTitle () {
        this.invoiceTypes = [{
          name: '不开发票',
          invoiceTtype: '0',
          iscur: true
        }, {
          name: '纸质发票',
          invoiceTtype: '1',
          iscur: false
        }]
        this.$set(this.$data, 'invoiceTypes', this.invoiceTypes)
      },
      setCur (index) {
        this.invoiceTypes.map(function (v, i) {
          i==index? v.iscur=true: v.iscur=false
        })
        this.invoiceTypes[index].iscur = true
        this.invoiceType = this.invoiceTypes[index].invoiceTtype
      },
      bindEvent () {
        if (this.invoiceType==0) {
          this.invoiceJson = {
            invoiceType: this.invoiceType,
            invoiceContent: '',
            invoiceUnit: '',
            invoiceTitle: ''
          }
        } else {
          this.invoiceJson = {
            invoiceType: this.invoiceType,
            invoiceContent: this.invoiceContent,
            invoiceUnit: this.invoiceUnit,
            invoiceTitle: this.invoiceTitle
          }
        }
        if (this.invoiceType == 1 && this.invoiceTitle == 2) {
          let reg = /^(([\u4e00-\uFA29])|([A-Za-z])){1,100}$/
          if (this.invoiceUnit == '') {
            this.updateToast({msg: '请输入单位名称'})
            return false
          }
          if (!reg.test(this.invoiceUnit)) {
            this.updateToast({msg: '请输入正确的单位名称'})
            return false
          }
        }
        this.updateGoodsInfo(this.invoiceJson)
        window.history.go(-1)
      },
      showPopup () {
        $('#popupShow').bind('click', () => {
          this.$set(this.$data, 'fig', '1')
        })
      },
      closePopup () {
        this.$set(this.$data, 'fig', '0')
      }
    }
  }
</script>
<style>
  #invoiceContainer .confirm_btn{
    position: inherit;
  }
</style>

