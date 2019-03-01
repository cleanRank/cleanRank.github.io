<template lang="html">
  <div class="commodityList">
    <ul class="commodityTab clearfix">
      <li v-for="(value, index) in tabObj.tablist"
        v-if="index > 0"
        :key="index"
        :class="[value.toggleTrue?'tab-active': '']"
        @click="toggleTab(value, index)">
        {{value.name}}
      </li>
    </ul>
    <load-more
    :bottom-method="loadBottom"
    :bottom-all-loaded="allLoaded"
    :auto-fill="false"
    ref="loadmore">
      <ul class="commodity-list">
        <li class="clearfix commodity-item"
          v-if="commoditylist.length > 0"
          v-for="(value, index) in commoditylist"
          :key="index">
          <div class="list-img-box">
            <img :src="value.image || imgObj.img" alt="">
          </div>
          <div class="commodity-list-describe">
            <p class="list-time">
              <span class="list-time-describe" v-if="value.itemName">提交时间&nbsp;</span>
              <span class="list-time-describe" v-else>审核时间&nbsp;</span>
              <span class="list-time-day">{{value.gmtModified}}</span>
              <span v-if="value.applyStatus === 0" class="list-status-will">待审核</span>
              <span v-if="value.applyStatus === 1" class="list-status-already">已通过</span>
              <span v-if="value.applyStatus === 2" class="list-status-will">未通过</span>
            </p>
            <p class="list-headline">
              <span class="list-title">{{value.itemName}}</span><span v-if="value.itemType===2" class="list-unit"></span><span v-if="value.itemType===3" class="list-title">图表申请</span>
            </p>
            <p class="list-price" v-if="value.itemName">
              <span class="list-label">协议价</span>&nbsp;&nbsp;
              <span class="list-unit-price">¥{{value.purchasePrice}}</span>
            </p>
          </div>
          <div v-if="value.rejReason" class="commodity-failed">
            {{value.rejReason}}
          </div>
        </li>
      </ul>
    </load-more>
  </div>
</template>

<script>
import loadMore from 'components/common/LoadMore'
export default {
  data () {
    return {
      tabObj: {
        index: 0,
        tablist: [
          {
            name: '关联商品',
            toggleTrue: false,
            path: '/information?type=0'
          },
          {
            name: '补充商品',
            toggleTrue: false,
            path: '/information?type=1'
          },
          {
            name: '图表上传',
            toggleTrue: false,
            path: '/information?type=2'
          },
          {
            name: '审核',
            toggleTrue: true,
            path: '/applydetail'
          }
        ]
      },
      imgObj: {
        img: require('@/assets/icon/icon/logo@2x.png')
      },
      list: [],
      commoditylist: [],
      ajaxObj: {
        recordpage: 1,
        listPage: 1,
        applyId: ''
      },
      allLoaded: false
    }
  },
  components: {
    loadMore
  },
  mounted () {},
  created () {
    this.commoditylist = []
    this.ajaxObj.applyId = +this.$route.query.applyid
    this.getItemlist()
  },
  methods: {
    loadBottom () {
      this.getItemlist()
    },
    toggleTab (value) {
      this.$router.replace({
        path: value.path
      })
    },
    getItemlist () {
      this.$http.applyselectList({
        page: this.ajaxObj.listPage++,
        size: 10,
        param: this.ajaxObj.applyId
      }).then(res => {
        if (res.result.datas && res.result.datas.length > 0) {
          res.result.datas.forEach(value => {
            value.image = value.itemPicPaths[0] || undefined
          })
          this.$refs.loadmore.onBottomLoaded()
          this.commoditylist = this.commoditylist.concat(res.result.datas)
          if (res.result.datas.length < 10) {
            this.allLoaded = true
          }
        } else {
          this.allLoaded = true
        }
      }).catch(e => {
        this.allLoaded = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/informationIndex.scss";
</style>
