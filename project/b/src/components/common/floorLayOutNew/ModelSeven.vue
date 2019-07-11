<template>
  <div class="floor-seven" :class="{'floor-single-row-bg': floor.bgImg}" :style="{backgroundImage: (floor.bgImg? 'url('+floor.bgImg+')':'')}">
    <div class="floor-single-row">
      <ModelImgGood v-for="(good, index) in floor.listFloorDetail[0].prudouct" :key="index" :good="good" :rebateStatus="floor.rebateStatus"></ModelImgGood>
    </div>
  </div>
</template>

<script type="text/javascript">
  import ModelImgGood from 'components/common/floorLayOutNew/ModelImgGood' // 商品单列
  export default {
    data () {
      return {
        good: {}
      }
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    },
    components: {
      ModelImgGood
    },
    created () {
      this.floor.listFloorDetail[0].prudouct[0].proImage = this.floor.listFloorDetail[0].picUrl
      this.good = this.floor.listFloorDetail[0].prudouct[0]
    }
  }
</script>
<style media="screen" lang="scss" scoped>

</style>
