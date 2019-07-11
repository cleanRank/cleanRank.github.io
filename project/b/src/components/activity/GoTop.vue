<template id="">
  <div class="top_go" v-show="isGoTopShow" @click="goTop">
    <img src="../../assets/icon/activity/top.png" width="80%" height="80%">
  </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        isGoTopShow: false
      }
    },
    methods: {
      // 回到顶部
      goTop () {
        document.body.scrollTop = document.documentElement.scrollTop = 0
      },
      // 滚动条事件
      scrollToFixedTop () {
        const clientHeight = document.documentElement.clientHeight
        window.addEventListener('scroll', () => {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          // 当滚动条高度大于屏幕高度+30px以后，显示向上的按钮
          if (scrollTop > (clientHeight + 30)) {
            this.$set(this.$data, 'isGoTopShow', true)
          } else {
            this.$set(this.$data, 'isGoTopShow', false)
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.scrollToFixedTop()
      })
    }
  }
</script>
