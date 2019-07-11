<template>
  <section>
    <index-header @searchStart="searchStart"></index-header>
    <search-content :searchResult="searchResult"></search-content>
  </section>
</template>

<script>
  import SearchContent from './SearchContent'
  export default {
    data () {
      return {
        searchResult: [],
        productName: '',
        upCategoryType: '',
        pageNo: 1,
        fetchDataFunc: null
      }
    },
    methods: {
      fetchSearchData (pageNo, deAc) {
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.productsearch,
          data: {
            productName: this.productName,
            pageNo,
            orderNo: 0,
            uid,
            token
          }
        }).then(xhrData => {
          let res = xhrData.data
          if (res.status == 1) {
            this.$set(this.$data, 'searchResult', res.data)
          } else if (res.status == 11) {
            this.$set(this.$data, 'searchResult', [])
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      fetchCateProductData (pageNo, deAc = 0) {
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.CategoryProduct,
          data: {
            upCategoryType: this.upCategoryType,
            pageNo,
            orderNo: 0,
            uid,
            token,
            deAc
          }
        }).then(xhrData => {
          let res = xhrData.data
          if (res.status == 1) {
            this.$set(this.$data, 'searchResult', res.data)
          } else if (res.status == 11) {
            this.$set(this.$data, 'searchResult', [])
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      searchStart (searchTerm) {
        this.$set(this.$data, 'productName', searchTerm)
        this.fetchSearchData(1).then(() => {
          this.showLoad(false)
        })
      }
    },
    created () {
      let {categoryType: upCategoryType} = this.$store.state.route.query
      if (upCategoryType) {
        this.upCategoryType = upCategoryType
        this.fetchCateProductData(1).then(() => {
          this.showLoad(false)
        })
      }
    },
    components: {
      'search-content': SearchContent
    }
  }
</script>

