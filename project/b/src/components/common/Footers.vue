<template>
<div class="flex footer_wrap">
  <p class="cell_1" v-for="(item, i) in footerList" :key="i" :class="[item.name == $route.name?'footer_active_' + $route.name:'footer_item_0'+ i]"  @click="tabActive(item.link, i)">{{item.iconName}}</p>
</div>
</template>
<script>
import Base64 from 'lib/Base64'
export default {
  data () {
    return {
      footerList: [
        {
          'iconName': '首页',
          'link': '/',
          'name': 'Index'
        },
        {
          'iconName': '品类',
          'link': '/category',
          'name': 'Category'
        },
        {
          'iconName': '合伙人',
          'link': '/vip',
          'name': 'Vip'
        },
        {
          'iconName': '购物车',
          'link': '/shopCart',
          'name': 'ShopCart'
        },
        {
          'iconName': '我的',
          'link': '/personal',
          'name': 'Personal'
        }
      ]
    }
  },
  methods: {
    tabActive (link, i) {
      // if (i == 3 && !this.$store.state.userInfo.token) {
      //   this.$router.push('/login')
      //   return false
      // }
      this.$router.push(link)
    },
    goLoan () {
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
    }
  }
}
</script>
