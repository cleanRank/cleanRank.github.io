<template>
	<section>
    <!-- banner 图片 e-->
    <div class="sk-bg-color">
      <swiper :options="swiperBannerOption">
        <template id="" v-for="(slide, index) in banner">
          <swiper-slide :key="index">
            <a :href="slide.url">
              <img width="100%" class="lazy" :src="slide.image" lazy="loading"></span>
            </a>
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <!-- banner 图片 e-->
		<ul id="sk-time-list" class="flex" :class="{'list-fix':isPosition}">
			<li class="sk-shedule cell_1" v-for="(item, i) in secondsList" :key="i" @click="snapUpState(i)">
				<div class="sk-time-box" :class="{'cur':i==type}">
					<div class="sk-time-num">
						<span class="sk-time-day">{{item.activityName.split(',')[0]}}</span>
            <span id="sk-hour-2">{{item.activityName.split(',')[1]}}</span>
					</div>
          <p class="sk-time-text">{{item.activityName.split(',')[2]}}</p>
				</div>
			</li>
		</ul>
		<ul id="sk-time-left">
      <li class="sk-remind flex info_2" v-if="type == 1">
				<h3 class="sk-remind-text cell_1">限时限量 疯狂抢购</h3>
				<div id="sk-count-down2" class="sk-remind-time">
				  <p>距本场结束还有<span>{{countDownTime.hours}}</span>:<span>{{countDownTime.minutes}}</span>:<span>{{countDownTime.seconds}}</span></p>
				</div>
			</li>
			<li class="sk-remind flex info_1" v-else>
				<h3 class="sk-remind-text cell_1">{{type==2?'即将开始 疯狂抢购':'还有机会 继续抢购'}}</h3>
			</li>
		</ul>
		<div id="activityListWrap" class="activity_list_wrap">
			<ul class="box_1">
				<li class="sk-goods-wrapper" v-for="(item, i) in selectList.productList" @click="goDetali(item)" :key="i">
					<a class="sk-goods-detail flex" href="javascript:;">
						<div class="sk-goods-img">
							<img :src="item.proImage" />
						</div>
						<div class="sk-goods-info cell_1">
							<div class="sk-goods-title">
								<p>{{item.productName}}</p>
								<span>{{item.viceTitle}}</span>
							</div>
							<div class="sk-goods-payment flex">
								<!-- <p class="cell_1">月付: ￥{{item.monthAmount}}起</p> -->
								<span v-if="item.remainderCount <= 20 && item.remainderCount >0">仅剩 {{item.remainderCount}}件</span>
                <span v-else-if="item.remainderCount < 30 && item.remainderCount > 20">库存紧张</span>
							</div>
							<div class="sk-goods-purchase flex">
								<p class="cell_1">￥<em>{{item.buyingPrice}}</em><del>￥{{item.originPrice}}</del></p>
								<span class="sk-goods-grab" :class="{'dis_btn':item.remainderCount <1}" v-if="type != 2">{{item.remainderCount >= 1?'马上抢':'已抢完'}}</span>
                <span class="sk-goods-grab dis_btn" v-else>即将开抢</span>
							</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
	</section>
</template>

<script>
export default {
  data () {
    return {
      swiperBannerOption: {
        effect: 'slide',
        loop: false,
        autoplay: 4000,
        speed: 1000,
        initialSlide: 1,
        resistanceRatio: 0,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        preventClicksPropagation: false,
        touchMoveStopPropagation: false
      },
      secondsList: '',
      type: 1,
      selectList: '',
      banner: '',
      isPosition: false,
      countDownTime: {
        hours: "00",
        minutes: "00",
        seconds: "00"
      }
    }
  },
  methods: {
    secondsKissData () {
      // 秒杀列表
      return this.$post({
        url: this.$store.state.api.activityproductshow,
        data: {
          time: new Date().getTime()
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == 1) {
          let {diffSeconds, data, banner} = res
          this.$set(this.$data, 'secondsList', data)
          this.banner = banner
          // 默认展示正在抢购的商品
          this.selectList = data[this.type]
          // 抢购中倒计时
          if (diffSeconds >= 0) {
            this.$nextTick(() => {
              window.time = setInterval(() => {
                diffSeconds--
                this.countDown(diffSeconds)
              }, 1000)
            })
          } else {
            clearInterval(window.time)
            delete window.time
          }
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    goDetali (item) {
      // 跳转到详情页
      if (item.remainderCount <= 0) return false
      let isActivity = 0
      let productNo = item.productNo
      let activityNo = ''
      if (this.type != 2 && item.remainderCount >= 1) {
        isActivity = 1
        activityNo = this.selectList.activityNo
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
    // 滚动条事件
    scrollFunction () {
      const topHeight = $('.sk-bg-color').height()
      window.addEventListener('scroll', () => {
        let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop)
        // 当滚动条高度banner的高度，标题栏悬浮
        this.isPosition = scrollTop > topHeight
      })
    },
    snapUpState (ind) {
      this.type = ind
      // 选中的活动列表
      this.selectList = this.secondsList[ind]
    },
    countDown (countTime) {
      if (countTime==0) { window.location.reload() }
      this.$data.countDownTime.hours = parseInt(countTime / (60 * 60) % 24)>= 10? parseInt(countTime / (60 * 60) % 24) : '0' + parseInt(countTime / (60 * 60) % 24)
      this.$data.countDownTime.minutes = parseInt(countTime / 60 % 60) >= 10 ? parseInt(countTime / 60 % 60) : '0' + parseInt(countTime / 60 % 60)
      this.$data.countDownTime.seconds = parseInt(countTime % 60) >= 10 ? parseInt(countTime % 60) : '0' + parseInt(countTime % 60)
    }
  },
  created () {
    this.scrollFunction()
    this.secondsKissData()
  }
}
</script>
