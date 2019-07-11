<template>
  <section class="new-personal-wrap" v-show="isShow">
    <div class="new-personal-info-bg">
      <div class="ml-mr-24 new-personal-info">
        <div class="new-personal-portrait" @click="getLogin">
          <img v-if="pictureName.img" :src="pictureName.img" alt="">
        </div>
        <div class="new-personal-tel" :class="{'new-personal-tel-style': $store.state.userInfo.uid && this.$store.state.userInfo.token}" @click="getLogin">{{$store.state.userInfo.uid && this.$store.state.userInfo.token? (pictureName.nickName?pictureName.nickName:'未设置昵称') :'注册/登录'}}</div>
        <router-link tag="div" to="/notificationMessage" class="message-status">
          <span class="msg_num " v-if="msgNum" :class="{'msgNumTwo': msgNum > 9}">{{msgNum>99?99:msgNum}}</span>
        </router-link>
      </div>
    </div>
    <div class="new-personal-content">
      <div class="new-personal-menu ml-mr-24">
        <div class="new-personal-loan" :class="{'mb-32': (!UserRePayStatus && $store.state.switchInfo.whiteInstalment == '1') || (UserRePayStatus && $store.state.switchInfo.manualRepayInstalment == '1')}">
          <!-- 额度激活状态 start -->
          <div class="new-personal-loan-details" v-if="UserRePayStatus && ($store.state.switchInfo.whiteInstalment == '1' || $store.state.switchInfo.manualRepayInstalment == '1')">
            <!-- 白条开关 -->
            <div class="new-personal-loan-bill loan-available-credit" @click="loanActive" v-if="$store.state.switchInfo.whiteInstalment == '1'" :class="{'mb-28': $store.state.switchInfo.manualRepayInstalment == '1'}">
              <p class="color-bule loan-available-credit-number">{{PaymentInfo.usableQuota | fixed2NoRound}}</p>
              <p class="loan-available-credit-txt">可用余额 (元)</p>
            </div>
            <!-- 主动还款开关 -->
            <div class="reimbursement" v-if="$store.state.switchInfo.manualRepayInstalment == '1'">
              <router-link  to="repayment" class="new-personal-loan-bill loan-repayment" tag="div">
                <p class="loan-repayment-t">{{PaymentInfo.noRepayMoney | fixed2NoRound}}</p>
                <p class="loan-repayment-b">待还金额 (元)</p>
              </router-link>
              <div class="new-personal-loan-bill loan-repayment before">
                <p class="loan-repayment-t">{{PaymentInfo.rePayDay == "0"?'暂无' : '每月'+PaymentInfo.rePayDay+'日'}}</p>
                <p class="loan-repayment-b">还款日</p>
              </div>
            </div>
          </div>
          <!-- 额度激活状态 end -->
          <!-- 未激活状态 start -->
          <div v-if="!UserRePayStatus && $store.state.switchInfo.whiteInstalment == '1'" class="new-personal-loan-not-active" @click="loanActive">
            <div class="new-personal-loan-ceiling">
              <em>最高￥</em><b>20,000</b>
            </div>
            <div class="new-personal-loan-active-btn">额度激活</div>
          </div>
          <!-- 未激活状态 end -->
        </div>
        <!-- 订单、服务导航组件 -->
        <div :class="['new-personal-order', index!=0?'other_list_wrap':'']" v-for="(item, index) in panelObj" :key="index">
          <p class="new-personal-title">{{item.title}}</p>
          <ul  :class="['new-personal-list', index==0 ? 'flex':'']">
            <li :class="['new-personal-order-item', index==0 ? 'cell_1':'', item.imgUrl+(idx+1)]" v-for="(_item, idx) in item.icon"  v-if="_item.show != '0'" :key="idx">
              <router-link :to="{path: _item.path, query: _item.query}" tag="dl">
                <dt><span class="shopCartNum order-sup-num" :class="{'doubleNum': _item.num > 99}" v-if="_item.num >0">{{99>=_item.num?_item.num:''}}</span></dt>
                <dd>{{_item.name}}</dd>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import BodyBg from '../../mixin/index'
  import { gocredit, jointLand, getHiddenText } from 'lib/until'
  import { mapActions } from 'vuex'
  export default {
    name: "NewPersonal",
    mixins: [BodyBg],
    data () {
      return {
        countorderObj: {},
        mobile: getHiddenText(this.$store.state.userInfo.mobile, 3, 6, 1),
        PaymentInfo: {}, // 用户还款信息
        UserRePayStatus: false, // 用户额度激活状态
        msgNum: 0, // 未读消息数量
        isShow: false,
        panelObj: [
          {
            title: '我的订单',
            imgUrl: 'personal-order',
            icon: [
              {
                name: '待付款',
                path: 'orderList',
                num: 0,
                query: {
                  orderIndex: 1
                }
              },
              {
                name: '待收货',
                path: 'orderList',
                num: 0,
                query: {
                  orderIndex: 3
                }
              },
              {
                name: '待评论',
                path: 'orderList',
                num: 0,
                query: {
                  orderIndex: 4
                }
              },
              {
                name: '售后/退换',
                path: 'aftersaleslist',
                num: 0,
                query: {}
              },
              {
                name: '全部订单',
                path: 'orderList',
                num: 0,
                query: {
                  orderIndex: 0
                }
              }
            ]
          },
          {
            title: '我的服务',
            imgUrl: 'personal-service',
            icon: [
              {
                name: '借还订单',
                path: 'loanList',
                num: -1,
                query: {}
              },
              {
                name: '银行卡',
                path: 'myBankCart',
                num: -1,
                query: {}
              },
              {
                name: '优惠券',
                path: 'myRedpacket',
                num: -1,
                query: {}
              },
              // {
              //   name: '我的收藏',
              //   path: 'myCollection',
              //   num: -1,
              //   query: {}
              // },
              {
                name: '联系客服',
                path: 'contactCS',
                num: -1,
                query: {}
              },
              {
                name: '帮助中心',
                path: 'helpIndex',
                num: -1,
                query: {}
              },
              {
                name: '意见反馈',
                path: 'feedback',
                num: -1,
                query: {}
              },
              {
                name: '关注',
                path: 'concern',
                num: -1,
                query: {}
              }
            ]
          }
        ],
        pictureName: {}
      }
    },
    created () {
      this.showLoad(false)
      this.getSwitch()
      let { uid, token } = this.$store.state.userInfo
      if (uid && token) {
        this.showLoad(true)
        this.getOrderCount()
        this.getUserRePayInfo()
        this.getMessageNum()
        this.getPictureName()
      }
    },
    filters: {
      fixed2NoRound: function (money) {
        let newMoney= money.toFixed(2)
        return newMoney
      }
    },
    methods: {
      ...mapActions([
        "updateSwitchInfo"
      ]),
      // 查询用户头像昵称
      getPictureName () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.userInfo,
          data: {
            uid,
            token,
            userInfoFlag: 0
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == '1') {
            this.pictureName = res
          }
        })
      },
      // 更新总开关
      getSwitch () {
        this.$post({
          url: this.$store.state.api.FinanceSwitch,
          data: {
            uid: this.$store.state.userInfo.uid ? this.$store.state.userInfo.uid: '',
            token: this.$store.state.userInfo.token ? this.$store.state.userInfo.token: ''
          }
        }).then(({data: res}) => {
          if (res.status == '1') {
            this.updateSwitchInfo({...res})
            this.panelObj[1].icon.forEach((item, index) => {
              if (item.path == 'loanList') {
                item.show = this.$store.state.switchInfo.lentOrderInstalment
              } else if (item.path == 'helpIndex') {
                item.show = this.$store.state.switchInfo.helpcenterInstalment
              }
            })
            this.isShow = true
          }
        })
      },
      // 获取未读消息数量
      getMessageNum () {
        this.$post({
          url: this.$store.state.api.UserMessageUnRead,
          data: {
            uid: this.$store.state.userInfo.uid,
            token: this.$store.state.userInfo.token
          }
        }).then(({data: res}) => {
          if (res.status === "1") {
            this.msgNum = parseFloat(res.data)
          }
        })
      },
      // 查询登录
      getLogin () {
        let { uid, token } = this.$store.state.userInfo
        if (uid == '' && token == '') {
          this.$router.push('/login')
        } else {
          this.$router.push('/set')
        }
      },
      // 获取待付款-待收货-售后/退换 订单数量
      getOrderCount () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.querycountorder,
          data: {
            uid: uid,
            token: token
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.countorderObj = {
              dfh: res.dfh,
              dsh: res.dsh,
              dzf: res.dzf,
              ywc: res.ywc,
              shth: res.shth
            }
            this.$set(this.$data, 'countorderObj', this.countorderObj)
            this.panelObj[0].icon.forEach((item, index) => {
              if (index == 0) {
                item.num = this.countorderObj.dzf
              } else if (index == 1) {
                item.num = this.countorderObj.dsh
              } else if (index == 2) {
                item.num = this.countorderObj.ywc
              } else if (index == 3) {
                item.num = this.countorderObj.shth
              }
            })
          }
        })
      },
      // 获取用户借款信息
      getUserRePayInfo () {
        let openId = this.$store.state.userInfo.userId
        this.$post({
          url: this.$store.state.api.getUserRePayInfo,
          data: {
            centerUserId: openId
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'PaymentInfo', res.data)
            this.$set(this.$data, 'UserRePayStatus', true)
          } else if (res.status == "28") {
            this.$set(this.$data, 'UserRePayStatus', false)
          }
        })
      },
      // 去激活额度
      loanActive () {
        if (!this.$store.state.userInfo.token) {
          jointLand()
          return false
        }
        // 去白条
        gocredit()
      }
    }
  }
</script>
