<template>
  <div>
  <section class="confirm_order order_lists" style="margin-top: 1.46rem;">
    <p class="flex info_p myorder_title order_tab_new notFromPzsc">
      <span class="cell_1" data-orderStatus="0" :class="{'visited':orderIndex == 0}" @click="changeTab(0)">全部</span>
      <span class="cell_1" data-orderStatus="1" :class="{'visited':orderIndex == 1}" @click="changeTab(1)">待支付</span>
      <!-- <span class="cell_1" data-orderStatus="11" :class="{'visited':orderIndex == 11}" @click="changeTab(11)">待拼团</span> -->
      <span class="cell_1" data-orderStatus="2" :class="{'visited':orderIndex == 2}" @click="changeTab(2)">待发货</span>
      <span class="cell_1" data-orderStatus="3" :class="{'visited':orderIndex == 3}" @click="changeTab(3)">待收货</span>
      <span class="cell_1" data-orderStatus="4" :class="{'visited':orderIndex == 4}" @click="changeTab(4)">{{($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169) || $store.state.config.fromChannel != 'sxypApp'?'待评论':'已完成'}}</span>
      <span class="cell_1" data-orderStatus="5" :class="{'visited':orderIndex == 5}" @click="changeTab(5)">已完成</span>
    </p>
    <ul v-if="hasInformation&&hasLoading" class="myorder_content">
      <li class="myorder_list" v-for="(item, index) in allData.data" :key="item.orderId">
        <router-link tag="div" :to="{ path: item.filmflag&&item.filmflag==1?'movieOrderdetail':'orderdetail', query: { orderId: item.orderId, orderIndex: allData.orderIndex,fromChannel:$store.state.config.fromChannel}}">
          <p class="flex myorder_product">
            <span class="cell_1 c_999 font14">{{item.orderTime}}</span>
            <span class="cell_1 countDown_time rad_color tr" v-if="(item.orderStatus==11 && item.remainingTime.minutes>0) || (item.orderStatus==11 && item.remainingTime.seconds>0) ">倒计时：{{item.remainingTime.hours || '00'}}:{{item.remainingTime.minutes || '00'}}:{{item.remainingTime.seconds || '00'}}</span>
            <span class="cell_1 r_s c_999 tr" v-if="item.orderStatus==5 || item.orderStatus==6 ||item.orderStatus==8 ||item.orderStatus==9 ||item.orderStatus==12">{{comparTable[5]}}</span>
            <span :class="['cell_1', 'r_s', 'c_999', 'tr', item.hasComment == 0 && ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169 || $store.state.config.fromChannel != 'sxypApp') ?'rad_color':'']" v-else-if="item.orderStatus == 4">{{item.hasComment != 1 && ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169 || $store.state.config.fromChannel != 'sxypApp' )?'待评论':'已完成'}}</span>
            <span class="cell_1 r_s rad_color tr" v-else>{{item.orderStatus==11?'待拼团':comparTable[item.orderStatus]}}</span>
            <span class="delete-order" v-if="item.orderStatus == 4 || item.orderStatus == 5 || item.orderStatus == 6 ||item.orderStatus == 8 || item.orderStatus == 9 || item.orderStatus == 12" @click.stop="cancelOrder(item.orderId, 3, index)"></span>
          </p>
          <dl class="flex product_detail">
            <dd class="cell_0 productImg">
              <img :src=item.productImage class="lazy" :alt="item.productName">
            </dd>
            <dt class="cell_1 productContent">
              <p class="productName good-name-line-h" :class="{'re_p':item.productType!='', 'crossBorder_goods':item.isCrossBorder==1}" v-text="item.productName"></p>
              <p class="c_999 fSpu">{{item.skuParameters}}</p>
              <p class="sj_box"><span class="c_red font18">¥{{item.productPrice}}</span><b class="fr">x{{item.buycount}}</b></p>
            </dt>
          </dl>
          <div class="flex money_items">
            <span class="cell_1 pay_details">共{{item.buycounttotal}}件商品</span>
            <span class="cell_1 pay_details tr" v-if="item.monthPay==0">实付款：<b class="c_333">¥{{item.actualAmount}}</b></span>
            <!-- <span class="cell_0 c_999 pay_details" v-if="item.monthPay>0">首付：<b class="actualAmount_b">¥{{item.firstPayment}}</b></span> -->
            <!-- <span class="cell_0 c_999 pay_details" v-if="item.monthPay>0">月付：<b class="actualAmount_b">¥{{item.monthPay}}</b><b class="actualAmount_b">*{{item.monthNum}}</b>期</span> -->
          </div>
        </router-link>
        <div class="group_item" v-if="item.consignment&&item.consignment==1">
          <p class="pay_a">
            <router-link :to="{ path: 'cardRate', query: { orderIndex: orderIndex }}"  class="btn_box rad_color rad_btn">去寄售</router-link>
          </p>
        </div>
        <div class="group_item" v-show="item.orderStatus==5 || item.orderStatus==6 || item.orderStatus==8 ||item.orderStatus==9 ||item.orderStatus==12 || item.orderStatus==2 || item.orderStatus==1 || (item.orderStatus==3 && item.productType < 100) || (item.orderStatus==4 && $store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169)">
            <p class="pay_a" v-if="item.orderStatus==4">
              <span class="btn_box c_999" @click="promotionShow(item)">立即晒单</span>
              <router-link :to="{ path: 'logistics', query: { orderId: item.orderId}}" class="btn_box rad_color rad_btn">查看物流</router-link>
              <span class="btn_box c_999 again_to" @click="bindClick(item)" v-if="item.hasComment==1">再次购买</span>
              <span class="btn_box rad_color rad_btn" @click="commentGoods(item)" v-else>评价商品</span>
            </p>
            <p class="pay_a" v-else>
              <span class="btn_box c_999" v-if="item.orderStatus==1" @click.stop="cancelOrder(item, 1)">取消订单</span>
              <a class="btn_box rad_color rad_btn" v-if="item.orderStatus==1" @click="goJumpurl(item.orderId)">去支付</a>
              <!-- <router-link v-if="item.orderStatus==1" class="btn_box rad_color rad_btn" :to="{ path: item.isbyStages=='0'?'cashier':'payDown', query: { orderId: item.orderId, orderIndex: orderIndex}}">支付</router-link> -->
              <router-link v-if="item.orderStatus==3 && item.productType < 100" class="btn_box rad_color rad_btn" :to="{ path: 'logistics', query: { orderId: item.orderId}}">查看物流</router-link>
              <span class="btn_box c_999" v-if="item.orderStatus==2" @click.stop="showToast({msg: '提醒卖家发货发送消息成功'})">提醒发货</span>
              <span class="btn_box c_999" v-if="item.orderStatus==5 || item.orderStatus==6 ||item.orderStatus==8 ||item.orderStatus==9 ||item.orderStatus==12" @click="bindClick(item)">再次购买</span>
              <!-- 确认收货 -->
              <span class="btn_box rad_color rad_border" v-if="item.showConfirmReceipt == '1'" @click="cancelOrder(item, 2)">确认收货</span>
            </p>
            <!-- <span class="group_yq_btn" @click="clickRight(item)" v-if="item.orderStatus==11">邀请好友拼单</span> -->
           <!-- <router-link :to="{ path: 'paysucces', query: { orderId: item.orderId, orderIndex: orderIndex, isorderlist: '1'}}" class="group_yq_btn">邀请好友拼单</router-link> -->
          </div>
      </li>
    </ul>
  </section>
  <div v-if="!hasInformation&&hasLoading" class="nodata_order">
    <img src="../../assets/icon/icon/blank_flow_icon.png">
    <p>您还没有相关订单</p>
  </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import {SHOW_SHARE} from '../../store/mutation-types'
  import shoppingmixin from 'components/shopping/mixin'
  import { app, is_weixn } from 'lib/until'
  export default {
    mixins: [shoppingmixin],
    data () {
      return {
        pageNo: 1,
        isSCrollLoading: false,
        allData: {
          data: []
        },
        comparTable: {
          1: '待支付',
          2: "待发货",
          3: "待收货",
          4: "待评论",
          5: "已取消",
          7: "已支付"
        },
        orderIndex: window.sessionStorage.getItem('orderIndex')|| this.$store.state.route.query.orderIndex || 0,
        hasInformation: '',
        pageCount: 1,
        hasLoading: false,
        showNewCashier: '',
        lastMergeOrder: '',
        isWeixin: is_weixn()
      }
    },
    created () {
      window.sessionStorage.removeItem('orderIndex')
      if (this.$store.state.userInfo.loginTokenWanKaState === 2) {
        this.showList().then(() => {
          if (this.$store.state.route.query.redirecUrl) {
          // 后台保存微信授权code
            this.wechatSaveUserinfo()
          }
          this.$nextTick(() => {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
          })
        })
      } else {
        this.$store.watch(state => {
          return state.userInfo.loginTokenWanKaState
        }, (loginState) => {
          loginState === 2 && this.showList().then(() => {
            if (this.$store.state.route.query.redirecUrl) {
          // 后台保存微信授权code
              this.wechatSaveUserinfo()
            }
            this.$nextTick(() => {
              window.scrollTo(0, 1)
              window.scrollTo(0, 0)
            })
          })
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      console.log(to.name)
      window.removeEventListener('scroll', this.onScroll, false)
      if (to.name=='OrderDetail' || to.name=='MovieOrderdetail' ||to.name=='Logistics'||to.name=="Cashier"||to.name=="CardRate") {
        window.sessionStorage.setItem('orderIndex', this.$data.orderIndex)
      }
      if (window.time) {
        clearInterval(window.time)
        delete window.time
      }
      next()
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.onScroll, false)
      })
    },
    methods: {
      ...mapActions([
        "updateUserInfo",
        "showLoadingFlag"
      ]),
      goJumpurl (orderId) {
        if (this.$store.state.config.fromChannel != 'sxypApp' && !this.isWeixin) {
          this.$router.push('/download')
          return false
        }
        // 支付
        this.weChat(orderId, this.orderIndex)
      },
      bindClick (item) {
        // 去详情页
        window.sessionStorage.setItem('orderIndex', this.orderIndex)
        let {productType, productNo, isActivity, activityNo} = item
        if (productType=='101' || productType == '102' || productType == '106') {
          this.$router.push('/virtualDetail')
        } else if (productType == '103') {
          this.$router.push('/cardVoucher')
        } else {
          window.location.href = '#/detail?productNo='+productNo+'&isActivity='+isActivity+'&activityNo='+activityNo
        }
      },
      commentGoods (item) {
        // 评论商品
        window.sessionStorage.setItem('orderIndex', this.orderIndex)
        let {productNo, productName, orderId, productImage} = item
        app.appGoodsComments({
          productNo,
          productName,
          productImage,
          orderId
        })
      },
      promotionShow (item) {
        // 立即晒单
        this.showLoad(true)
        let { uid, token } = this.$store.state.userInfo
        const { orderId, isactivity, activityNo, productNo, productImage, productName, skuParameters } = item
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
      clickRight (item) {
        // fightGroupsOrderNo 拼团订单号 fightGroupsNo 拼团编号
        let {fightGroupsOrderNo, productName, productImage, fightGroupsNo, productNo} = item
        if (!fightGroupsOrderNo && this.$store.state.config.version<25) return false
        // 更新分享信息
        const url = window.location.origin + window.location.pathname + "#/detail?fromChannel=sxyph5&productNo=" + productNo + "&isActivity=0&fightGroupsOrderNo=" + fightGroupsOrderNo + '&fightGroupsNo=' + fightGroupsNo
        this.$store.commit(SHOW_SHARE, {
          showFlag: true,
          title: productName,
          desc: '我在水象优品发现了一个不错的商品，赶快来看看吧!',
          link: url,
          imgUrl: productImage
        })
      },
      onScroll () {
        if (this.isBottom() && !this.isSCrollLoading) {
          this.showList()
        }
      },
      isBottom () {
        return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
      },
      changeTab (index) {
        this.$set(this.$data, 'lastMergeOrder', '')
        this.$set(this.$data.allData, 'data', [])
        this.$set(this.$data, 'orderIndex', index)
        this.$set(this.$data, 'pageNo', 1)
        this.$set(this.$data, 'pageCount', 1)
        this.showList()
      },
      loadImg () {
        let categoryList =$('.lazy')
        for (var i = 0, l = categoryList.length; i < l; i++) {
          (function (obj) {
            let img = {}
            img.src = $(obj).data('src')
            img.onload = function () {
              obj.src = img.src
            }
          })(categoryList[i])
        }
      },
      showList (isReloadPage) {
        if (this.pageCount < this.pageNo) {
          // this.showToast({msg: '没有更多订单了'})
          return Promise.resolve()
        }
        this.isSCrollLoading = true
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.QueryOrderList,
          data: {
            uid: this.userInfo.uid,
            token: this.$store.state.userInfo.token,
            orderStatus: this.$data.orderIndex == 5 ? 40 : this.$data.orderIndex,
            pageNo: this.$data.pageNo,
            lastMergeOrder: this.lastMergeOrder
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          this.lastMergeOrder = res.lastMergeOrder
          if (res.status === "1") {
            this.showNewCashier = res.showNewCashier
            res.data.forEach((item, i) => {
              let remainingTime = item.remainingTime
              if (remainingTime && remainingTime > 0) {
                  // 如果倒计时id存在，则先清除倒计时，再开启新的倒计时
                window.time = setInterval(() => {
                  remainingTime--
                  item.remainingTime = this.countDown(remainingTime)
                }, 1000)
              } else {
                item.remainingTime = {
                  hours: '00',
                  minutes: '00',
                  seconds: '00'
                }
              }
            })
            this.pageNo += 1
            this.$set(this.$data, 'pageCount', +res.pageCount)
            this.$set(this.$data.allData, 'orderIndex', this.$data.orderIndex)
            this.$set(this.$data, 'hasInformation', true)
            this.$data.allData.data = this.$data.allData.data.concat(res.data)
            this.$set(this.$data, 'hasLoading', true)
            if (this.allData.data.length < 10) {
              this.showList()
            }
          } else {
            // 解决前两次接口返回数据，但是第三次接口返回11的情况下，页面直接给隐藏掉了，需要根据allData.data区分一下
            if (!this.allData.data.length > 0 || isReloadPage) {
              this.$set(this.$data, 'hasInformation', false)
              this.$set(this.$data, 'hasLoading', true)
            }
          }
          this.isSCrollLoading = false
        })
      },
      // 倒计时
      countDown (countTime) {
        if (countTime == 0) { window.location.reload() }
        let time = {}
        time.hours = parseInt(countTime / (60 * 60) % 24) >= 10 ? parseInt(countTime / (60 * 60) % 24) : '0' + parseInt(countTime / (60 * 60) % 24)
        time.minutes = parseInt(countTime / 60 % 60) >= 10 ? parseInt(countTime / 60 % 60) : '0' + parseInt(countTime / 60 % 60)
        time.seconds = parseInt(countTime % 60) >= 10 ? parseInt(countTime % 60) : '0' + parseInt(countTime % 60)
        return time
      },
      cancelOrder (item, type, index = 0) {
        let showDialog = {}
        if (type == '1') {
          showDialog.title = '提示'
          showDialog.msg = '是否确认取消订单'
          showDialog.confCallBack = this.cancel
        } else if (type == '2') {
          showDialog.title = '确认收货'
          showDialog.msg = '您确认收到货了吗？'
          showDialog.confCallBack = this.confirmReceipt
        } else if (type == '3') {
          showDialog.title = '确认删除订单？'
          showDialog.msg = '删除后，将看不到该笔订单'
          showDialog.confCallBack = this.deleteOrder
        }
        this.showDialog({
          title: showDialog.title,
          rBtnText: '确定',
          lBtnText: '取消',
          msg: showDialog.msg,
          confCallBack () {
            showDialog.confCallBack(item, index)
          }
        })
      },
      cancel (item) {
        let {orderId, redbagId} = item
        let {uid, token} = this.userInfo
        this.$post({
          url: this.$store.state.api.CancelOrder,
          data: {
            uid,
            token,
            orderId: orderId,
            redbagId: redbagId ||''
          }
        }).then(data => {
          let res = data.data
          if (res.status == "1") {
            this.showToast({
              msg: '订单取消成功'
            })
            this.showLoad(true)
            this.pageNo = 1
            this.allData.data = []
            this.showList(true).then(() => {
              this.$nextTick(() => {
                window.scrollTo(0, 1)
                window.scrollTo(0, 0)
              })
            })
            // item.orderStatus = 5
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      confirmReceipt (item) {
        let { uid, token } = this.$store.state.userInfo
        let { orderId } = item
        this.showLoad(true)
        this.$post({
          url: this.$store.state.api.confirmReceipt,
          data: {
            uid,
            token,
            orderId
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == '1') {
            this.pageNo = 1
            this.allData.data = []
            this.showList(true).then(() => {
              this.$nextTick(() => {
                window.scrollTo(0, 1)
                window.scrollTo(0, 0)
              })
            })
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      deleteOrder (order, index) {
        let { uid, token } = this.$store.state.userInfo
        this.showLoad(true)
        this.$post({
          url: this.$store.state.api.deleteOrder,
          data: {
            uid,
            token,
            orderId: order
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == 1) {
            this.allData.data.splice(index, 1)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/app";
  .confirm_order{
    padding-top: 0;
  }
  .order_tab_new {
    position: fixed;
    width: 100%;
    z-index: 18;
    top: 0;
    background: #ffffff;
    &.notFromPzsc {
      @include px2rem(margin-top, 88);
    }
  }
  .myorder_list{
    @include px2rem(margin-bottom, 16);
  }
  .order_lists .info_p{
      height: 1.3rem;
      line-height: 1.3rem;
  }
  .myorder_product{
    @include px2rem(height,80);
    @include px2rem(line-height,80);
    background: #fff;
    // text-align: right;
    @include px2rem(padding, 0 24);
    @include font-dpr(28);
  }
  .countDown_time{
    color: #666666;
  }
  .rad_color{
   color: $mainColor;
  }
  .rad_border{
   border-color: $mainColor !important;
  }
  .group_item{
    // @include px2rem(height, 99);
    // @include px2rem(line-height, 99);
    overflow: hidden;
    text-align: right;
    background: #ffffff;
    border-top: 1px solid $borderColor;
    @include px2rem(padding, 14 24 24 0);
  }
  .group_yq_btn{
    color: $mainColor;
    border: 1px solid $mainColor;
    @include px2rem(padding, 10);
    @include font-dpr(26);
    border-radius: 3px;
  }
  .product_detail{
    background: #ffffff;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
    // @include px2rem(height, 222);
  }
  .productImg{
    @include px2rem(width,230);
    @include px2rem(height, 200);
    display: flex;
    justify-content: center;
    flex-direction: column;
    img{
      @include px2rem(width,150);
      @include px2rem(height,150);
      display: block;
      @include px2rem(margin-left, 30);
      // border: 1px solid $borderColor;
    }
  }
  .productContent{
    @include px2rem(width,461);
     @include px2rem(padding, 20 18 0 0);
  }
  .productName{
    width: 100%;
    @include px2rem(line-height, 42);
    @include px2rem(height, 42);
    @include font-dpr(30);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: $color333;
  }
  .fSpu{
    @include font-dpr(26);
    @include lh(40, 40);
    @include px2rem(margin, 10 0 22);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sj_box{
    color: $color333;
    b{
      font-weight: normal;
    }
  }
  .money_items{
    @include px2rem(height, 90);
    @include px2rem(line-height, 90);
    @include px2rem(padding, 0 24);
    background: #fff;
    // text-align: right;
    // -webkit-box-pack: justify;
    // -webkit-justify-content: flex-end;
    // -ms-flex-pack: justify;
    // justify-content: flex-end;
  }
  .pay_details{
    @include px2rem(margin-left, 10);
    color: #666;
    @include font-dpr(28);
  }
  .btn_box{
    width: auto;
    @include px2rem(width, 144);
    height: auto;
    @include font-dpr(28);
    text-align: center;
    @include px2rem(padding, 12 0 12);
    line-height: 1;
    @include px2rem(border-radius, 29);
    border: 1px solid #999999;
    display: inline-block;
    &.again_to{
      @include px2rem(margin-right, 20);
    }
  }
  .pay_a{
    font-size: 0;
  }
  .group_item .btn_box:first-child{
    margin-left: 0;
  }
  .rad_btn{
    border: 1px solid $mainColor;
  }
  .btn_box{
    @include px2rem(margin-left, 24);
    @include px2rem(margin-top, 10);
  }
  .good-name-line-h{
    @include px2rem(line-height, 40);
    &.crossBorder_goods{
      background: url('../../assets/icon/icon/quqiu.png') left 0.09333rem no-repeat;
      @include px2rem(background-size, 88 26);
      @include px2rem(text-indent, 96);
    }
  }
  .delete-order{
    @include px2rem(width, 56);
    @include px2rem(height, 80);
    background: url('../../assets/icon/icon/delete-order.png') right center no-repeat;
    @include px2rem(background-size, 36 36);
    @include px2rem(padding-left, 20);
    @include px2rem(margin-left, 20);
    position: relative;
    display: block;
  }
  .delete-order:before{
    content: '';
    @include px2rem(width, 2);
    @include px2rem(height, 24);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0;
    background: #D8D8D8;
  }
</style>
