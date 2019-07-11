<template>
<section>
  <div class="cashingRecordWrap" v-if="cashingRecordList.length>0">
    <div class="cashingRecordItem flex">
      <p class="cashingTime c_333 cell_2">提现申请时间</p>
      <p class="cashingMoney c_333 cell_1">提现金额(元)</p>
      <p class='cashingStatus c_333 cell_1'>提现状态</p>
    </div>
    <div class="cashingRecordItem flex" v-for="(item, i) in cashingRecordList" :key="i">
      <p class="cashingTime c_999 cell_2">{{item.createTime}}</p>
      <p class="cashingMoney c_333 cell_1">{{item.amount}}元</p>
      <p :class="['cashingStatus', 'cell_1', 'cashingStatus_0' + item.auditStatus ]">{{cashingList[item.auditStatus]}}</p>
    </div>
    <div class="horizontalLine"></div>
  </div>
  <div v-else class="cashingRecordNull c_999 font14">暂无提现记录</div>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      cashingRecordList: {},
      cashingList: ['待审核', '审核通过', '审核拒绝']
    }
  },
  created () {
    this.getCashingRecord()
  },
  methods: {
    getCashingRecord () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.queryDetail,
        data: {
          uid,
          token
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.isLoading = true
        if (res.status == '1') {
          this.$set(this.$data, 'cashingRecordList', res.data)
        }
      })
    }
  }
}
</script>
