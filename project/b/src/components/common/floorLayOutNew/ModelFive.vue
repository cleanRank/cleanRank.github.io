<template>
  <div class="floor-five">
    <div class="floor-nav">
      <div class="floor-nav-item" v-for="(icon, index) in floor.listFloorDetail" :key="index" @click="jumpTap(icon)">
        <img class="floor-nav-item-img lazy" v-lazy="icon.picUrl" :alt="icon.picName" lazy="loading">
        <span class="floor-nav-item-name" v-if="icon.picName">{{icon.picName}}</span>
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
