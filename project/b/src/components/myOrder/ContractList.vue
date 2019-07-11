<template>
  <section class="agreementWrap">
    <ul class="xyList" id="contractListWrap">
      <li v-for="(item, i) in contract" :key="i">
        <!-- <a href="javascript:;"  class="c_item" v-text="item.contractTypeName" @click="bindEvent(item.contractUrl,item.contractTypeName)" v-if="isOpenpdf&&item.contractUrl"></a> -->
        <a class="c_item" @click="bindEvent(item.contractUrl)" href="javascript:;" v-text="item.contractTypeName" v-if="item.contractUrl" download></a>
        <h1 class="c_title" v-text="item.contractTypeName" v-else></h1>
      </li>
    </ul>
  </section>
</template>
<script>
  import {getQueryString} from 'lib/until'
  export default {
    data () {
      return {
        contract: ''
      }
    },
    created () {
      this.queryContract()
    },
    methods: {
      bindEvent (contractUrl) {
        window.location.href = contractUrl
      },
      queryContract () {
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.QueryContract,
          data: {
            uid,
            token,
            orderId: this.$store.state.route.query.orderId || getQueryString('orderId')
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status==1) {
            this.$set(this.$data, 'contract', res.data)
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  .xyList {
    padding: .69333rem .4rem;
    margin-top: .13333rem;
    background: #ffffff;
    border-top: 1px solid #e2e2e2;
  }
  .xyList li {
    font-size: 12px;
    margin-bottom: .48rem
  }
  [data-dpr="2"] .xyList li {
    font-size: 24px
  }
  [data-dpr="2.5"] .xyList li {
    font-size: 30px
  }
  [data-dpr="2.75"] .xyList li {
    font-size: 33px
  }
  [data-dpr="3"] .xyList li {
    font-size: 36px
  }
  [data-dpr="4"] .xyList li {
    font-size: 48px
  }
  .xyList li a {
    text-decoration: underline;
    color: #222333
  }
  .c_title{
    color: #3E9BFA;
    font-weight: bold;
  }
</style>
