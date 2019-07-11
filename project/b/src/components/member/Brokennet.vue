<template>
<div class="brokennet_box">
  <img src="../../assets/icon/banner/refresh.png">
  <p>网络不给力<br>请检查手机是否联网</p>
  <button class="go-index font16" @click="refreshPage">点击重试</button>
</div>
</template>
<script>
// import { app } from 'lib/until'
export default {
  data () {
    return {}
  },
  created () {
    this.showLoad(false)
  },
  methods: {
    refreshPage () {
      // 刷新路由
      window.history.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.go-index{
    display: block;
    width: 3.0667rem;
    height: .9333rem;
    text-align: center;
    color: #fff;
    margin: .72rem auto 0 auto;
    background: #3E9BFA;
    border-radius: 0.46665rem;
  }
</style>
