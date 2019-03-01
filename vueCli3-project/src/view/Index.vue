<template>
<section class="site-home">
  <div class="site-frame-home">
    hello word
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      indexData: ''
    }
  },
  components: {
  },
  created () {
    let title = '提示'
    let msg = '是否提交eee审核?'
    let lBtnText = '取消'
    let rBtnText = '确定'
    this.showDialog({
      title,
      msg,
      lBtnText,
      rBtnText,
      confCallBack () {
        console.log('dialog')
      }
    })
  },
  computed: {
  },
  methods: {
  }
}
</script>
