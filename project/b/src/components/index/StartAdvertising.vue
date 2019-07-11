<template>
  <section class="start_advertising" @click.self="closeAdvertising" v-if="advertisingList.length> 0">
    <div class="swiper_popup" id="startAdvertisingList">
      <swiper :options="swiperAdvertisingOption" ref="MyAdvertisingOption">
        <template id="" v-for="(item, index) in advertisingList">
          <swiper-slide :key="index" class="advertising_img_con">
            <img class="advertising_img" :src="item.image" @click="goTo(item)">
          </swiper-slide>
        </template>
        <div class="swiper-pagination" id="swiper-pagination-start-ad" slot="pagination" v-show="advertisingList.length> 1"></div>
      </swiper>
      <img class="close_start_advertising" @click.stop="closeAdvertising" src="../../assets/icon/icon/start-ad-close.png" alt="">
    </div>
  </section>
</template>

<script>
export default {
  name: 'StartAdvertising',
  data () {
    return {
      show: true,
      advertisingList: [],
      swiperAdvertisingOption: {
        loop: true,
        autoplay: 3000,
        speed: 750,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        preventClicksPropagation: false,
        paginationClickable: false,
        observeParents: true,
        notNextTick: true,
        observer: true,
        touchMoveStopPropagation: false
      }
    }
  },
  created () {
    this.getStartAdvertising()
  },
  methods: {
    getStartAdvertising () {
      let { uid } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.WindowsAdvertise,
        data: {
          uid
        }
      }).then(data => {
        let res = data.data
        if (res.status == '1') {
          this.advertisingList = res.data
        }
      })
    },
    // 弹窗广告跳转
    goTo (item) {
      // 页面跳转之前先关闭广告弹窗
      this.closeAdvertising()
      if (item.type == '2') {
        // 活动版式
        this.$router.push({name: 'Activity', params: { versionId: item.address }})
      } else if (item.type == '4') {
        // 商品详情
        this.$router.push({path: '/detail', query: {productNo: item.address}})
      }
    },
    // 关闭广告弹窗
    closeAdvertising () {
      this.$emit('closeAdvertising')
    }
  }
}
</script>
