<template>
<div class="title_imgs">
  <a href="javascript:;" :data-bdid="productFloor.id" data-bdindex="1" data-erow="1" data-modname="indexModelTitle" @click="jumpLink(productFloor.link, $event)"><img v-lazy="productFloor.image" class="lazy" lazy="loading" /></a>
</div>
</template>
<script type="text/javascript">
import { jointLand } from 'lib/until'
export default {
  data () {
    return {}
  },
  props: ['productFloor'],
  methods: {
    jumpLink (link, e) {
      // 为你推荐【楼层为11】调转收藏页面需要登录
      if (this.productFloor.layoutType == 11 && !this.$store.state.userInfo.token) {
        jointLand()
        return false
      } else {
        window.location.href = link
      }
    }
  }
}
</script>

