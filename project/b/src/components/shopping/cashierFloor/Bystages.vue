<template>
<section>
  <!--商品分期详情s-->
  <ul class="bystages_list flex">
    <li class="bystages_item cell_0" v-for="(item, i) in byStagesDetail" :key="i" @click="caleDownpayment(i, $event)">
      <div class="bystages_box" :class="{'visit_item': index == i}">
        <!-- <p class="question_txt" v-if="index == i" @click="showList"></p> -->
        <p class="bystages_sum font17">{{item.monthAmt}}元x{{item.month}}期</p>
        <!-- <p class="bystages_detial font10"><b>本金 {{item.contractAmt}}元</b> <b>利率 {{item.monthRate}}/月</b></p> -->
      </div>
    </li>
  </ul>
  <!--商品分期详情e-->
  <div class="repayment_box" v-if="isshowList">
    <div class="opa"></div>
    <div class="repayment_list">
      <p class="repayment_close font14" @click="showList">还款详情</p>
      <p class="flex repayment_item">
        <span class="cell_1">期数</span>
        <span class="cell_1">月供</span>
        <span class="cell_1">本金</span>
        <span class="cell_1">利息</span>
      </p>
      <div class="scroll_y">
        <div v-for="(items, ins) in byStagesDetail[index].repaymentList" :key="ins">
          <p class="flex repayment_item" :class="{'noboeder':ins==0}">
            <span class="cell_1 c_666">第{{items.stage}}期</span>
            <span class="cell_1 c_666">{{items.planRepayAmt}}元</span>
            <span class="cell_1 c_666">{{items.principal}}元</span>
            <span class="cell_1 c_666">{{items.interest}}元</span>
          </p>
          <p class="repayment_txt c_999" v-if="ins==0">首期月供根据实际使用天数计息，实际每月还款以账单为准。</p>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      index: 0,
      isshowList: false
    }
  },
  props: ['byStagesDetail', 'cindex'],
  created () {
    if (this.cindex) {
      this.index = this.cindex
    }
  },
  methods: {
    caleDownpayment (i, e) {
      this.index = i
      this.$emit('cutIndex', this.index)
    },
    showList () {
      this.isshowList = !this.isshowList
    }
  }
}
</script>
