<template>
<section>
  <div class="spike_title_wrap">
    <template v-for="(item, i) in productFloor.activityInfos">
      <div :class="['spike_title_item', tabIndex == i ? 'spike_title_activi' : '']" :key="i" @click="bindTab(i)">
        <p :class="['spike_time', tabIndex==i?'c_red':'']">{{item.name}}</p>
        <p :class="['spike_status', tabIndex == i ? 'c_red':'']">{{item.status==1?'正在秒杀':'即将开抢'}}</p>
      </div>
    </template>
  </div>
  <ModelEighteen :product="selectObj.products" :rebateStatus="productFloor.rebateStatus"></ModelEighteen>
</section>
</template>
<script>
import ModelEighteen from 'components/common/floorLayOut/ModelEighteen'
export default {
  props: {
    productFloor: {
      required: true,
      type: Object,
      default: {}
    }
  },
  components: {
    ModelEighteen
  },
  data () {
    return {
      tabIndex: 0,
      selectObj: {
        products: []
      }
    }
  },
  created () {
    this.selectObj = this.productFloor.activityInfos[0]
    let {activityNo, status} = this.selectObj
    this.selectObj.products.forEach((item) => {
      item.activityNo = activityNo
      item.status = status
      item.sourcePage = "spike"
    })
  },
  methods: {
    bindTab (i) {
      this.tabIndex = i
      this.selectObj = this.productFloor.activityInfos[i]
      let {activityNo, status} = this.selectObj
      this.selectObj.products.forEach((item) => {
        item.activityNo = activityNo
        item.status = status
        item.sourcePage = "spike"
      })
    }
  }
}
</script>
