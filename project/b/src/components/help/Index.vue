<template>
<section class="help_wrap" v-if="isLoding">
  <SeachTop :type="'0'"></SeachTop>
  <HelpList :dataList="dataList"></HelpList>
</section>
</template>
<script>
import SeachTop from './model/SeachTop'
import HelpList from './model/HelpList'
export default {
  data () {
    return {
      isLoding: false,
      dataList: {}
    }
  },
  components: {
    SeachTop,
    HelpList
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.$post({
        url: this.$store.state.api.helpcenter,
        data: {}
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        if (res.status == "1") {
          // 合并数据
          let dataList = {}
          if (res.hotQuestionList) {
            res.hotQuestionList[0].title = "热门问题"
            dataList[0] = res.hotQuestionList
          }
          if (res.firstClassifyList) {
            res.firstClassifyList[0].title = "问题分类"
            dataList[1] = res.firstClassifyList
          }
          this.$set(this.$data, 'dataList', dataList)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
