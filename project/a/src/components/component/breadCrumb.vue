<template>
  <div class="components-button">
    <el-button type="primary" @click="clickhandle">{{value}}</el-button>
  </div>
</template>
<script>
  export default {
    name: 'WButton',
    props: {
      value: {
        default: '确认'
      }
    },
    methods: {
      clickhandle() {
        this.$emit('click', this)
      }
    }
  }

</script>
<style lang="scss">
  $color: #5584FF;

  .components-button .el-button {
    width: 100%;
    padding: 7px 0;
    font-size: 12px;
    background: $color;
    border-radius: 3px;
    margin: 30px auto 26px;
  }

</style>
