<template>
<section>
  <div class="flex table_card_title">
    <p class="cell_1" v-for="(item, i) in txtList" :key="i" :class="{'cur_tab':i==tabIndex}" @click="bindTableclick(i)">{{item}}</p>
  </div>
  <component :is="currentView"></component>
</section>
</template>
<script>
import CardModel from './CardModel'
import OrderModel from './OrderModel'
export default {
  data () {
    return {
      currentView: 'CardModel',
      tabIndex: 0,
      txtList: ['礼品卡购买', '礼品卡订单']
    }
  },
  components: {
    CardModel,
    OrderModel
  },
  created () {
    if (this.$store.state.route.from.name == "CardRate") {
      this.bindTableclick(1)
    }
  },
  methods: {
    bindTableclick (i) {
      this.tabIndex = i
      // 切换组件
      this.currentView = i == 0 ? 'CardModel':'OrderModel'
    }
  }
}
</script>
