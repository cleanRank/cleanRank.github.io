<template>
  <div class="floor-ten" :style="{background: floor.listFloorDetail[0].defaultBgColor}">
    <div class="floor-ten-wrap">
      <img class="floor-ten-img lazy" :class="['floor-ten-img-'+floor.listFloorDetail.length]" v-for="(img, index) in floor.listFloorDetail" v-lazy="img.picUrl" :key="index" @click="jumpTap(img)" lazy="loading">
    </div>
  </div>
</template>

<script>
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

