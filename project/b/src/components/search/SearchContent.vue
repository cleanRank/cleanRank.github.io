<template>
  <section class="search-content-wp">
    <SearchCelebrity v-if="celebrityResult && celebrityResult.length>0" :celebrity="celebrityResult"></SearchCelebrity>
    <search-sort @setOrder="setOrder" v-show=" searchResult && searchResult.length" />
    <BetterScroll class="layout_content" :pullup="true" :datas="searchResult" @scrollToEnd="scrollToEnd" v-if="searchResult.length">
      <ul class="searchlist-normal" id="searchlistWrap">
        <SearchItem v-for="item of searchResult" :key="item.productNo" :item="item" />
      </ul>
    </BetterScroll>
    <div v-show="showNoData" class="nodata_order">
      <img src="../../assets/icon/icon/blank_flow_sp.png">
      <p>未找到相关商品</p>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
// import Recommend4u from 'components/index/Recommend4u'
export default {
  data () {
    return {
      apiUrl: this.$store.state.api.CategoryProduct,
      searchResult: [],
      celebrityResult: [],
      productName: '',
      upCategoryType: '',
      pageNo: 1,
      pageCount: 1,
      showNoData: false,
      isScrollLoading: true,
      isLastPage: false,
      firstTimeShowLastPage: true,
      axiosCTSource: null,
      isLoadEndFlag: false,
      order: {
        orderNo: 0,
        deAc: 1
      }
    }
  },
  created () {
    let { categoryType: upCategoryType } = this.$store.state.route.query
    // this.onRouterChange(upCategoryType)
    // tracker.sessionStart()
    let productName = window.sessionStorage.getItem('searchInputVal')
    if (!upCategoryType) {
      this.showLoad(false)
    }
    if (productName && this.$store.state.route.from.name != 'Category') {
      this.searchStart(productName)
      window.sessionStorage.removeItem('searchInputVal')
    } else if (upCategoryType) {
      this.upCategoryType = upCategoryType
      this.fetchData(1)
    }
    // this.hotsearchList()
  },
  mounted () {
    this.$parent.$on('searchStart', (keyword, deleteIndex) => {
      this.searchStart0(keyword, deleteIndex)
    })
    this.$parent.$on('goBlankSearch', this.setEmpty)
  },
  // beforeRouteLeave (to, from, next) {
  //   // console.log(from.query)
  //   if (to.name == 'Detail' && this.productName) {
  //     window.sessionStorage.setItem('productName', this.productName)
  //   }
  //   // this.$refs.searchWrap.removeEventListener('scroll', this.onScroll, false)
  //   next()
  // },
  methods: {
    setOrder (order) {
      // 判断是否是每个切换项的最后一页
      this.$set(this.$data, 'isLastPage', false)
      // this.$set(this.$data, 'firstTimeShowLastPage', true)
      this.$set(this.$data, 'order', order)
      this.fetchData(1)
    },
    searchStart0 (searchTerm, deleteIndex) {
      let historyData = JSON.parse(window.localStorage.getItem('historyList')) || []
      if (!deleteIndex) {
        deleteIndex = historyData.indexOf(searchTerm)
      }
      if (deleteIndex != -1) {
        historyData.splice(deleteIndex, 1)
      }
      historyData.unshift(searchTerm)
      historyData = historyData.slice(0, 20)
      window.localStorage.setItem('historyList', JSON.stringify(historyData))
      this.orderNo = 0
      this.searchStart(searchTerm)
    },
    searchStart (searchTerm) {
      this.$set(this.$data, 'apiUrl', this.$store.state.api.productsearch)
      this.$set(this.$data, 'isLastPage', false)
      this.$set(this.$data, 'firstTimeShowLastPage', true)
      this.$set(this.$data, 'productName', searchTerm)
      this.fetchData(1)
    },
    fetchData (pageNo) {
      let { uid, token } = this.$store.state.userInfo
      let categoryTypeNext = this.$store.state.route.query.categoryTypeNext // 一级品类编号
      if (pageNo) {
        this.$set(this.$data, 'pageNo', pageNo)
      }
      this.showLoad(true)
      let CancelToken = axios.CancelToken
      this.axiosCTSource = CancelToken.source()
      return this.$post({
        url: this.apiUrl,
        data: {
          CategoryType: categoryTypeNext,
          upCategoryType: this.upCategoryType,
          productName: this.productName,
          pageNo: this.pageNo,
          uid,
          token,
          ...this.order
        },
        cancelToken: this.axiosCTSource.token
      }).then(({ data }) => {
        this.showLoad(false)
        let res = data
        if (res.status == 1) {
          // window.removeEventListener('scroll', this.onScroll, true)
          if (this.pageNo == 1) {
            if (res.data) {
              this.$set(this.$data, 'searchResult', res.data)
            } else {
              this.$set(this.$data, 'searchResult', [])
            }
            this.$set(this.$data, 'celebrityResult', res.starList)
          } else {
            this.$set(this.$data, 'searchResult', [...this.searchResult, ...res.data])
          }
          this.$set(this.$data, 'showNoData', false)
          this.$set(this.$data, 'pageNo', this.pageNo + 1)
          this.$set(this.$data, 'pageCount', res.pageCount)
          if (res.pageCount == res.pageNo) {
            this.$set(this.$data, 'isLastPage', true)
          } else if (this.searchResult && this.searchResult.length < 6) {
            this.fetchData()
          }
        } else if (res.status == 11) {
          // window.removeEventListener('scroll', this.onScroll, false)
          if (this.pageNo == 1) {
            this.$set(this.$data, 'searchResult', [])
            this.$set(this.$data, 'celebrityResult', [])
            this.$set(this.$data, 'showNoData', true)
          } else {
            this.showToast({ msg: '没有更多商品了！' })
            this.isLastPage = true
            this.firstTimeShowLastPage = false
          }
          // this.$set(this.$data, 'isLastPage', true)
        } else {
          this.showToast({ msg: res.statusDetail })
        }
        this.$set(this.$data, 'isScrollLoading', false)
        this.showLoad(false)
      })
    },
    setEmpty () {
      this.axiosCTSource && this.axiosCTSource.cancel('userCancel')
      // this.$set(this.$data, 'searchResult', [])
      this.showNoData = false
    },
    scrollToEnd () {
      if (!this.isScrollLoading) {
        if (this.isLastPage) {
          if (this.firstTimeShowLastPage) {
            this.$set(this.$data, 'firstTimeShowLastPage', false)
            this.showToast({ msg: '没有更多商品了！' })
          }
        } else {
          this.$set(this.$data, 'isScrollLoading', true)
          this.fetchData()
        }
      }
    }
  },
  components: {
    'search-sort': resolve => { require(['./SearchSort'], resolve) },
    'BetterScroll': resolve => { require(['./BetterScroll'], resolve) },
    'SearchItem': resolve => { require(['./SearchItem'], resolve) },
    'SearchCelebrity': resolve => { require(['./SearchCelebrity'], resolve) }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/flex";
@import "../../assets/scss/app";
.search-content-wp {
  @include display-flex;
  @include flex-direction-column;
  @include flex(1);
  background: $bgColor;
}
.layout_content {
  // min-height: 400px;
  @include flex(1);
  overflow: hidden;
}

.search_lootall img {
  margin-left: 0.8rem;
}

.pList_product [lazy="loading"] {
  // background: url("../../assets/icon/banner/zcs.jpg") no-repeat 50% 50% / 100% 100%;
}
.notFind{
  text-align: center;
  font-weight: bold;
}
.recommend4u-title{
  @include px2rem(margin-top,110);
}
</style>
