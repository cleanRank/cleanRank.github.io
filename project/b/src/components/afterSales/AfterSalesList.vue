<template>
<section class="aftersales_wrap" v-if="isLoding">
  <div class="flex as_list_title">
    <p :class="['cell_0', tabIndex == i?'cur_btn':'']" @click="bindTab(i)" v-for="(item, i) in tabTitle" :key="i">{{item}}</p>
  </div>
  <div class="as_search_box flex" v-if="tabIndex == 0">
    <input type="input" ref="searchInputEl" v-on:input="onFocusHandler" class="search_input cell_0" placeholder="请输入商品名称、订单号" v-model="searchWord">
    <span class="clear_word" v-if="searchWord" @click="clearInput"></span>
    <span class="cell_1 as_search_btn c_999 font15" @click="searchOrder">搜索</span>
  </div>
  <ul class="as_list_wrap" v-if="afterSaleList.length>0">
    <template v-for="(item, i) in afterSaleList">
    <li class="as_item_box" :key="i">
      <router-link tag="p" :to="{ path: 'afterDetail', query: {serviceOrderId: item.serviceOrderId} }" class="flex as_order_box" v-if="tabIndex==1"><span class="cell_1 c_333 font_14">售后单号&nbsp;{{item.serviceOrderId}}</span><span class="cell_0 c_blue font_14 tr">{{item.statusDesc}}</span></router-link>
      <p class="flex as_order_box" v-else><span class="cell_1 c_333 font_14">订单单号&nbsp;{{item.orderId}}</span><span class="cell_0 c_999 font_14 tr">{{item.orderTime}}</span></p>
      <div @click="goNextpage(item)">
      <GoodsBox :product="item" ></GoodsBox>
      </div>
      <div class="schedule_query_box" v-if="tabIndex == 1 && (item.showSendGoodsButton==1 || item.showCancelButton == 1)">
        <router-link tag="span" class="js_btn"
        :to="{ path: 'sendGoods', query: {serviceOrderId: item.serviceOrderId} }"
         v-if="item.showSendGoodsButton == 1">寄送商品</router-link><span class="cancel_apply_btn" v-if="item.showCancelButton == 1" @click="bindCancel(item.serviceOrderId)">取消申请</span>
      </div>
      <button
        v-if="tabIndex == 0"
       :class="['apply_as_btn', item.canAfterSale && item.canAfterSale !=0 ? 'yes_apply_btn':'']"
       :disabled="item.canAfterSale==0"
       @click="goApplyAfter(item.orderId)"
       >申请售后</button>
    </li>
    </template>
  </ul>
  <div class="nodata_order" v-else>
    <img src="../../assets/icon/icon/blank_flow_icon.png">
    <p>您还没有相关订单</p>
  </div>
</section>
</template>
<script>
import GoodsBox from 'components/afterSales/childCommon/GoodsBox'
import mixin from 'components/afterSales/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      tabTitle: ['申请售后', '进度查询'],
      tabIndex: window.sessionStorage.getItem('tabIndex') || 0,
      afterSaleList: [],
      isLoding: false,
      searchWord: '',
      pageNo: 1,
      pageCount: 1,
      isSCrollLoading: false
    }
  },
  components: {
    GoodsBox
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    if (to.name == "SendGoods" || to.name == "AfterDetail") {
      window.sessionStorage.setItem('tabIndex', this.tabIndex)
    } else {
      window.sessionStorage.removeItem('tabIndex')
    }
    next()
  },
  created () {
    this.showPage()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  methods: {
    onFocusHandler (e) {
      // 监控搜索栏数据
      if (!this.searchWord) {
        this.afterSaleList = []
        this.pageNo = 1
        this.showPage()
      }
    },
    clearInput () {
      // 清空搜索栏
      this.searchWord = ''
      this.$refs.searchInputEl.focus()
      this.afterSaleList = []
      this.pageNo = 1
      this.showPage()
    },
    bindCancel (serviceOrderId) {
      // 取消申请
      let _this = this
      this.showDialog({
        title: '取消确认',
        msg: '确认取消申请售后吗？',
        rBtnText: '确定',
        lBtnText: '取消',
        confCallBack: () => {
          _this.cancelApply(serviceOrderId).then(() => {
            if (this.status == "1") {
              this.pageNo = 1
              this.afterSaleList = []
              this.showPage()
            }
          })
        }
      })
    },
    bindTab (i) {
      this.tabIndex = i
      this.showLoad(true)
      this.afterSaleList = []
      this.pageNo = 1
      this.isLoding = false
      this.searchWord = ''
      this.showPage()
    },
    searchOrder () {
      if (!this.searchWord) {
        this.showToast({
          msg: '请输入商品名称，订单号'
        })
      } else {
        this.pageNo = 1
        this.afterSaleList = []
        this.showPage()
      }
    },
    goApplyAfter (orderId) {
      // 跳转【申请售后服务】页面
      this.$router.push({ path: 'ApplyAfter', query: { orderId } })
    },
    goNextpage (item) {
      let {productNo, activityNo, isactivity, serviceOrderId} = item
      if (productNo) {
        this.$router.push({
          path: '/detail',
          query: {
            productNo,
            activityNo: activityNo || '',
            isActivity: isactivity || 0
          }
        })
      } else {
        this.$router.push({
          path: '/afterDetail',
          query: {
            serviceOrderId
          }
        })
      }
    },
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.showPage('1')
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    },
    showPage (type) {
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      let {uid, token} = this.$store.state.userInfo
      let url = this.tabIndex == 1 ? this.$store.state.api.progressList : this.$store.state.api.list
      return this.$post({
        url,
        data: {
          uid,
          token,
          searchWord: this.searchWord,
          pageNo: this.pageNo,
          pageSize: 10
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        this.isLoding = true
        this.isSCrollLoading = false
        if (res.status == "1") {
          this.pageNo += 1
          this.$set(this.$data, 'pageCount', +res.pageCount)
          if (!type) {
            this.$set(this.$data, 'afterSaleList', res.data)
          } else {
            this.afterSaleList = this.afterSaleList.concat(res.data)
          }
        } else if (res.status != "11") {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
