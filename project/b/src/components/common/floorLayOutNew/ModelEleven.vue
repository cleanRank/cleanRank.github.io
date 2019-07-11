<template>
  <div class="floor-eleven" :style="{background: floor.bgColor}">
    <div class="floor-eleven-row" v-for="(couponsRow, index) in floor.listFloorDetail" :key="index">
      <div class="floor-coupons coupons-loading" v-for="(coupons, idx) in couponsRow" :key="idx">
        <img class="floor-coupons-img lazy" v-lazy="coupons.picUrl"   @click="getCouponsRes(coupons)" lazy="loading">
      </div>
    </div>
  </div>
</template>

<script>
import {jointLand} from 'lib/until'
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
  methods: {
    // 领取优惠券
    getCouponsRes (e) {
      let { couponNo } = e
      let {mobile, token} = this.$store.state.userInfo
      if (!token) {
        jointLand()
        return false
      }
      this.$post({
        url: this.$store.state.api.getsubjectapp,
        data: {
          mobile,
          token,
          subjectNo: couponNo,
          staffNum: ''
        }
      }).then(({data: res}) => {
        this.showToast({msg: res.statusDetail})
      })
    }
  }
}
</script>

