export default {
  methods: {
    cancelApply (serviceOrderId) {
      // 取消申请售后
      // 取消售后
      this.showLoad(true)
      let {uid, token} = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.progressCancel,
        data: {
          uid,
          token,
          serviceOrderId // 售后订单号
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        this.status = res.status
        if (res.status == "1") {
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
