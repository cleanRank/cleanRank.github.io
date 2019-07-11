<template>
  <section class="search-wrap">
    <search-header @toggleInputFocus="toggleInputFocus" @searchInputVal="searchInputVal"></search-header>
    <search-content v-show="!isInputFocused" class="search-content"></search-content>
  </section>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      isInputFocused: false,
      inputVal: ''
    }
  },
  beforeRouteLeave (to, from, next) {
    // 清除缓存的搜索值
    if (to.name == 'Detail' && this.inputVal) {
      window.sessionStorage.setItem('searchInputVal', this.inputVal)
    } else {
      window.sessionStorage.removeItem('searchInputVal')
    }
    next()
  },
  activated () {
    this.showLoad(false)
    if (this.$store.state.route.from.name == 'Index') {
      this.isInputFocused = true
    }
  },
  methods: {
    toggleInputFocus (isFocus) {
      this.isInputFocused = isFocus
    },
    searchInputVal (val) {
      this.inputVal = val
    }
    // onRouterChange (upCategoryType) {
    //   if (upCategoryType) {
    //     this.upCategoryType = upCategoryType
    //     // this.$set(this.$data, 'searchData', {upCategoryType})
    //     this.$set(this.$data, 'apiUrl', this.$store.state.api.CategoryProduct)
    //     this.$set(this.$data, 'productName', '')
    //     this.fetchData(1)
    //   } else {
    //     this.showLoad(false)
    //   }
    // },
  },
  components: {
    'search-header': resolve => { require(['./SearchHeader'], resolve) },
    'search-content': resolve => { require(['./SearchContent'], resolve) }
    // 'search-sort': resolve => { require(['./SearchSort'], resolve) }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.search-wrap {
  height: 100%;
  @include display-flex;
  @include flex-direction-column;
}
// .search-page{
//   border-bottom: 1px solid $borderColor;
// }
</style>
