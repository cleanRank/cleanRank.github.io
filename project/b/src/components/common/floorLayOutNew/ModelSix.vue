<template>
  <div class="floor-six">
    <div class="seckill-wrap">
      <ul class="seckill-nav">
        <li class="nav-item" v-for="(nav, index) in floor.activityInfos" :key="index" @click="sessionTap(nav, index)" :class="{'cur':sessionIdx == index}">
          <p class="nav-item-name">{{nav.name}}</p>
          <p class="nav-item-status">{{nav.status == '1'?'正在秒杀':'即将开抢'}}</p>
        </li>
      </ul>
      <ul class="seckill-list">
        <ModelGood v-for="(good, index) in products" :key="index" :good="good" :rebateStatus="floor.rebateStatus" :seckill="seckill"></ModelGood>
      </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
  import mixin from './mixin'
  import ModelGood from './ModelGood'
  export default {
    mixins: [mixin],
    data () {
      return {
        products: [],
        sessionIdx: 0,
        seckill: {
          status: 0,
          activityNo: ''
        }
      }
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    },
    components: {
      ModelGood
    },
    created () {
      this.products = this.floor.activityInfos[0].products
      this.seckill.status = this.floor.activityInfos[0].status
      this.seckill.activityNo = this.floor.activityInfos[0].activityNo
    }
  }
</script>
