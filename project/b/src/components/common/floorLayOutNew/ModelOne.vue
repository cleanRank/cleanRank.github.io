<template>
  <div class="floor-one">
    <div class="floor-image">
      <img v-lazy="floor.listFloorDetail[0].picUrl" class="floor-image-item lazy" @click="jumpTap(floor.listFloorDetail[0], $event)" lazy="loading">
      <span v-for="(item, idx) in floor.listFloorDetail[0].hotAreaShowList" :key="idx" class="hot-area" :style="{top: item.Top,bottom: item.Down, left: item.Left, right: item.Right}" @click.stop="bannerJump(item.linkType, item.hotAreaLinkUrl)" v-if="floor.hotType == 1"></span>
    </div>
  </div>
</template>
<script type="text/javascript">
  import mixin from './mixin'
  export default {
    mixins: [mixin],
    data () {
      return {}
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    }
  }
</script>
