<template>
  <header :class="{turnContext:$store.state.route.meta.turnContext}">
    <div class="heder-wrap flex position" :class="{noBorder:$store.state.route.meta.noBorder}">
      <span class="left_btn" @click="backUrl" v-if="!$store.state.route.meta.noLeft"></span>
      <p class="cell_1 center_content font18" >{{headText}}</p>
      <template v-for="_item in $route.meta['titleBtn']">
        <span class="right_btn font16" :key="_item.btnName" @click="triggerCallBack" :class="_item.className" ref='rightBtn' >{{headerBtn.btnClick.BtnText || _item.btnName}}</span>
      </template>
    </div>
  </header>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Base64 from 'lib/base64'
export default {
  data () {
    return {
      isDelive: ''
    }
  },
  computed: {
    ...mapGetters({
      headerBtn: "getheaderBtn"
    }),
    headText () {
      let name = this.$route.name
      if (name === 'comment') {
        return `共${this.$route.query.commentCnt}条评论`
      } else if (name ==='myfans' || name === 'myAttention' || name === 'homePage') {
        return this.$route.query.name || this.$route.meta.title
      } else if (this.$route.query.orderState) {
        switch (this.$route.query.orderState+'') {
          case "1":
            return '待发货'
          case "3":
            return '已发货'
          case "6":
            return '已完成'
        }
      } else if (this.$route.query.payState) {
        switch (this.$route.query.payState+'') {
          case "0":
            return '账单待清算'
          case "3":
            return '账款结算单'
        }
      } else {
        return this.$store.state.route.meta.title ||this.$route.query.name
      }
    }
  },
  methods: {
    ...mapActions([
      "updateheaderBtn"
    ]),
    backUrl () {
      let num =window.localStorage.getItem('num')
      switch (num) {
        case "1":
        case "2":
        case "3":
          this.isDelive = 1
          break
        case "4":
        case "5":
          this.isDelive = 0
          break
      }
      if (this.$store.state.route.fullPath.includes('/creditIndex')) {
        let callBackUrl = window.sessionStorage.getItem('callBackUrl')
        if (callBackUrl) {
          window.location.href = Base64.decode(callBackUrl)
        }
      } else if (this.$store.state.route.fullPath.includes('/verifySuccess')) {
        this.$router.push({path: '/creditIndex'})
      } else if (this.$store.state.route.fullPath.includes('/allOrderDetail')) {
        this.$router.push({path: '/orderDetail'})
      } else if (this.$store.state.route.fullPath.includes('/orderDetail')&&this.isDelive==1) {
        this.$router.push({path: '/todelive'})
      } else if (this.$store.state.route.fullPath.includes('/orderDetail')&&this.isDelive==0) {
        this.$router.push({path: '/tosettle'})
      } else if (this.$store.state.route.fullPath.includes('/todelive')||this.$store.state.route.fullPath.includes('/tosettle')) {
        this.$router.push({path: '/index'})
      } else {
        window.history.go(-1)
      }
    },
    triggerCallBack () {
      if (this.$refs.rightBtn[0].className.indexOf('orderSearch')!=-1) {
        this.$router.push({
          name: 'searchContent'
        })
      }
      if (this.$refs.rightBtn[0].className.indexOf('information')!=-1) {
        window.sessionStorage.removeItem("commodityItem")
        this.$router.push({
          path: '/add'
        })
      }
      let { btnCallBack } = this.headerBtn.btnClick
      btnCallBack && btnCallBack()
    }
  }
}
</script>
