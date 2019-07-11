<template>
  <div class="floor-three">
    <ul class="floor-good-single-row" :class="{'floor-single-row-bg': floor.bgImg}" :style="{backgroundImage: (floor.bgImg? 'url('+floor.bgImg+')':''),backgroundColor: floor.listFloorDetail[0].defaultBgColor}">
      <ModelGood v-for="(good, index) in floor.listFloorDetail[0].prudouct" :key="index" :good="good" :rebateStatus="floor.rebateStatus"></ModelGood>
    </ul>
  </div>
</template>
<script type="text/javascript">
  import ModelGood from './ModelGood'
  export default {
    data () {
      return {}
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    },
    components: {
      ModelGood
    }
  }
</script>
<style media="screen" lang="scss" scoped>

</style>
