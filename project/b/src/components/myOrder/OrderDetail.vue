<template>
  <section class="confirm_order" v-if="isLoding">
    <div class="address_div sjcz_div" v-if="orderData.productType==101 || orderData.productType==102">
      <p class="recharge_tel"><span>充值号码：</span><span>{{orderData.mobile}}</span></p>
    </div>
    <div class="address_div sjcz_div" v-else-if="orderData.productType==106 || orderData.productType==103">
      <p class="recharge_tel"><span>接收短信号码：</span><span>{{orderData.mobile}}</span></p>
    </div>
    <div class="address_div" v-else>
        <span class="address_a">
            <p class="address_p user_p"><span v-text="orderData.consignee"></span><span v-text="orderData.consigneeMobile"></span></p>
            <p class="address_p ress_p">{{orderData.addProvince}}{{orderData.addCity}}{{orderData.addCounty}}{{orderData.addTown}}{{orderData.addDetail}}</p>
        </span>
    </div>
    <div class="marginB16 paddingT30">
    <p class="flex info_p order_number c_666 no_border">
      <b class="cell_0 l_b" id="orderId_num">订单号：{{orderData.orderStatus==1?(orderData.mergeOrder||orderData.orderId):orderData.orderId}}</b>
      <span class="cell_1 c_red" v-if="orderData.orderStatus==5 || orderData.orderStatus==6 ||orderData.orderStatus==8 ||orderData.orderStatus==9 || orderData.orderStatus==12">{{comparTable[5]}}</span>
      <span class="cell_1 c_red" v-else-if="orderData.orderStatus==11">{{comparTable[11]}}</span>
      <span class="cell_1 c_red" v-else-if="orderData.orderStatus == 4">{{orderData.hasComment != 1 && ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169 || $store.state.config.fromChannel != 'sxypApp' )?'待评论':'已完成'}}</span>
      <span class="cell_1 c_blue textAlignr" v-else>{{comparTable[orderData.orderStatus]}}</span>
    </p>
    <p class="flex info_p order_number c_666">
      <b class="cell_0 l_b">下单时间：</b>
      <span class="cell_1">{{orderData.orderTime}}</span>
    </p>
    </div>
    <div class="marginB16" v-for="(item, index) in listOrder" :key="index">
    <dl class="flex product_detail" @click="bindClick(item)">
      <dd class="cell_0 productImg">
        <img :src="item.productImage">
      </dd>
      <dt class="cell_1 productContent">
        <p class="productName good-name-line-h" :class="{'re_p':item.productType!='', 'crossBorder_goods':item.isCrossBorder==1}" v-text="item.productName"></p>
        <p class="c_ccc fSpu" v-if="item.productType<100">{{item.skuParameters}}</p>
        <p class="sj_box">售价：<span class="c_red">¥{{item.productPrice}}</span><span class="fr">x{{item.buycount}}</span></p>
        <p class="is7ToReturns cell_1" v-if="(item.productType && item.productType>100) || item.is7ToReturn == 0">不支持七天无理由退货</p>
      </dt>
    </dl>
    <p class="flex info_p remarks_p" v-if="item.remark"> <b class="cell_0 l_b">买家留言</b><span class="cell_1 c_666 message_span">{{item.remark}}</span></p>
    </div>
    <div class="marginB16 paddingT30">
      <p class="flex info_p order_number c_666" v-if="orderData.monthPay>0">
        <b class="cell_0 l_b">每月应还</b>
        <span class="cell_1 r_s">{{orderData.monthPay}}元</span>
      </p>
      <p class="flex info_p order_number c_666" v-if="orderData.redbagValue>0">
        <b class="cell_0 l_b">优惠券</b>
        <span class="cell_1 r_s">{{orderData.redbagValue}}元</span>
      </p>
      <p class="flex info_p order_number c_666 no_border" v-if="orderData.actDiscountAmount">
        <b class="cell_0 l_b">活动优惠</b>
        <span class="cell_1 r_s">-{{orderData.actDiscountAmount}}元</span>
      </p>
      <p class="flex info_p order_number c_666" v-if="orderData.rebateStatus && orderData.rebateStatus!='0' && orderData.rebate && orderData.rebate>0">
        <b class="cell_0 l_b">预估返利</b>
        <span class="cell_1 r_s">{{orderData.rebate}}元</span>
      </p>
      <p class="flex info_p order_number c_666" v-if="orderData.sxtAmount>0">
        <b class="cell_0 l_b">水象通</b>
        <span class="cell_1 r_s">{{orderData.sxtAmount}}元</span>
      </p>
      <p class="flex info_p order_number c_666 no_border">
        <b class="cell_0 l_b">实付款</b>
        <span class="cell_1 r_s">{{orderData.actualAmount}}元</span>
      </p>
    </div>
    <div class="marginB16 paddingT30" v-if="orderData.invoiceType==1">
      <p class="flex info_p order_number c_666 no_border">
        <b class="cell_0 l_b">发票信息</b>
        <span class="cell_1 r_s">{{orderData.invoiceTitle==1?'个人电子发票':'公司电子发票'}}</span>
      </p>
      <p class="flex info_p order_number c_666 no_border" v-if="orderData.invoiceTitle==2">
        <b class="cell_0 l_b">发票抬头</b>
        <span class="cell_1 r_s">{{orderData.invoiceUnit}}</span>
      </p>
      <p class="flex info_p order_number c_666 no_border">
        <b class="cell_0 l_b">收票人邮箱</b>
        <span class="cell_1 r_s">{{orderData.email}}</span>
      </p>
      <p class="flex info_p order_number c_666 no_border no_padding" v-if="orderData.invoiceTitle==2">
        <b class="cell_0 l_b">纳税人识别号</b>
        <span class="cell_1 r_s">{{orderData.taxpayerNumber}}</span>
      </p>
    </div>
    <div class="marginB16 paddingT30" v-if="orderData.virtualCardShow&&orderData.virtualCardShow==1">
      <p class="flex info_p order_number c_666">
        <b class="cell_1 l_b no_border">卡号：{{orderData.cardDetail.cardNo}}</b>
        <span class="cell_0 copy_btn" @click="doCopy(orderData.cardDetail.cardNo)">复制</span>
      </p>
      <p class="flex info_p order_number c_666">
        <b class="cell_1 l_b no_border" @click="offOron()" :class="isonEye?'onEye':'pasword_btn'">密码：{{isonEye?orderData.cardDetail.cardPwd:'**********'}}</b>
        <span class="cell_0 copy_btn" @click="doCopy(orderData.cardDetail.cardPwd)">复制</span>
      </p>
      <p class="flex info_p order_number c_666">
        <b class="cell_1 l_b no_border">有效期：{{orderData.cardDetail.cardDeadline}}</b>
        <router-link to="cardRate" class="cell_0 copy_btn">去寄售</router-link>
      </p>
    </div>
    <div class="flex order_statusdetail" v-if="orderData.orderStatus==5 || orderData.orderStatus==6 || orderData.orderStatus==8 ||orderData.orderStatus==9 ||orderData.orderStatus==12 || orderData.orderStatus==2 || orderData.orderStatus==1 || (orderData.orderStatus==3 && orderData.productType < 100) ||  orderData.orderStatus==4">
      <p class="cell_0 payment_time" v-if="orderData.orderStatus==1">
        <span class="c_999">剩余时间：<b class="surplustim_b"><span v-show="!miaosha" ref="hours">{{countDownTime.hours}}</span><span ref="minutes">{{countDownTime.minutes}}</span><span ref="seconds">{{countDownTime.seconds}}</span></b></span>
      </p>
      <p class="cell_1 status_btn" v-if="orderData.orderStatus==4">
        <span class="rad_btn" @click="promotionShow" v-if="$store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169">立即晒单</span>
        <span class="rad_btn" @click="commentGoods" v-if="orderData.hasComment != 1 && $store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169">评价商品</span>
        <router-link :to="{ path: 'logistics', query: { orderId: orderData.orderId}}" class="rad_btn" v-else>查看物流</router-link>
        <router-link :to="{ path: 'ApplyAfter', query: { orderId:orderData.orderId } }" class="rad_btn" v-if="orderData.canAfterSale == 1 && orderData.productType<100">申请售后</router-link>
        <span class="gray_btn" @click="bindClick(orderData)">再次购买</span>
      </p>
      <p class="cell_1 status_btn" v-else>
        <a class="rad_btn" v-if="orderData.orderStatus==1" href="javascript:;" @click="cancelOrder">取消订单</a>
        <a @click="buryPointForPay(orderData.orderId)" v-if="orderData.orderStatus==1" class="gray_btn">去支付</a>
        <router-link :to="{ path: 'ApplyAfter', query: { orderId:orderData.orderId, isCancel: '1' } }" class="rad_btn" v-if="(orderData.orderStatus==2 || orderData.orderStatus==6) && orderData.canAfterSale == 1 && orderData.productType<100">{{orderData.orderStatus==6?'申请售后':'取消订单'}}</router-link>
        <span  class="gray_btn" v-if="orderData.orderStatus==2" @click.stop="showToast({msg: '提醒卖家发货发送消息成功'})">提醒发货</span>
        <span v-if="orderData.orderStatus==5 || orderData.orderStatus==6 || orderData.orderStatus==8 ||orderData.orderStatus==9 ||orderData.orderStatus==12" class="rad_btn" @click="bindClick(orderData)">再次购买</span>
        <router-link v-if="orderData.orderStatus==3 && orderData.productType < 100" :to="{ path: 'logistics',  query: {'orderId': orderData.orderId}}" class="rad_btn">查看物流</router-link>
      </p>
    </div>
  </section>
