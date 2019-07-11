<template>
<section class="help_wrap">
  <HelpList :dataList="dataList"></HelpList>
</section>
</template>
<script>
import HelpList from './model/HelpList'
import { getQueryString } from 'lib/until'
export default {
  data () {
    return {
      dataList: {},
      status: '',
      classifyNo: '',
      titles: ''
    }
  },
  components: {
    HelpList
  },
  created () {
    this.titles = this.$store.state.route.query.titles || getQueryString('titles')
    this.$store.state.route.meta.title = decodeURI(this.titles)
    this.status = this.$store.state.route.query.status || getQueryString('status')
    this.classifyNo = this.$store.state.route.query.classifyNo || getQueryString('classifyNo')
    this.getLiats()
  },
  beforeRouteUpdate (to, from, next) {
    this.showLoad(true)
    this.titles = to.query.titles
    this.$store.state.route.meta.title = decodeURI(this.titles)
    this.status = to.query.status
    this.classifyNo = to.query.classifyNo
    this.getLiats()
    next()
  },
  methods: {
    getLiats () {
      let url = this.status == 2 ? this.$store.state.api.subclassify : this.$store.state.api.getquestions
      this.$post({
        url,
        data: {
          classifyNo: this.status == 2 ? this.classifyNo : '',
          firstClassifyNo: this.status == 1 ? this.classifyNo :'',
          secondClassifyNo: this.status == 3 ? this.classifyNo :''
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == "1") {
          // 合并数据
          let dataList = {}
          res.questionList = res.classifyList || res.questionList
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
