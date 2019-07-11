<template>
<section v-if="isLoading">
  <div class='flex time_list_tab'>
    <div class='cell_1' v-for="(item, index) in timeList" :key="index" v-if="index!=1" @click="getTabindex('tabIndex',index)">
      <span :class="[tabIndex==index?'tab_a':'']">{{item}}</span>
    </div>
  </div>
  <div class='fans_number_box'>
    <router-link tag="p" to="/explainTxt" class='explain_txt font12'>返利说明</router-link>
    <p class='fans_num'>{{incomeList.totalAmount}}</p>
    <p class='my_fans c_999 font14'>预计收入(元)</p>
    <p class='my_fans c_999 font14'>{{incomeList.beginTime}} ~ {{incomeList.endTime}}</p>
  </div>
  <div class="order_rebate_title flex" v-if="incomeList.ordeList.length>0">
    <p class='dd_fl c_777 cell_1 font15'>订单列表</p>
    <p class='cell_1 c_333 sxtj_btn font12' v-if="tabIndex==3" @click="incomeCondition">筛选条件<span class='up_v c_777'>v</span></p>
  </div>
  <!-- 收入列表s -->
  <div class="order_rebate_list" v-for="(item, index) in incomeList.ordeList" :key="index">
    <div class='flex order_rebate_item'>
      <p class='cell_0 c_777 order_rebate_left'>返利类型：</p>
      <p class='cell_1 order_rebate_rig'>{{typeList[item.type-1]}}</p>
      <p class='cell_1 th_order c_333'>{{settleStatusList[item.settleStatus]}}</p>
    </div>
    <div class='flex order_rebate_item'>
      <p class='cell_0 c_777 order_rebate_left'>订单号：</p>
      <p class='cell_1 order_rebate_rig'>{{item.orderId}}</p>
    </div>
    <div class='flex order_rebate_item'>
      <p class='cell_0 c_777 order_rebate_left'>返利时间：</p>
      <p class='cell_1 order_rebate_rig'>{{item.incomeTime}}</p>
    </div>
    <div class='flex order_rebate_item'>
      <p class='cell_0 c_777 order_rebate_left'>来源用户：</p>
      <p class='cell_1 order_rebate_rig'>{{item.fromNickName}}</p>
      <p class='cell_1 th_order c_777'>本单返利：<span class='c_red'>{{item.amount}}元</span></p>
    </div>
  </div>
  <!-- 收入列表 e -->
  <!-- 筛选条件 s -->
  <div class='screen_wrap' v-if="isShowsxk">
    <div class="screen_mask" @click="closeTk"></div>
    <div class='screen_box'>
      <div class='screen_title flex'>
        <p class='c_777 cell_1'>筛选条件</p>
        <p class='c_333 clear_btn cell_1' @click="clearScreen">清空</p>
      </div>
      <div class='flex screen_item'>
        <p class='cell_0 c_777 screen_left'>时间</p>
        <div class='cell_1 screen_rig'>
          <div class="picker_btn">
            <p @click="showCalender(1)" class="time_zz">{{beginTime?beginTime:'起始时间'}}</p>
            <calendar
              v-model="calendarShow"
              @change="handelChange">
            </calendar>
          </div>
          ~
          <div class="picker_btn">
            <p @click="showCalender(2)" class="time_zz">{{endTime?endTime:'截止时间'}}</p>
            <!-- <calendar
              v-model="calendarShow"
              @change="handelChange">
            </calendar> -->
          </div>
        </div>
      </div>
      <div class='flex screen_item'>
        <p class='cell_0 c_777 screen_left'>返利类型</p>
        <div class='cell_1 screen_rig'>
          <p :class="['screen_btn', type-1===index?'screen_btn_a':'']"
          @click="getTabindex('type',index)"
          v-for="(item, index) in incomeConditionList.typeList"
          :key="index">{{item.name}}</p>
        </div>
      </div>
      <div class='flex screen_item'>
        <div class='cell_0 c_777 screen_left'>可提现状态</div>
        <div class='cell_1 screen_rig'>
          <p :class="['screen_btn', settleStatus===index?'screen_btn_a':'']"
            @click="getTabindex('settleStatus',index)"
            v-for="(item, index) in incomeConditionList.settleStatusList"
            :key="index"
          >{{item.name}}</p>
        </div>
      </div>
      <p class='query_btn' @click="getIncome">查询</p>
    </div>
  </div>
  <!-- 筛选条件 e -->
</section>
</template>
<script>
import Vue from 'vue'
import Calendar from 'vue-mobile-calendar'
Vue.use(Calendar)
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoading: false,
      timeList: ['本日', '本周', '本月', '累计'],
      tabIndex: this.$store.state.route.query.tabIndex || 0,
      incomeList: {},
      typeList: ['拉新收入', '销售收入', '团队奖励'],
      settleStatusList: ['不可提现', '可提现', '退款', '不可提现'],
      incomeConditionList: {},
      isShowsxk: false, // 是否显示筛选框
      beginTime: '', // 起始时间
      endTime: '', // 截止时间
      type: '', // 1, 拉新收入; 2, 销售收入; 3, 团队奖励
      settleStatus: '', // 0,未结算;1,已结算;2,退款
      calendarShow: false,
      timeType: 1
    }
  },
  created () {
    this.getIncome()
  },
  methods: {
    showCalender (type) {
      this.timeType = type
      this.calendarShow = !this.calendarShow
    },
    handelChange (date, formatDate) {
      this.calendarShow = !this.calendarShow
      if (this.timeType == 1) {
        this.beginTime = formatDate
      } else {
        this.endTime = formatDate
      }
    },
    getTabindex (type, index) {
      this.$set(this.$data, type, type=='type'?index+1 : index)
      if (type == "tabIndex") {
        this.clearScreen()
        this.getIncome()
      }
    },
    clearScreen () {
    // 清空筛选条件
      this.beginTime = ''
      this.endTime = ''
      this.type = ''
      this.settleStatus = ''
    },
    getIncome () {
      // 收入明细
      this.isShowsxk = false
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.income,
        data: {
          uid,
          token,
          'flag': (+this.tabIndex) + 1, // 1,表示本日;2,表示本周;3,表示本月;4,表示累计
          "beginTime": '', // 查询开始时间
          "endTime": '', // 结束时间
          "type": this.type, // 1, 拉新收入; 2, 销售收入; 3, 团队奖励
          "settleStatus": this.settleStatus // 0,未结算;1,已结算;2,退款
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.isLoading = true
        if (res.status == '1') {
          this.$set(this.$data, 'incomeList', res)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    incomeCondition () {
      // 筛选框
      this.isShowsxk = true
      this.$post({
        url: this.$store.state.api.incomeCondition,
        data: {}
      }).then(({data: res}) => {
        if (res.status == '1') {
          this.$set(this.$data, 'incomeConditionList', res)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    closeTk () {
      // 关闭弹框
      this.calendarShow = !this.calendarShow
      this.isShowsxk = false
    }
  }
}
</script>
