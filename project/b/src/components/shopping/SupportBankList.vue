<template>
  <section class="cardWrap">
    <ul class="limitUl" id="bankList">
      <li class="flex" v-for="item in bankNameList" v-show="item.bankName.indexOf(' ')==-1">
          <span class="b_name cell_1">{{item.bankName}}</span>
          <span class="single cell_0">单笔{{item.singleAmt}}</span>
          <span class="oneDay cell_0">单日{{item.dayAmt}}</span>
      </li>
    </ul>
  </section>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        bankNameList: []
      }
    },
    created () {
      this.showLoad(false)
      this.getSupportsList()
    },
    methods: {
      ...mapActions([
        "updateToast"
      ]),
      getSupportsList () {
        let { uid, token } = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.querybank,
          data: {
            uid: uid,
            token: token
          }
        }).then(data => {
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'bankNameList', res.data)
          } else {
            this.updateToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
