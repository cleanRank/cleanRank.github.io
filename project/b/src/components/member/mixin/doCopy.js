import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  data () {
    return {
      vipcn: 'sxyp2019',
      wechatID: 'sxyp2019'
    }
  },
  created () {
    this.showLoad(false)
  },
  methods: {
    // 复制
    doCopy (val) {
      let _t = this
      this.$copyText(val).then(function (e) {
        _t.showToast({msg: '复制成功'})
      }, function (e) {
        _t.showToast({msg: '复制失败'})
      })
    }
  }
}
