<template>
  <!-- 9 宫格 start-->
    <section class="member_container">
      <section class="showDown" @click="hideMenu"></section>
      <div class="member_wrap_other">
        <router-link tag="span" to="/" class="index_ourl jupm_url c_666">首页</router-link>
        <span @click="goLoan()" class="loan_ourl jupm_url c_666">借款</span>
        <router-link tag="span" to="/category" class="category_ourl jupm_url c_666">品类</router-link>
        <router-link tag="span" to="/personal" class="personal_ourl jupm_url c_666">我的</router-link>
        <router-link tag="span" to="/contactCS" class="contactcs_ourl jupm_url c_666">联系客服</router-link>
      </div>
      <!-- <div class="member_wrap">
        <span class="menuArrow"></span>
        <div>
          <router-link tag="span" to="/" class="mycategory_url member_item jupmwk_url left">首页</router-link>
          <router-link tag="span" to="/category" class="mycategory_url member_item jupmwk_url center">品类</router-link>
          <router-link tag="span" to="/myCollection" class="myorder_url member_item jupmwk_url right">我的收藏</router-link>
        </div>
        <div>
          <router-link tag="span" to="/orderList" class="myorder_url member_item jupmwk_url left">我的订单</router-link>
          <router-link tag="span" to="/myRedpacket" class="myorder_url member_item jupmwk_url center">我的优惠券</router-link>
          <router-link tag="span" to="/aftersaleslist" class="aftersale_url member_item jupmwk_url right">售后/退换货</router-link>
        </div>
        <div>
          <router-link tag="span" to="/myBankCart" class="mybankcard_url member_item jupmwk_url left">我的银行卡</router-link>
          <router-link tag="span" to="/myaddress" class="myaddress_url member_item jupmwk_url center">我的收货地址</router-link>
          <router-link tag="span" to="/contactCS" class="mycontactCS_url member_item jupmwk_url right">联系客服</router-link>
        </div>
      </div> -->

    </section>
    <!-- 9 宫格 emd-->
</template>

<script>
  import { mapActions } from 'vuex'
  import Base64 from 'lib/Base64'
  export default {
    methods: {
      ...mapActions(["update_Nightpalaces"]),
      hideMenu () {
        this.update_Nightpalaces()
      },
      goLoan () {
        if (this.$store.state.userInfo.token) {
          let { quotaStatus } = this.$store.state.userInfo
          if (quotaStatus) {
            // 有可使用额度，去借款
            this.$router.push('/loanIndex')
          } else {
            // 去白条
            let fromChannel = this.$store.state.config.fromChannel
            let userId = this.$store.state.userInfo.userId
            let url = process.env.SXBTURL['CREDIT']
            let callUrl = window.location.href
            const callBackUrl = Base64.encode(callUrl)
            window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
          }
        } else {
          this.$router.push('/login')
        }
      }
    },
    watch: {
      $route: {
        // 监听路由改变的时候关闭掉9宫格
        handler (curVal, oldVal) {
          this.hideMenu()
        },
        deep: true
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
@import "../../assets/scss/app";
.member_wrap_other{
  position: fixed;
  z-index: 2;
  background: #fff;
  @include px2rem(right, 14);
  @include px2rem(margin-top, 20);
  @include px2rem(width, 283);
  @include px2rem(padding, 36 0);
  border-radius: 4px;
  span:last-child{
    margin-bottom: 0;
  }
  &:before{
    content: '';
    position: absolute;
    @include px2rem(width, 51);
    @include px2rem(height, 24);
    @include px2rem(right, 14);
    @include px2rem(top, -18);
    background: url(../../assets/icon/oindex/bullet3x.png) no-repeat center;
    background-size: 100% 100%;
  }
}
.jupm_url{
  display: block;
  @include px2rem(margin-bottom, 40);
  @include font-dpr(28);
  @include px2rem(line-height, 40);
  @include px2rem(padding-left, 85);
}
.index_ourl{
  background: url(../../assets/icon/oindex/index.png) no-repeat 0.4rem center;
  @include px2rem(background-size, 40 40);
}
.loan_ourl{
  background: url(../../assets/icon/oindex/jkdd.png) no-repeat 0.4rem center;
  @include px2rem(background-size, 40 40);
}
.category_ourl{
  background: url(../../assets/icon/oindex/category.png) no-repeat 0.4rem center;
  @include px2rem(background-size, 40 40);
}
.personal_ourl{
  background: url(../../assets/icon/oindex/personal.png) no-repeat 0.4rem center;
  @include px2rem(background-size, 40 40);
}
.contactcs_ourl{
  background: url(../../assets/icon/oindex/contactCS.png) no-repeat 0.4rem center;
  @include px2rem(background-size, 40 40);
}
</style>
