<template>
  <div class="site-frame">
    <div class="portrait">
      <img class="backgroundimage" src="../../assets/icon/mine_bg@2x.png" alt="" />
      <div class="message">
        <div class="designation">
          <open-data class="drawing" type="userAvatarUrl"></open-data>
        </div>
        <p>
          <open-data type="userNickName"></open-data>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: {
  },
  onShow () {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
@import "index";
</style>
