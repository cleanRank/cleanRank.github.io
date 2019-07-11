<template>
<section section class="staging_container slideInUp">
  <div class="shadow"></div>
  <div class="staging_wrap slideInDown">
    <p class="sh_title">{{title}}</p>
    <div class="autoScroll_as">
      <template v-for="(item, i) in afterSaleReason">
        <p :class="['afterSaleReason_box', tabIndex == i?'cur_select':'']" :key="i" @click="selectReason(i)">{{item.reasonDesc || item.expressDesc}}</p>
      </template>
    </div>
    <div class="btn_wrap-n">
      <a href="javascript:;" class="go_order_btn" @click="confirmReason">确定</a>
    </div>
  </div>
</section>
</template>
<script>
export default {
  props: {
    afterSaleReason: {
      required: true,
      type: Array,
      default: {}
    },
    tabindex: {
      required: true,
      type: Number
    },
    title: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      tabIndex: this.tabindex < 1 ? 0 : this.tabindex
    }
  },
  methods: {
    selectReason (i) {
      this.tabIndex = i
    },
    confirmReason () {
      // 获取选中的数组
      this.$emit("reasonType", this.tabIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.staging_container{
  position: fixed;
}
.btn_wrap-n{
  padding: 0;
  .go_order_btn{
    border-radius: 0;
  }
}
</style>
