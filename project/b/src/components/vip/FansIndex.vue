<template>
<section>
  <div class="fans_num_wrap">
    <p class="myfans_num"><b class="fans_b">16</b><span class="c_999 fans_txt font14">我的粉丝</span></p>
    <div class="flex order_fans_wrap">
      <p class="cell_1"><b class="num_orders">8</b><span class="c_999">已下单</span></p>
      <p class="cell_1"><b class="num_orders">8</b><span class="c_999">未下单</span></p>
    </div>
  </div>
  <div class='flex time_list_tab fansListWrap'>
    <p
    v-for="(item, index) in timeList"
    :key="index"
    :class="['cell_1', tabIndex==index?'active_p':'']"
    @click="getTabindex(index)">
    {{item}}</p>
  </div>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      tabIndex: 0,
      timeList: ['我的粉丝', '已邀合伙人', '我的买家', '我的访客']
    }
  },
  created () {
    this.showLoad(false)
  },
  methods: {
    getTabindex (index) {
      this.$set(this.$data, 'tabIndex', index)
    }
  }
}
</script>
