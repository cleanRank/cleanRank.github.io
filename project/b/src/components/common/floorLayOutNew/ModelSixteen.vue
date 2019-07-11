<template>
  <div class="floor-sixteen">
    <img class="floor-sixteen-banner" v-if="floor.banner" :src="floor.banner" @click="bannerJump(floor.bannerJumpType, floor.bannerContent)" alt="">
    <div class="sixteen-wrap" :style="{backgroundImage: (floor.bgImg? 'url('+floor.bgImg+')':''),backgroundColor: floor.bgColor}">
      <div class="sixteen-line" v-for="(item, index) in floor.listFloorDetail[0].marketings" :key="index">
        <div class="sixteen-line-con" :class="'sixteen-line-img'+item.marketing.length" v-for="(img, idx) in item.marketing" :key="idx">
          <img class="sixteen-line-img"  @click="bannerJump(img.linkType, img.LinkUrl)"  :src="img.ltypeImg">
        </div>
      </div>
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
<style media="screen" lang="scss" scoped>

</style>
