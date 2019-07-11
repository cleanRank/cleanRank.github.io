<template>
<section class="repaymentWrap" v-if="isLoding">
  <ul class="advance_repayment_list">
    <li class="advance_repayment_item" v-for='(checkb, idex) in checkboxList' :key="idex">
      <div class="flex advance_repayment_title repaydetail_title" :class="{'checked_btn':checkList.indexOf(checkb)>-1,'checked_zh':checkb.withholdStatus==1}" @click="checked(checkb)">
        <p class="cell_0 c_999">{{checkb.loanInfo}}</p>
        <p class="cell_1 c_777 tr">第{{checkb.period}}期</p>
      </div>
      <p class="flex repay_money">
        <span class="cell_0 return_money">¥{{checkb.totalMoney}}</span><span class="cell_0 c_red repay_suatus" v-if="checkb.billStatus!=2">未结清</span><span class="cell_1 c_777 repay_type tr">{{checkb.usage}}</span>
      </p>
      <p class="flex hkfs_type"><span class="cell_1 c_999">还款方式</span><span class="cell_1 tr c_777">{{checkb.repayType==1?'等额本息':'等额本金'}}</span></p>
      <p class="flex hkfs_type"><span class="cell_1 c_999">还款账户</span><span class="cell_1 tr c_777">{{checkb.bankName}}（{{checkb.bankcardNo}}）尾号</span></p>
    </li>
  </ul>
  <div class="flex addorder_box" v-if="checkboxList.length>0">
    <p class="cell_1 money_txt" @click="checkall">
      <input type="checkbox" class="agree" name="radioContent" :checked="isCheckAll" ><span class="c_777 font17">总计：¥{{allMoney}}元</span>
    </p>
    <p class="cell_0 confirmorder_btn" :class="checkList.length>0?'':'hui'" @click="confirm()">{{filterList.length==checkboxList.length?'还款中':'立即还款'}}</p>
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
      checkboxList: {},
      checkList: [],
      filterList: [],
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
  computed: {
    allMoney () {
      // 计算金额
      let totalMoney = 0
      Object.values(this.checkList).forEach(function (val) {
        if (!val) return false
        totalMoney = parseFloat(totalMoney) + parseFloat(val.totalMoney)
      })
      return totalMoney.toFixed(2)
    },
    planIds () {
      // 选中的账单id
      let planIds = []
      Object.values(this.checkList).forEach(function (val) {
        if (!val) return false
        planIds.push(val.planid)
      })
      return planIds
    },
    isCheckAll () {
      if (this.filterList.length>0 && this.filterList.length != this.checkboxList.length) {
        return this.checkList.length + this.filterList.length == this.checkboxList.length
      } else {
        return this.checkList.length === this.checkboxList.length
      }
    }
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
    checkall () {
      if (this.isCheckAll) {
        this.checkList = []
      } else {
        this.checkList = []
        this.filterList = []
        this.checkboxList.forEach((item) => {
          // 订单含有代扣状态不能全选/取消
          if (item.withholdStatus != 1) {
            this.checkList.push(item)
          } else {
            this.filterList.push(item)
          }
        })
      }
    },
    checked (item) {
      // 代扣中订单不能进行选择
      if (item.withholdStatus==1) return false
      if (this.checkList.indexOf(item) > -1) {
        let index = this.checkList.indexOf(item)
        this.checkList.splice(index, 1)
      } else {
        this.checkList.push(item)
      }
    },
    confirm () {
      if (this.checkList.length==0) return false
      this.showLoad(true)
      // 还款结果
      return this.$post({
        url: this.$store.state.api.manualRepayByBF,
        data: {
          centerUserId: this.$store.state.userInfo.userId,
          planIds: this.planIds.join(',')
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == "1") {
          this.$router.push({
            path: 'repayResult',
            query: {
              tradeNo: res.data
            }
          })
        } else {
          // 60 余额不足，其余支付失败
          this.$router.push({
            path: 'repayResult',
            query: {
              status: res.status
            }
          })
        }
      })
    },
    getlist (type) {
      // 查询还款详情
      if (this.pageCount < this.pageNo) {
          // this.showToast({msg: '没有更多订单了'})
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      return this.$post({
        url: this.$store.state.api.getBillDetails4repay,
        data: {
          centerUserId: this.$store.state.userInfo.userId,
          billid: this.$store.state.route.query.billid,
          pageNo: this.pageNo
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        this.isSCrollLoading = false
        if (res.status == "1") {
          this.pageCount = res.data.pageCount
          this.pageNo += 1
          if (!type) {
            this.$set(this.$data, 'checkboxList', res.data.billDetailList)
          } else {
            this.checkboxList = this.checkboxList.concat(res.data.billDetailList)
          }
          // 默认全选
          this.checkList = []
          this.checkboxList.forEach((item) => {
            // 判断是否有代扣中单子
            if (item.withholdStatus != 1) {
              this.checkList.push(item)
            } else {
              this.filterList.push(item)
            }
          })
        } else if (res.status === "11") {
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
.repaymentWrap{
  padding-bottom: 1.73334rem;
}
.addorder_box{
  .agree{
    width: 0.45333rem;
    height: 1.30667rem;
    background-position: center 0.35rem;
    background-size: 0.45333rem;
  }
  .agree:checked{
    background-position: center 0.35rem;
   background-size: 0.45333rem;
  }
}
</style>
