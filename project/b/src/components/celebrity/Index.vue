<template>
  <section>
    <div class="celebrity">
      <div class="fixedContainer">
        <!-- 网红信息 s -->
        <div class="celebrityInfoWrap flex" :style="{backgroundImage: (celebrity.banner? 'url('+celebrity.banner+')':'linear-gradient(-135deg, #3FFFF1 0%, #6D64FF 100%)')}">
        <!-- <div class="celebrityInfoWrap flex" :style="{backgroundImage: (celebrity.banner? 'url('+celebrity.banner+')':'linear-gradient(-135deg, #3FFFF1 0%, #6D64FF 100%)')}"> -->
            <div class="celebrityHeadImgWrap">
              <img class="celebrityHeadImg" :src="celebrity.img" alt="">
            </div>
            <div class="celebrityInfo">
              <p class="celebrityName">{{celebrity.nickName}}</p>
              <p class="celebritySignature">{{celebrity.sign}}</p>
            </div>
            <div class="concernStatusWrap">
              <div class="concernStatus" @click="followedMethod">
                  <span :class="celebrity.followersStatus == '1'?'c_999':''">{{celebrity.followersStatus == '1'?'已关注':'关注'}}</span>
              </div>
            </div>
          </div>
          <!-- 网红信息 e -->
          <div class="celebrityRecommendTitle">
            <img src="../../assets/icon/celebrity/celebrity_title.png" alt="">
          </div>
      </div>
        <!-- 网红商品推荐 s -->
        <div class="celebrityRecommendGoodWrap">
          <div class="celebrityRecommendGoodList" v-if="celebrityGoods.length">
            <div class="celebrityRecommendGood"
              v-for="(item, index) in celebrityGoods"
              :key="index"
              @click="goodDetail(item)"
            >
              <div class="celebrityRecommendGoodImgWrap">
                <img
                  class="celebrityRecommendGoodImg lazy"
                  v-lazy="item.mainImagePath"
                  :alt="item.productName"
                  :title="item.productName"
                  lazy="loading"
                >
              </div>
              <div class="celebrityRecommendGoodName">{{item.productName}}</div>
              <div class="celebrityRecommendGoodPrice"><span class="small">￥</span>{{item.price}}</div>
            </div>
          </div>
          <p class="nullData" v-else>暂无推荐商品</p>
        <!-- 网红商品推荐 e -->
        </div>
    </div>
  </section>
</template>

<script>
import BodyBg from '../../mixin/index'
export default {
  mixins: [BodyBg],
  data () {
    return {
      starNo: this.$route.query.starNo || '', // 网红编号
      celebrity: {}, // 网红信息
      celebrityGoods: [],
      pageNo: 1, // 当前页
      pageSize: 30, // 分页单位
      pageCount: 1, // 总页数
      isSCrollLoading: false
    }
  },
  created () {
    this.getCelebrityInfo()
    this.getCelebrityGoods()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    next()
  },
  methods: {
    // 查询网红主页信息
    getCelebrityInfo () {
      this.showLoad(true)
      let uid = this.$store.state.userInfo.uid || ''
      this.$post({
        url: this.$store.state.api.starInfo,
        data: {
          uid,
          starNo: this.starNo
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          this.celebrity = res.data
        }
      })
    },
    // 查询网红主页商品推荐
    getCelebrityGoods (type) {
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.starProducts,
        data: {
          starNo: this.starNo,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          pageCount: this.pageCount
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.isSCrollLoading = false
        if (res.status == '1') {
          this.pageNo += 1
          this.pageCount = res.pageCount
          if (!type) {
            this.celebrityGoods = res.data
          } else {
            this.celebrityGoods = this.celebrityGoods.concat(res.data)
          }
        }
      })
    },
    /**
     * 网红-店铺关注、取消关注(*代表必填)
     * uid* 用户id
     * followType*  1-网红  2-店铺
     * followNo*  网红或店铺编号
     * status 1-关注  0-取消关注
     */
    // 切换关注状态
    followedMethod () {
      let { uid } = this.$store.state.userInfo
      if (!uid) {
        this.$router.push('/login')
        return false
      }
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.follow,
        data: {
          uid,
          followType: 1,
          followNo: this.celebrity.starNo,
          status: this.celebrity.followersStatus == '0'? 1 : 0
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          this.celebrity.followersStatus = res.data.status
        }
      })
    },
    // 跳转商品详情
    goodDetail (good) {
      this.$router.push({
        path: 'detail',
        query: {
          productNo: good.productNo,
          isActivity: 0,
          activityNo: '',
          starNo: this.starNo,
          starName: this.celebrity.name
        }
      })
    },
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.getCelebrityGoods(1)
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    }
  }
}
</script>

<style>

</style>
