<template>
<section class="repaymentWrap" v-if="isLoding">
  <ul class="advance_repayment_list" v-if="repayList.length>0">
    <li class="advance_repayment_item" v-for="(item, i) in repayList" :key="i" @click="goNextpage(item)">
      <div class="flex advance_repayment_title" :class="{'canRepay_go':item.canRepay==1}">
        <p class="cell_0 c_999">{{item.withholdDate | timeFormat(1)}} 应还款(元)</p>
        <p class="cell_0" v-if="item.overdue==1"><span class="overdue_btn c_red">逾期</span></p>
      </div>
      <p class="flex repay_money"><span class="cell_1 c_blue return_money">¥{{item.billMoney}}</span><span class="cell_1 c_red not_repay" v-if="item.billStatus!=2">未结清</span></p>
      <p class="account_card">自动划扣已绑定账户  {{item.bankName}}（{{item.bankCardNo}}）尾号</p>
    </li>
  </ul>
  <div class="repay_result" v-else>
    <img src="../../assets/icon/repayment/myhklb.png">
    <p class="c_999 font17">赞！本月全还清了～</p>
  </div>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoding: false,
      repayList: {},
      isSCrollLoading: false,
      pageNo: 1,
      pageCount: 1
    }
  },
  created () {
    this.getlist()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    next()
  },
  methods: {
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.getlist('1')
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    },
    goNextpage (item) {
      // canRepay = 1 去还款详情
      if (item.canRepay&&item.canRepay==1) {
        this.$router.push({
          path: 'repayDetail',
          query: {
            billid: item.id
          }
        })
      }
    },
    getlist (type) {
      // 提前还款页面进入登录页面，登录成功之后需要返回提前还款页面
      let {token, userId} = this.$store.state.userInfo
      if (!token) {
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
        return false
      }
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      return this.$post({
        url: this.$store.state.api.getBills4repay,
        data: {
          centerUserId: userId,
          pageNo: this.pageNo
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        this.isSCrollLoading = false
        if (res.status == "1") {
          this.pageCount = res.data.pageCount
          this.pageNo++
          if (!type) {
            this.$set(this.$data, 'repayList', res.data.billList)
          } else {
            this.repayList = this.repayList.concat(res.data.billList)
          }
        } else if (res.status === "11") {
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
