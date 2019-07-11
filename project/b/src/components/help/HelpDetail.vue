<template>
<section class="help_wrap" v-if="isloding">
  <h6 class="help_title" v-html="dataDetail.question"></h6>
  <div class="help_content" v-html="decodeHTML(dataDetail.answer || '')" v-if="dataDetail.answer"></div>
  <HelpList :dataList="dataList"></HelpList>
</section>
</template>
<script>
import HelpList from './model/HelpList'
import { getQueryString, html_encode } from 'lib/until'
export default {
  data () {
    return {
      dataDetail: {},
      dataList: {},
      id: '',
      isloding: false
    }
  },
  components: {
    HelpList
  },
  created () {
    this.id = this.$store.state.route.query.id || getQueryString('id')
    this.getData()
  },
  beforeRouteUpdate (to, from, next) {
    this.showLoad(true)
    this.id = to.query.id
    this.getData()
    next()
  },
  methods: {
    decodeHTML (html) {
      return html_encode(html)
    },
    getData () {
      this.$post({
        url: this.$store.state.api.checkquestion,
        data: {
          id: this.id
        }
      }).then(data => {
        this.isloding = true
        this.showLoad(false)
        let res = data.data
        if (res.status == "1") {
          let dataList = {}
          if (res.relativeQuestionList) {
            res.relativeQuestionList[0].title = "相关问题"
            dataList[0] = res.relativeQuestionList
          }
          this.$set(this.$data, 'dataList', dataList)
          this.$set(this.$data, 'dataDetail', res)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
