import Base64 from 'lib/Base64'
import { app } from 'lib/until'
export default {
  methods: {
    virtualCardRecycle (type) {
      this.showLoad(true)
      // 寄售卡寄售查询
      let {uid, token} = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.VirtualCardRecycle,
        data: {
          token,
          uid
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        this.status = res.status
        if (res.status == 1) {
         // 跳转福禄地址
          window.location.href = res.data.recycleUrl
        } else if (res.status == 10) {
          this.showToast({ msg: res.statusDetail })
        } else {
          if (!type) return false
          let fromChannel = this.$store.state.config.fromChannel
          if (fromChannel == 'sxypApp') {
            // 客户端授信
            app.goCredit()
          } else {
            let userId = this.$store.state.userInfo.userId
            let url = process.env.SXBTURL['CREDIT']
            let callUrl = window.location.href
            const callBackUrl = Base64.encode(callUrl)
            window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
          }
        }
      })
    }
  }
}
