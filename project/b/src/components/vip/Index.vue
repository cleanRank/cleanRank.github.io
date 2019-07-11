<template>
<section v-if="isLoading">
  <div class='flex vip_message_wrap'>
      <div class='cell_0 vip_header_box'>
        <img class='vip_header_img' :src="memberList.avatarUrl">
      </div>
      <div class='cell_1 message_box'>
        <div class='nickName_box'>
          <span>{{memberList.nickName}}</span>
          <span class='user_grade'>{{memberLevellist[memberList.memberLevel]}}</span>
        </div>
        <p class='c_999 pName_box'>邀请人: {{memberList.upNickName}}</p>
        <div class='Invitecode_boc'>
          <div>邀请码：<span class='c_blue'>{{memberList.inviteCode}}</span><p class='copy_btn' @click="doCopy(memberList.inviteCode)">复制</p></div>
        </div>
      </div>
    </div>
    <div class='share_box' v-if="memberList.sharePic" @click="shareBind">
      <img :src="memberList.sharePic">
    </div>
    <div class="my_user_wrap" v-if="memberList.memberLevel!='0'">
      <!-- <router-link to="/fansIndex" tag="p" class="user_title font15">我的用户</router-link> -->
      <p class="user_title font15 no_tab">我的用户</p>
      <div class="my_user_list flex">
        <template v-for="(item, i) in fansList">
          <div class="my_user_item cell_1" :key="i" v-if="(i!=1||i!=3)&& memberList.memberLevel !='0'">
            <p class="font17">{{item.num}}</p>
            <p class="c_999 font14">{{item.name}}</p>
          </div>
        </template>
      </div>
    </div>
    <div class="my_user_wrap" v-if="memberList.memberLevel!='0' || (memberList.memberLevel==0&&memberList.whiteFans==1)">
      <router-link tag="p" :to="{ path: 'incomeDetails', query: { tabIndex: 3}}" class="user_title font15">我的收入（元）</router-link>
      <div class="flex expect_revenue_list">
        <div class="cell_1 expect_revenue_item_left">
          <router-link tag="div" :to="{ path: 'incomeDetails', query: { tabIndex: 0}}" class="today_item">
            <p class="today_money">{{memberList.todayIncome}}</p>
            <p class="c_999 font12">今日 (元)</p>
          </router-link>
          <router-link tag="div" :to="{ path: 'incomeDetails', query: { tabIndex: 2}}" class="flex month_item">
            <div class="cell_1">
              <p class="font15">{{memberList.monthIncome}}</p>
              <p class="c_999 font12">本月 (元)</p>
            </div>
            <router-link tag="div" :to="{ path: 'incomeDetails', query: { tabIndex: 3}}" class="cell_1">
              <p class="font15">{{memberList.totalIncome}}</p>
              <p class="c_999 font12">累计 (元)</p>
            </router-link>
          </router-link>
        </div>
        <div class="cell_0 expect_revenue_item_rig">
          <p class="c_red font17 account_balance_num">{{memberList.cashableIncome}}</p>
          <p class="c_999 font12 account_balance_txt">可提现余额（元)</p>
          <router-link tag="p" to="/cashingMoney" class="go_cashingMoney_btn c_blue">提现</router-link>
        </div>
      </div>
    </div>
</section>
</template>
<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      memberList: {},
      fansList: [],
      memberLevellist: ['首席体验官', '银牌合伙人', '金牌合伙人'],
      isLoading: false
    }
  },
  created () {
    this.getMember()
  },
  methods: {
    doCopy (val) {
      let _t = this
      this.$copyText(val).then(function (e) {
        _t.showToast({msg: '复制成功'})
      }, function (e) {
        _t.showToast({msg: '复制失败'})
      })
    },
    shareBind () {
      this.showToast({msg: '请下载最新版本的客户端'})
    },
    getMember () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.memberNew,
        data: {
          uid,
          token
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.isLoading = true
        if (res.status == '1') {
          this.$set(this.$data, 'memberList', res.data)
          let {followerCount, superFansCnt, browserFansCnt7days, buyerFansCnt} = res.data
          let fansList = [
            {
              name: '已邀粉丝',
              num: followerCount
            },
            {
              name: '已邀合伙人',
              num: superFansCnt
            },
            {
              name: '我的买家',
              num: buyerFansCnt
            },
            {
              name: '我的访客',
              num: browserFansCnt7days
            }]
          this.$set(this.$data, 'fansList', fansList)
        }
      })
    }
  }
}
</script>
