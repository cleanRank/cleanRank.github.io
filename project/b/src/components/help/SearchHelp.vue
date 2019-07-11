<template>
<section class="help_wrap">
  <form @submit.prevent="searchResultBtn()">
    <div class="seach_top flex">
      <p class="cell_1 search_box">
        <input ref="searchInput" v-model="searchInputVal" autofocus="autofocus" placeholder="请输入问题关键词" type="text" class="index_newkeyword" autocomplete="off" >
      </p>
      <p class="cell_0 search_btn" @click="searchResultBtn()">搜索</p>
    </div>
  </form>
  <HistorySearch @searchInputVal="startSearch" v-if="!searchInputVal" />
  <HelpList @isClick="setHistory" :dataList="dataList" v-else></HelpList>
  <div v-show="showNoData" class="nodata_order">
    <img src="../../assets/icon/icon/blank_flow_sp.png">
    <p>未找到相关问题</p>
  </div>
</section>
</template>
<script>
import HistorySearch from './model/HistorySearch'
import HelpList from './model/HelpList'
export default {
  data () {
    return {
      searchInputVal: '',
      dataList: {},
      showNoData: false
    }
  },
  components: {
    HistorySearch,
    HelpList
  },
  created () {
    this.showLoad(false)
  },
  watch: {
    searchInputVal: {
      handler (val, oldVal) {
        if (val && val != oldVal) {
          this.searchResult()
        }
        if (!val) {
          this.showNoData = false
        }
      }
    }
  },
  methods: {
    startSearch (keyword, deleteIndex) {
      this.searchInputVal = keyword.trim()
      this.searchResultBtn(deleteIndex)
    },
    setHistory (keyword, deleteIndex) {
      // 保存搜索记录
      keyword = keyword || this.searchInputVal
      keyword = keyword.trim()
      if (!keyword) return false
      let historyData = JSON.parse(window.localStorage.getItem('historyHelp')) || []
      if (!deleteIndex) {
        deleteIndex = historyData.indexOf(keyword)
      }
      if (deleteIndex != -1) {
        historyData.splice(deleteIndex, 1)
      }
      historyData.unshift(keyword)
      historyData = historyData.slice(0, 13)
      window.localStorage.setItem('historyHelp', JSON.stringify(historyData))
    },
    searchResultBtn (deleteIndex) {
      this.setHistory(this.searchInputVal, deleteIndex)
      this.searchResult()
    },
    searchResult () {
      this.dataList = {}
      if (!this.searchInputVal.trim()) {
        this.showToast({ msg: '请输入搜索内容' })
        return false
      }
      // 搜索结果
      this.$post({
        url: this.$store.state.api.searchquestion,
        data: {
          keyword: this.searchInputVal
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        if (res.status == "1") {
          // 合并数据
          let dataList = {}
          if (!res.questionList) {
            this.showNoData = true
            return false
          }
          this.showNoData = false
          res.questionList.forEach((val) => {
            val.searchhelpPage = 1
            if (val.question) {
              // 匹配关键字正则
              let replaceReg = new RegExp(this.searchInputVal, 'g')
              // 高亮替换v-html值
              let replaceString = '<b class="c_blue">' + this.searchInputVal + '</b>'
              // 开始替换
              val.question = val.question.replace(replaceReg, replaceString)
            }
          })
          dataList[0] = res.questionList
          this.$set(this.$data, 'dataList', dataList)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
