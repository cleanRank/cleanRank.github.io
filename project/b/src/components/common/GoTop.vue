<template id="">
  <a href="javascript:;" class="go_top" v-show="isShowTopFlag" @click="returnTop" id="goTop">回到顶部</a>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        isShowTopFlag: false
      }
    },
    methods: {
      // 回到顶部
      returnTop () {
        document.body.scrollTop = document.documentElement.scrollTop = 0
      },
      // 滚动条事件
      scrollToFixedTop () {
        const _t = this
        const clientHeight = document.documentElement.clientHeight
        window.addEventListener('scroll', function () {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          // 当滚动条高度大于屏幕高度+30px以后，显示向上的按钮
          if (scrollTop > (clientHeight + 30)) {
            _t.$set(_t.$data, 'isShowTopFlag', true)
          } else {
            _t.$set(_t.$data, 'isShowTopFlag', false)
          }
          // 当滚动条大于0的时候
          if (scrollTop > 0) {
            _t.$emit('addFixed', true)
          } else {
            _t.$emit('addFixed', false)
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
