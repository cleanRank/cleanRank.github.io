<template>
<section class="movie_wrap" v-if="isLoding">
  <div class="movie_content_box">
    <div class="movie_content border_movie noborder">
      <h5 class="movie_name">{{orderData.movie}}</h5>
      <p class="movie_time_start movie_txt">{{orderData.showtime}}</p>
      <p class="movie_address movie_txt">{{orderData.cinema + orderData.hall}}</p>
      <p class="movie_seat c_666">{{orderData.seat}}</p>
    </div>
    <p class="movie_num" v-if="orderData.ticketId || orderData.ticketPin"><span class="c_666">取票号</span><b>{{orderData.ticketId || orderData.ticketPin}}</b></p>
    <div class="movie_content">
      <h5 class="movie_name movie_order_status flex"><span class="cell_1">订单状态</span><b class="cell_0" :class="orderData.status==1?'c_red':'c_666'">{{comparTable[orderData.status]}}</b></h5>
      <p class="movie_time_start movie_txt c_666">手机号：{{orderData.mobile}}</p>
      <p class="movie_address movie_txt c_666">订单号：{{orderData.orderId}}</p>
      <p class="movie_address movie_txt c_666">订单金额：{{orderData.actualAmount}}元</p>
      <p class="movie_seat movie_txt c_666">下单时间：{{orderData.ordertime}}</p>
    </div>
  </div>
  <div class="flex order_statusdetail" v-if="orderData.status==1">
    <p class="cell_0 payment_time">
      <span class="c_999">剩余时间：<b class="surplustim_b"><span ref="hours">{{countDownTime.hours}}</span><span ref="minutes">{{countDownTime.minutes}}</span><span ref="seconds">{{countDownTime.seconds}}</span></b></span>
    </p>
    <p class="cell_1 status_btn">
      <a class="gray_btn" href="javascript:;" @click="cancelOrder($event)">取消订单</a>
      <!-- <a class="gray_btn wuliu_btn" href="javascript:;"></a> -->
      <router-link class="rad_btn fr" :to="{ path: !orderData.isbyStages || orderData.isbyStages=='0'?'cashier':'payDown', query: { orderId: orderData.orderId, orderIndex: orderIndex}}">支付</router-link>
    </p>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      orderIndex: this.$store.state.route.query.orderIndex || 0,
      orderData: {},
      isLoding: false,
      degflg: 0,
      comparTable: {
        1: '待支付',
        2: "已支付",
        3: "已完成",
        4: "已取消"
      },
      countDownTime: {
        day: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (window.time) {
      clearInterval(window.time)
      delete window.time
    }
    next()
  },
  created () {
    this.showDetailsList()
  },
  methods: {
    showDetailsList () {
      let {uid, token} = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.filmflyOrderDetail,
        data: {
          uid,
          token,
          orderId: this.$store.state.route.query.orderId
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        if (res.status === "1") {
          let {status, ordertime, currentTime} = res.data
          if (status == "1") {
            let begintime_ms = Date.parse(new Date(ordertime.replace(/-/g, "/")))
            let endtime_ms = 900000 + begintime_ms
            let currenttime_ms = Date.parse(new Date(currentTime.replace(/-/g, "/")))
            let surplustime_ms = (endtime_ms - currenttime_ms)
            if (surplustime_ms >= 0) {
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
          this.$set(this.$data, 'orderData', res.data)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/app";
.order_statusdetail{
    @include px2rem(height,98);
    @include px2rem(line-height,98);
    // border-top: 1px solid $borderColor;
    background: #FAFAFA;
    position: fixed;
    bottom: 0;
    width: 100%;
    .payment_time{
      border-top: 1px solid $borderColor;
      @include px2rem( padding-left, 30);
      @include px2rem(width, 330);
      @include font-dpr(24);
      b{ font-weight: normal;
        color: $mainColor;
      }
      &.back_buy_time{
        padding-left: 0.1rem;
      }
    }
    .gray_btn, .rad_btn{
      width: 50%;
      height: 100%;
      display: inline-block;
      @include font-dpr(30);
      text-align: center;
    }
    .gray_btn{
      color: #666;
      border-top: 1px solid $borderColor;
      &:before{
        content: '';
        width: 1px;
        @include px2rem(height,98);
        position: absolute;
        background: $borderColor;
        top: 0;
        left: 0;
      }
    }
    .wuliu_btn{
      @include px2rem(height,98);
      &:before{
        background: none;
      }
    }
    .rad_btn{
      position: absolute;
      color: #fff;
      background: $mainColor;
      font-weight: bold;
    }
  }
</style>