</template>
<script>
  import {SHOW_SHARE} from '../../store/mutation-types'
  import { app, is_weixn } from 'lib/until'
  import shoppingmixin from 'components/shopping/mixin'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)
  export default {
    mixins: [shoppingmixin],
    data () {
      return {
        orderIndex: this.$store.state.route.query.orderIndex || 0,
        orderData: {},
        listOrder: [],
        comparTable: {
          1: '待支付',
          2: "待发货",
          3: "待收货",
          4: "待评论",
          5: "已取消",
          7: "已支付",
          11: '待拼团'
        },
        countDownTime: {
          day: "00",
          hours: "00",
          minutes: "00",
          seconds: "00"
        },
        degflg: 0,
        miaosha: '',
        showNewCashier: '',
        bankList: '',
        bankNo: 0,
        isShowVoucher: false,
        isnegative: false,
        istransform: false,
        isLoding: false,
        isonEye: false,
        buyBackType: 1, // 回购类型 1[回购] 2[发货]
        isWeixin: is_weixn()
      }
    },
    created () {
    },
    beforeRouteLeave (to, from, next) {
      if (window.time) {
        clearInterval(window.time)
        delete window.time
      }
      next()
    },
    mounted () {
      this.showDetailsList().then(() => {
        if (this.$store.state.route.query.redirecUrl) {
          // 后台保存微信授权code
          this.wechatSaveUserinfo()
        }
      })
    },
    methods: {
      commentGoods () {
        // 评论商品
        let {productNo, productName, orderId, productImage} = this.orderData
        app.appGoodsComments({
          productNo,
          productName,
          productImage,
          orderId
        })
      },
      promotionShow () {
        // 立即晒单
        this.showLoad(true)
        let { uid, token } = this.$store.state.userInfo
        const { orderId, isactivity, activityNo, productNo, productImage, productName, skuParameters } = this.orderData
        let url = window.location.origin + window.location.pathname + "#/detail?fromChannel=sxyph5&productNo=" + productNo + "&isActivity=" + isactivity + "&activityNo=" + activityNo
        this.$post({
          url: this.$store.state.api.productCommentShare,
          data: {
            uid,
            token,
            orderId
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == '1') {
            this.$store.commit(SHOW_SHARE, {
              showFlag: true,
              title: productName,
              desc: skuParameters,
              link: url,
              imgUrl: productImage,
              keepImgUrl: res.data.pic,
              productNo: productNo,
              activityNo: activityNo,
              isActivity: isactivity
            })
          }
        })
      },
      buryPointForPay (orderId) {
        if (this.$store.state.config.fromChannel != 'sxypApp' && !this.isWeixin) {
          this.$router.push('/download')
          return false
        }
        // 支付
        this.weChat(orderId, this.orderIndex)
      },
      doCopy (val) {
        let _t = this
        this.$copyText(val).then(function (e) {
          _t.showToast({msg: '复制成功'})
        }, function (e) {
          _t.showToast({msg: '复制失败'})
        })
      },
      offOron () {
        this.isonEye = !this.isonEye
      },
      showDetailsList () {
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.QueryOrderDetails,
          data: {
            uid,
            token,
            orderId: this.$store.state.route.query.orderId
          }
        }).then(data => {
          this.showLoad(false)
          this.isLoding = true
          let res = data.data
          if (res.status == "1") {
            this.showNewCashier = res.showNewCashier
            if (res.data.miaosha==0) {
              this.$set(this.$data, 'miaosha', false)
            } else if (res.data.miaosha==1) {
              this.$set(this.$data, 'miaosha', true)
            }
            this.$set(this.$data, 'orderData', res.data)
            // 判断是否是合并的订单
            if (this.orderData.listOrder&&this.orderData.listOrder.length>0) {
              this.listOrder = this.orderData.listOrder
            } else {
              this.listOrder[0] = this.orderData
            }
            let {orderStatus, orderTime, miaosha, currentTime} = res.data
            if (orderStatus==1) {
              let begintime_ms = Date.parse(new Date(orderTime.replace(/-/g, "/")))
              let endtime_ms
              if (miaosha == 1) {
                endtime_ms = 900000 + begintime_ms
              } else {
                endtime_ms = 86400000 + begintime_ms
              }
              let currenttime_ms = Date.parse(new Date(currentTime.replace(/-/g, "/")))
              let surplustime_ms = (endtime_ms - currenttime_ms)
              if (surplustime_ms >= 0) {
                this.isnegative = true
                this.$nextTick(() => {
                  this.beginCountDown(surplustime_ms/1000)
                })
              }
            } else {
              if (window.time) {
                clearInterval(window.time)
                delete window.time
              }
            }
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      // 倒计时
      countDown (countTime) {
        if (countTime==0) { window.location.reload() }
        this.$data.countDownTime.day = parseInt(countTime / (60 * 60) / 24) + '天'
        this.$data.countDownTime.hours = parseInt(countTime / (60 * 60) % 24)>= 10? parseInt(countTime / (60 * 60) % 24) + '时' : '0' + parseInt(countTime / (60 * 60) % 24)+ '时'
        this.$data.countDownTime.minutes = parseInt(countTime / 60 % 60) >= 10 ? parseInt(countTime / 60 % 60) + '分' : '0' + parseInt(countTime / 60 % 60) + '分'
        this.$data.countDownTime.seconds = parseInt(countTime % 60) >= 10 ? parseInt(countTime % 60)+ '秒' : '0' + parseInt(countTime % 60) + '秒'
      },
      // 开始倒计时
      beginCountDown (diffSes) {
        window.time = setInterval(() => {
          diffSes--
          this.countDown(diffSes)
        }, 1000)
      },
      // 取消订单
      cancel () {
        this.showLoad(true)
        let {uid, token} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.CancelOrder,
          data: {
            uid,
            token,
            orderId: this.$store.state.route.query.orderId,
            redbagId: this.$data.orderData.redbagId||''
          }
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status == "1") {
            if (this.$data.degflg>0) {
              this.showToast({msg: '订单取消成功'})
              this.$set(this.$data, 'degflg', 0)
            }
            this.showDetailsList()
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      cancelOrder (e) {
        let that=this
        this.showDialog({
          title: '提示',
          rBtnText: '确定',
          lBtnText: '取消',
          msg: '是否确认取消订单',
          confCallBack () {
            that.$set(that.$data, 'degflg', 1)
            that.cancel()
          }
        })
      },
      bindClick (item) {
        let {productType, productNo, isActivity, activityNo} = item
        if (productType=='101' || productType == '102' || productType == '106') {
          this.$router.push('/virtualDetail')
        } else if (productType == '103') {
          this.$router.push('/cardVoucher')
        } else {
          window.location.href = '#/detail?productNo='+productNo+'&isActivity='+isActivity+'&activityNo='+activityNo
        }
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";

  .content-offset{
    border-top: none;
  }
  .confirm_order{
    // margin-top: -1px;
    padding-top: 0;
    @include px2rem(padding-bottom,116);
  }
  .buyBack_order{
    @include px2rem(padding-bottom,190);
  }
  // .rad_c, .info_p .c_red{
  //   color: $mainColor;
  // }
  .address_div{
     @include px2rem(margin-bottom, 16);
  }
  .confirm_order{
    .address_a{
      background: transparent;
    }
  }
  .info_p{
    border: none;
  }
  .address_a{
    @include px2rem(padding-right, 60);
    background: url("../../assets/icon/order/order_address_icon-arrow@3x.png") no-repeat;
    background-position: 96% center;
    @include px2rem(background-size,28 28);
  }
  .r_s{
    color: $color333;
    @include font-dpr(28);
  }
  .marginB16{
    @include px2rem(margin-bottom, 16);
  }
  .paddingT30{
    @include px2rem(padding-top, 30);
    background: #ffffff;
  }
  .info_p{
    background: #ffffff;
  }
  .order_number{
    @include font-dpr(26);
    background: #ffffff;
    line-height:1.2;
    height: auto;
    @include px2rem(padding, 0 30 32);
  }
  .no_border{
    border: none;
  }
  .product_box{
    margin: 0;
    border: none;
  }
  .textAlignr{
    text-align: right;
  }
  .is7ToReturns{
    @include px2rem(padding-left, 40);
    @include font-dpr(24);
    color:  $mainColor;
    line-height: 2;
    background: url("../../assets/icon/icon/order_reason_icon3x.png") no-repeat left center;
    @include px2rem(background-size, 30 30);
    font-weight: bold;
  }
  .remarks_p{
    border-top: 1px solid $borderColor;
    border-bottom: none;
    overflow: inherit;
    align-items: center;
    .message_span{
      @include px2rem(margin-left, 14);
      @include font-dpr(24);
      line-height: 1.2;
    }
  }
  #orderId_num{ width: 78%;}
  .info_p .l_b{width:auto}
  .order_statusdetail{
    @include px2rem(height,98);
    border-top: 1px solid $borderColor;
    background: #FAFAFA;
    position: fixed;
    bottom: 0;
    width: 100%;
    .payment_time{
      // border-top: 1px solid $borderColor;
      @include px2rem( padding-left, 30);
      @include px2rem(line-height,98);
      @include px2rem(width, 350);
      @include font-dpr(24);
      b{ font-weight: normal;
        color: $mainColor;
      }
      &.back_buy_time{
        padding-left: 0.1rem;
      }
    }
    .status_btn{
      text-align: right;
      font-size: 0;
    }
    .gray_btn, .rad_btn{
      display: inline-block;
      @include font-dpr(24);
      text-align: center;
      @include wh(144, 58);
      @include px2rem(line-height,58);
      border: 1px solid $mainColor;
      @include px2rem(border-radius, 29);
      @include px2rem(margin, 20 24 0 3);
    }
    .gray_btn{
      color: #fff;
      background: $mainColor;
    }
    .rad_btn{
      color: $mainColor;
    }
    // .gray_btn{
    //   color: #666;
    //   // border-top: 1px solid $borderColor;
    //   &:before{
    //     content: '';
    //     width: 1px;
    //     @include px2rem(height,98);
    //     position: absolute;
    //     background: $borderColor;
    //     top: 0;
    //     left: 0;
    //   }
    // }
    .wuliu_btn{
      @include px2rem(height,98);
      &:before{
        background: none;
      }
    }
    // .rad_btn{
    //   position: absolute;
    //   color: #fff;
    //   background: $mainColor;
    //   font-weight: bold;
    // }
  }
  .product_detail{
    background: #fff;
    // @include px2rem(height, 272);
  }
  .productImg{
    @include px2rem(width,212);
    @include px2rem(padding-top, 30);
    // @include px2rem(height, 272);
    img{
      @include px2rem(width,162);
      @include px2rem(height,162);
      display: block;
      @include px2rem(margin-left, 30);
      border: 1px solid $borderColor;
    }
  }
  .productContent{
     @include px2rem(padding, 30 48 30 0);
  }
  .productName{
    width: 100%;
    @include px2rem(line-height, 42);
    @include px2rem(height, 84);
    @include font-dpr(28);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: $color333;
  }
  .fSpu{
    @include px2rem(height, 26);
    line-height:1;
    @include px2rem(margin, 10 0 18);
     display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .sj_box{
    color: $color333;
    b{
      font-weight: normal;
    }
  }
  .buyBack_box{
    background: #ffffff;
    @include px2rem(padding, 0 30);
    .buyBack_info:last-child{
      border-bottom: none;
    }
    .buyBack_info{
      @include px2rem(height, 98);
      @include px2rem(line-height, 98);
      border-bottom: 1px solid $borderColor;
      @include font-dpr(26);
      .sh_infp{
        color: #2A2A2A !important;
        @include px2rem(padding-left, 10);
        @include font-dpr(22);
      }
      &.buyBack_title{
        @include px2rem(height, 86);
      @include px2rem(line-height, 86);
      }
      &.checked_buyBack{
        background:url("../../assets/icon/cashier/public_moreitem3x.png") no-repeat right center;
        @include px2rem(background-size, 44 44);
      }
      .bank_icon, .get_money{
        @include font-dpr(24);
      }
      .bank_icon{
        background-size: 0.4rem 0.4rem !important;
        @include px2rem(padding-left, 40);
      }
      .get_money{
        text-align: right;
        b{
          color: #C43A37;;
        }
      }
    }
  }
  .buyBackImageUrl{
    position: fixed;
    z-index: 3;
    @include px2rem(top, 300);
    img{
      width: 88.4%;
      display: block;
      margin: 0 auto;
    }
  }
  .transformDiv{
    transform: rotate(90deg) scale(1.8);
    -webkit-transform: rotate(90deg) scale(1.8);
    // margin-top: 1.73335rem;
    margin: 3.05rem auto 0 auto !important;
    .Back_btn {
      transform: scale(0.6);
      -webkit-transform: scale(0.6);
    }
  }
  .Back_btn{
    width: 88.4%;
    @include px2rem(height, 52);
    margin: 0 auto;
    @include px2rem(margin-top, 30);
  }
  .close_btn{
    background:url("../../assets/icon/cashier/close_back.png") no-repeat bottom center;
    @include px2rem(background-size, 52 52);
  }
  .downloadImg_btn{
    background:url("../../assets/icon/cashier/download.png") no-repeat bottom center;
    @include px2rem(background-size, 52 52);
  }
  .back_txt{
    background: #FFF8E8;
    @include px2rem(padding, 28 30);
    margin-bottom: 0;
    position: fixed;
    bottom: 0;
    width: calc(100% - 0.8rem);
    span{
      color: #C43A37;
      @include px2rem(padding, 0 6);
      font-weight: bold;
    }
  }
  .have_btn_back{
    @include px2rem(bottom,98);
  }
  .back_txt_top{
    background-position: 0.35rem 0.2rem;
    // @include px2rem(background-size, 45 45);
  }
  .copy_btn{
    @include px2rem(width, 120);
    border: 1px solid $mainColor;
    text-align: center;
    color: $mainColor;
    @include px2rem(line-height, 36);
    @include font-dpr(24);
    @include px2rem(border-radius, 8);
  }
  .pasword_btn{
    background: #ffffff url("../../assets/icon/cashier/off.png") 98% center no-repeat;
    @include px2rem(background-size, 30 30);
  }
  .onEye{
    background: #ffffff url("../../assets/icon/cashier/on.png") 98% center no-repeat;
    @include px2rem(background-size, 30 30);
  }
  .good-name-line-h{
    @include px2rem(line-height, 40);
    &.crossBorder_goods{
      background: url('../../assets/icon/icon/quqiu.png') left 0.09333rem no-repeat;
      @include px2rem(background-size, 88 26);
      @include px2rem(text-indent, 96);
    }
  }
</style>
