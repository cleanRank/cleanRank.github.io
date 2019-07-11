<template>
  <div class="his_search" v-if="historyData.length > 0">
    <h6 class="title_search his_t">搜索历史<span class="deleteHis_btn" @click="deleteHistory"></span></h6>
    <div class="history_search_list">
      <div class="history_search_item" v-for="(item, index) in historyData" :key="item" v-if="item" @click="searchHandler(item, index)">{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      historyData: []
    }
  },
  created () {
    this.historyShow()
  },
  methods: {
    historyShow () {
      if (window.localStorage.getItem('historyHelp')) {
        this.historyData = JSON.parse(window.localStorage.getItem('historyHelp')).slice(0, 13) || []
      }
      this.$set(this.$data, 'historyData', this.historyData)
    },
    deleteHistory () {
      window.localStorage.removeItem('historyHelp')
      this.$set(this.$data, 'historyData', '')
    },
    searchHandler (keyword, deleteIndex) {
      this.$emit('searchInputVal', keyword, deleteIndex)
    }
  }
}
</script>

