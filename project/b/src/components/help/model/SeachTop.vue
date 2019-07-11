<template>
<div class="seach_top flex">
  <p class="cell_1 search_box" @click="onFocusHandler">
    <input disabled placeholder="请输入问题关键词" type="text" class="index_newkeyword" autocomplete="off" >
  </p>
  <p class="cell_0 search_btn">搜索</p>
</div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    type: {
      type: String
    }
  },
  methods: {
    onFocusHandler (e) {
      if (this.type == 0) {
        this.$router.push('/searchHelp')
        return false
      }
    }
  }
}
</script>
