<template>
  <section class="new_seckill_wrap" :id="productFloor.floorId" v-if="productFloor.activityInfos.length > 0" :style="{background: productFloor.bgColor}">
    <div class="new_seckill_tab_btn" ref="newSeckillBtnWrap" :style="{background: productFloor.listFloorDetail[0].bgColor,color: productFloor.listFloorDetail[0].btnBgColor}">
      <div class="seckill_tab_btn"
           v-for="(item, index) in productFloor.activityInfos"
           :style="{background: (newSeckillTabIdx === index? productFloor.listFloorDetail[0].selectBgColor: productFloor.listFloorDetail[0].defaultBgColor),color: (newSeckillTabIdx === index? productFloor.listFloorDetail[0].selectWordColor: productFloor.listFloorDetail[0].wordColor)}"
           ref="newSeckillBtn"
           @click="changeSeckillSession(index)">
        <p class="new_seckill_name">{{item.name}}</p>
        <p class="new_seckill_status" v-if="item.status == 1">已开抢</p>
        <p class="new_seckill_status" v-else>即将开始</p>

      </div>
    </div>
    <div class="new_seckill_tab_main" id="newSeckillTabMain" ref="newSeckillTabMain">
      <div class="new_seckill_good_list" v-for="(session, index) in productFloor.activityInfos" :key="index" ref="newSeckillMain">
        <div class="new_seckill_good"
             v-for="(good, idx) in session.products"
             :key="idx"
             @click="goDetali(good, index)"
        >
          <div class="new_seckill_good_img_box">
            <img class="new_seckill_good_img" :src="good.proImage">
            <span class="good_are_gone" v-if="good.remainderCount <= 0 && session.status != 0">已抢光</span>
          </div>
          <div class="new_seckill_good_detail">
            <div class="new_seckill_good_title">{{good.productName}}</div>
            <div class="new_seckill_good_price">
              <span class="new_seckill_good_price_current">￥{{good.buyingPrice}}<em class="new_seckill_good_price_original">￥{{good.originPrice}}</em></span>
              <button class=" new_seckill_Buying" :class="{'bgBlue_colorWhite':good.remainderCount >= 1}" v-if="session.status != 0">{{good.remainderCount >= 1?'马上抢':'去看看'}}</button>
              <button class="new_seckill_Buying" v-else>即将开始</button>
            </div>
          </div>
        </div>
        <div class="new_seckill_session_next" @click="changeSeckillSession(index+1)" v-if="index != productFloor.activityInfos.length-1"><span>下一场</span></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'newSecondsKill',
  props: {
    productFloor: {
      required: true,
      type: Object
    },
    seckillId: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      newSeckillTabIdx: 0
    }
  },
  methods: {
    // 切换场次
    changeSeckillSession (index) {
      this.newSeckillTabIdx = index
      let scrollX = this.$refs.newSeckillMain[index].offsetLeft
      this.$refs.newSeckillTabMain.scrollLeft = scrollX
    },
    // 去详情
    goDetali (good, index) {
      let isActivity = 0
      let productNo = good.productNo
      let activityNo = ''
      if (this.productFloor.activityInfos[index].status == 1 && good.remainderCount >= 1) {
        isActivity = 1
        activityNo = this.productFloor.activityInfos[index].activityNo
      }
      this.$router.push({
        path: '/detail',
        query: {
          productNo,
          isActivity,
          activityNo
        }
      })
    },
    SecondsKillScroll () {
      let scrollX = this.$refs.newSeckillTabMain.scrollLeft
      let lastIndex = this.$refs.newSeckillMain.length-1
      let maxScrollX = -this.$refs.newSeckillTabMain.offsetWidth
      let index = ''
      for (let i = 0; i<this.$refs.newSeckillMain.length; i++) {
        maxScrollX += this.$refs.newSeckillMain[i].offsetWidth
        if (this.$refs.newSeckillMain[i].offsetLeft <= scrollX + 280) {
          index = i
        }
      }
      this.newSeckillTabIdx = index
      // scrollX 当前滚动距离  maxScrollX 最大滚动距离
      if (scrollX == maxScrollX) {
        this.newSeckillTabIdx = lastIndex
      } else if (scrollX == '0') {
        this.newSeckillTabIdx = 0
      }
      // 设置 tab居中显示
      this.$refs.newSeckillBtnWrap.scrollLeft = this.$refs.newSeckillBtn[this.newSeckillTabIdx].offsetLeft - (this.$refs.newSeckillBtnWrap.offsetWidth - this.$refs.newSeckillBtn[0].offsetWidth) / 2
    },
    // 保存H5秒杀滚动位置
    saveScroll () {
      let seckillScroll = window.sessionStorage.getItem('seckillScroll') || 0
      let seckillId = this.seckillId
      if (seckillScroll) {
        seckillId = JSON.parse(seckillScroll)
      }
      seckillId.forEach((i) => {
        if (i.floorId == this.productFloor.floorId) {
          i.xScroll = this.$refs.newSeckillTabMain.scrollLeft
        }
      })
      window.sessionStorage.setItem('seckillScroll', JSON.stringify(seckillId))
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.newSeckillTabMain.addEventListener('scroll', this.SecondsKillScroll, false)
      }, 300)
      let seckillScroll = window.sessionStorage.getItem('seckillScroll')
      if (seckillScroll) {
        let seckillId = JSON.parse(seckillScroll)
        seckillId.forEach((i) => {
          if (i.floorId == this.productFloor.floorId) {
            this.$refs.newSeckillTabMain.scrollLeft = i.xScroll
            this.SecondsKillScroll()
          }
        })
      }
    })
  },
  beforeDestroy () {
    this.$refs.newSeckillTabMain.removeEventListener('scroll', this.SecondsKillScroll, false)
  }
}
</script>
