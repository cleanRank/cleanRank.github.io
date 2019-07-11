<template>
    <section class="message_wrap" v-if="isLoding">
      <ul class="mgs_list" v-if="msgList.length>0">
        <li class="msg_item" v-for="(item, index) in msgList" :key="index" :index="index">
          <!-- receipt time start-->
          <div class="receipt_time">
            {{item.createTime}}
          </div>
          <!-- receipt time end-->
          <!-- message content start -->
          <div class="msg_con" @click="goToUrl(item)">
            <div class="msg_img" v-if="item.h5Url">
              <img class="msg_img_node lazy" v-lazy="item.h5Url" :alt="item.title" title="item.title" lazy="loading">
            </div>
            <div class="msg_tit">{{item.title}}</div>
            <div class="msg_text" v-if="item.appPage!='ORDERNUMBER' && item.appPage!='AFTERSALEPROGRESS' && item.appPage != 'AFTERSALELIST'">{{item.content}}</div>
            <div class="good_details" v-if="item.appPage=='ORDERNUMBER' || item.appPage=='AFTERSALEPROGRESS' || item.appPage == 'AFTERSALELIST'">
              <div  class="good_details_img_con" >
                <img class="good_details_img lazy"  v-lazy="item.orderImage" :alt="item.title" title="item.title"  lazy="loading">
              </div>
              <div class="good_details_name">{{item.content}}</div>
            </div>
            <div class="msg_btn" v-if="item.appPage && item.appPage != ''">
              <div class="line"></div>
              <button type="button" class="read_more">查看更多</button>
            </div>
          </div>
          <!-- message content end -->
        </li>
      </ul>
      <!-- message null start -->
      <div class="msg_null" v-else>
        <img class="msg_null_img" src="../../assets/icon/icon/message_null.png" alt="暂无消息通知">
        <p>暂无通知消息</p>
      </div>
      <!-- message null end -->
    </section>
</template>

<script>
  export default {
    name: 'NotificationMessage',
    data () {
      return {
        isLoding: false,
        msgList: [],
        pageNo: 1,
        pageCount: 1,
        isSCrollLoading: false,
        readId: ''
      }
    },
    created () {
      let scrollTopN = window.sessionStorage.getItem('scrollTopN') || 1
      this.getMesList().then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, scrollTopN)
          window.scrollTo(0, scrollTopN)
        })
      })
    },
    activated () {
      this.showLoad(false)
      let scrollTopN = window.sessionStorage.getItem('scrollTopN') || 1
      this.$nextTick(() => {
        window.addEventListener('scroll', this.onScrolls, false)
        window.scrollTo(0, scrollTopN)
        window.scrollTo(0, scrollTopN)
      })
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.onScrolls, false)
      })
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.onScrolls, false)
      if (to.name != 'Index') {
        let scrollTopN = document.body.scrollTop || document.documentElement.scrollTop
        window.sessionStorage.setItem('scrollTopN', scrollTopN)
      } else {
        // 去首页清空标记
        window.sessionStorage.removeItem('scrollTopN')
      }
      next()
    },
    methods: {
      /* 获取更新通知消息列表 */
      getMesList (n) {
        if (this.pageCount && this.pageCount < this.pageNo) {
          return Promise.resolve()
        }
        this.isSCrollLoading = true
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.UserMessageShow,
          data: {
            uid,
            token,
            pageNo: this.pageNo
          }
        }).then(data => {
          this.isSCrollLoading = false
          this.isLoding = true
          this.showLoad(false)
          let res = data.data
          if (res.status === "1") {
            this.pageNo ++
            this.pageCount = res.pageCount
            if (!n) {
              this.$set(this.$data, 'msgList', res.data)
            } else {
              this.msgList = this.msgList.concat(res.data)
            }
            this.readId = ''
            res.data.forEach((item, i) => {
              this.readId += item.messageId+ ","
            })
            if (this.readId.length > 0) {
              this.readId = this.readId.substr(0, this.readId.length - 1)
            }
            this.updateMsgStatus(this.readId)
          }
        })
      },
      /* 修改推送消息状态 */
      updateMsgStatus (messageId) {
        let {uid, token} = this.$store.state.userInfo
        let type = ''
        this.$post({
          url: this.$store.state.api.UpdateUserMessage,
          data: {
            uid,
            token,
            messageId,
            type
          }
        }).then(data => {
          let res = data.data
          if (res.status != "1") {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      goToUrl (item) {
        if (item.appPage == 'ORDERNUMBER') {
          // 查看订单详情
          if (item.orderType) {
            this.$router.push({path: item.orderType== '0' ? 'orderdetail': 'movieOrderdetail', query: {orderId: item.appParams}})
          }
        } else if (item.appPage == 'AFTERSALEPROGRESS' || item.appPage == 'AFTERSALELIST') {
          // 售后
          this.$router.push({path: '/aftersaleslist'})
        } else if (item.appPage == 'CLASSIFY') {
          // 商品详情页
          this.$router.push({path: '/detail', query: {productNo: item.appParams}})
        } else if (item.appPage == 'BILLPAGE') {
          // 跳白条账单
          let userId = this.$store.state.userInfo.userId
          let url = process.env.SXBTURL['REPAY']
          let fromChannel = this.$store.state.config.fromChannel
          window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}`
        } else if (item.appPage == 'WEBONLY') {
          // 后台链接跳转
          window.location.href = item.appParams
        }
      },
      onScrolls () {
        if (this.isBottom() && !this.isSCrollLoading) {
          this.getMesList(1)
        }
      },
      isBottom () {
        return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
      }
    }
  }
</script>

<style scoped>

</style>
