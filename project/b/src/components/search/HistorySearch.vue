<template>
  <div class="his_search" v-if="historyData.length > 0">
    <h6 class="title_search his_t">历史搜索<span class="deleteHis_btn" @click="deleteHistory"></span></h6>
    <div class="history_search_list">
      <div class="history_search_item" v-for="(item, index) in historyData" :key="item" v-if="item" @click="searchHandler(item,index, $event)">{{item}}</div>
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
      if (window.localStorage.getItem('historyList')) {
        this.historyData = JSON.parse(window.localStorage.getItem('historyList')).slice(0, 10) || []
      }
      this.$set(this.$data, 'historyData', this.historyData)
    },
    deleteHistory () {
      window.localStorage.removeItem('historyList')
      this.$set(this.$data, 'historyData', '')
    },
    searchHandler (keyword, deleteIndex, e) {
      this.$emit('searchStart', keyword, deleteIndex)
    }
  }
}
</script>

