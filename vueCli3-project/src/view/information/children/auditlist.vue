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
        <li class="apply-item"
          v-if="list.length > 0"
          v-for="(value, index) in list"
          :key="index"
          @click="goapply(value)">
          <p class="apply-title">申请单</p>
          <p class="sippler-title">供应商申请单</p>
          <p class="submit-time clearfix">
            <span class="fl">提交时间</span>
            <span class="fr">{{value.gmtModified}}</span>
          </p>
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
  mounted () {
    this.commoditylist = []
    this.list = []
    this.ajaxObj.applyId = +this.$route.query.applyid || false
  },
  created () {
    this.getRecordList()
  },
  methods: {
    loadBottom () {
      this.getRecordList()
    },
    getRecordList () {
      this.$http.applyRecord({
        page: this.ajaxObj.recordpage++,
        param: '',
        size: 10
      }).then(res => {
        if (res.result.datas && res.result.datas.length > 0) {
          this.list = this.list.concat(res.result.datas)
          this.$refs.loadmore.onBottomLoaded()
          if (res.result.datas.length < 10) {
            this.allLoaded = true
          }
        } else {
          this.allLoaded = true
        }
      }).catch(e => {
        this.allLoaded = true
      })
    },
    goapply (value) {
      this.$router.push({
        path: `/applyitem?applyid=${value.applyId}`
      })
    },
    toggleTab (value) {
      this.$router.replace({
        path: value.path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/informationIndex.scss";
</style>
