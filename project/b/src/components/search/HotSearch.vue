<template>
  <div class="hot_search">
  <h6 class="title_search hot_t" ref="h6">热门搜索</h6>
  <div class="hot_search_list">
    <div class="hot_search_item" :class="item.url?'hot_search_item_jump':''" v-for="(item, index) in hotSearch" :key="index" v-if="item.hotWord" @click="searchHandler(item, $event)">{{item.hotWord}}</div>
  </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        hotSearch: []
      }
    },
    created () {
      this.fetchHotList()
    },
    methods: {
      searchHandler (keyword, e) {
        if (keyword.url) {
          window.location.href=keyword.url
        } else {
          this.$emit('searchStart', keyword.hotWord)
        }
      },
      fetchHotList () {
        this.$post({
          url: this.$store.state.api.SearchHotWordNew,
          data: {}
        }).then(data => {
          let res = data.data
          if (res.status === "1") {
            this.$set(this.$data, 'hotSearch', res.data.SearchHotWord)
            this.$emit('setDefaultSearch', res.data.Searchfordefault)
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
