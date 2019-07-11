<template>
<section></section>
</template>
<script>
import changeBg from '@/mixin/'
import { jointLand, app } from 'lib/until'
export default {
  mixins: [changeBg],
  created () {
    let isgomovie = window.sessionStorage.getItem('isgomovie')
    if (isgomovie && isgomovie == 1) {
      // 去首页
      this.showLoad(false)
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        app.goIndex()
      } else {
        this.$router.push('/')
      }
    } else {
      this.goMovie()
    }
  },
  watch: {
    // 监听调用登录方法成功以后，token改变，需要重新渲染该页面
    "$store.state.userInfo.uid": function (newVal, oldVal) {
      if (newVal && this.$store.state.config.fromChannel == 'sxypApp') {
        this.goMovie()
      }
    }
  },
  methods: {
    goMovie () {
      if (!this.$store.state.userInfo.token) {
        this.showLoad(false)
        jointLand()
      } else {
        let {uid, token, mobile, userId} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.FilmflyEnter,
          data: {
            uid,
            token,
            mobile
          }
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status === "1") {
          // 跳转电影票页面
            window.sessionStorage.setItem('isgomovie', '1')
            window.sessionStorage.setItem('token', token)
            window.sessionStorage.setItem('uid', uid)
            window.sessionStorage.setItem('userId', userId)
            window.sessionStorage.setItem('mobile', mobile)
            window.location.href = res.filmflyEnterUrl
          } else {
          // this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
}
</script>
