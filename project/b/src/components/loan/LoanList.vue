<template>
<section class="loan_list_wrap" v-if="isLoding">
  <div class="colorBlock position"></div>
  <p class="flex loan_list position">
    <span class="cell_1" :class="{'visited_span':type==1}" @click="checkType('1')">借款</span>
    <span class="cell_1" :class="{'visited_span':type==2}" @click="checkType('2')">还款</span>
  </p>
  <div class="gaod"></div>
  <div class="nodata_order" v-if="isNodata && !loanList">
    <img src="../../assets/icon/loan/kong.png">
    <p>您还没有相关订单</p>
  </div>
  <ul class="loan_list_box" v-else>
    <li @click="goLoanDetail(item.appid, item.id)" v-for="(item, i) in loanList" :key="i" class="loan_item">
      <p class="loanorder_num">{{type==2?'还款流水号：':'借款订单号：'}}{{item.appid}}</p>
      <div class="flex loan_item_detail">
        <div class="cell_1 loan_status_code" :class="type==2?'loan_status_03':'loan_status_0'+item.loanStatus">
          <p class="loan_money">{{item.appayAmt}}</p>
          <p class="c_999 loan_time">{{item.appayDate}}</p>
        </div>
        <div class="cell_0 font14 orderloan_status_code" :class="'orderloan_status_0'+item.borrowStatus" v-if="type==1">{{item.borrowStatusDes}}</div>
      </div>
    </li>
  </ul>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      type: 1,
      loanList: '',
      isNodata: false,
      pageId: '',
      isSCrollLoading: 0,
      isLoding: false
    }
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    // 判断是否是借款成功/失败页过来
    if (this.$store.state.route.from.name === 'PaysuccessLoan' && to.name == 'PaysuccessLoan') {
      next(false)
      window.history.go(-4)
    } else {
      next()
    }
  },
  mounted () {
    this.getLoanlist()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  methods: {
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.showLoad(true)
        this.getLoanlist(1)
      }
    },
    isBottom () {
      let bodyHeight = Math.floor((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight)
      let scrollHeight = document.body.scrollHeight
      if (bodyHeight + 20 >= scrollHeight) {
        return 1
      } else {
        return 0
      }
    },
    checkType (type) {
      this.showLoad(true)
      this.type = type
      this.isLoding = false
      this.$set(this.$data, 'loanList', '')
      this.isSCrollLoading = 0
      this.pageId = ''
      this.getLoanlist()
    },
    goLoanDetail (appid, id) {
      if (this.type==1) {
        this.$router.push({path: 'loanDetail', query: {appid, id}})
      }
    },
    getLoanlist (type) {
      let { uid, token } = this.$store.state.userInfo
      if (!token) {
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
        return false
      }
      if (type) {
        this.isSCrollLoading = 1
      }
      this.$post({
        url: this.$store.state.api.CashLoan,
        data: {
          uid: uid,
          token: token,
          type: this.type,
          id: this.pageId
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        this.pageId = res.pageId
        if (res.status === "1") {
          this.isNodata = false
          res.data.forEach((item) => {
            // 处理数据，便于控制样式
            if (item.borrowStatus == 0 || item.borrowStatus == 14 || item.borrowStatus == 1) {
              // 审核中
              item.borrowStatus = 1
            } else if (item.borrowStatus == 2 || item.borrowStatus == 7 || item.borrowStatus == 8 || item.borrowStatus == 3 || item.borrowStatus == 6 || item.borrowStatus ==13) {
              // 未通过
              item.borrowStatus = 2
            }
          })
          // this.$set(this.$data, 'loanList', res.data)
          if (!type) {
            this.$set(this.$data, 'loanList', res.data)
          } else {
            this.loanList = this.loanList.concat(res.data)
            this.isSCrollLoading = 0
          }
        } else if (res.status === "11") {
          this.isNodata = true
          this.isSCrollLoading = 1
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.position{
  top: 1.16333rem;
}
</style>

