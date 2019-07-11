<template>
  <section>
    <div class="myConcern fixedContainer">
      <div class="h_line"></div>
      <ul class="celebrity-store flex">
        <li v-for="(item, index) in nav" :key="index" class="celebrity-store-item c_999" :class="{'selected': selectedIdx == index}" @click="selectConcern(index)">{{item}}</li>
      </ul>
    </div>
    <div class="concernContent">
      <div class="concernList" v-if="concernList && concernList.length">
        <dl class="concernListItem flex" v-for="(item, index) in concernList" :key="index" @click="goMyConcernPage(item)">
          <dt class="itemImgWrap">
            <img class="itemImg" :src="item.img" alt="">
          </dt>
          <dd class="itemInfo flex">
            <p class="itemName c_333">{{idx == 0?item.nickName:item.name}}</p>
            <p class="itemSignature c_999">{{idx == 0?item.sign:item.explanation}}</p>
          </dd>
        </dl>
      </div>
      <div class="concernListNull nodata_order" v-else>
        <img src="../../assets/icon/icon/null_data.png" alt="">
        <p>{{selectedIdx == 0?'暂无网红信息':'暂无店铺信息'}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import BodyBg from '../../mixin/index'
export default {
  name: "MyConcern",
  mixins: [BodyBg],
  data () {
    return {
      nav: ["网红", "店铺"],
      selectedIdx: window.sessionStorage.getItem('concernIndex')|| this.$store.state.route.query.concernIndex || 0,
      idx: 0,
      pageNo: 1,
      pageCount: 1,
      concernList: []
    }
  },
  created () {
    window.sessionStorage.removeItem('concernIndex')
    this.getConcernList()
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    if (to.name == 'WebCelebrity' || to.name == 'Store') {
      window.sessionStorage.setItem('concernIndex', this.selectedIdx)
    }
    next()
  },
  methods: {
    /**
     * 查询关注列表
     * uid* 用户id
     * attentionFlag* 查询标识
     *  0-网红列表
     *  1-店铺列表
     * pageNo*  页数
     */
    getConcernList () {
      let { uid } = this.$store.state.userInfo
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.myAttentionStore,
        data: {
          uid,
          attentionFlag: this.selectedIdx,
          pageNo: this.pageNo
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.concernList = []
        this.idx = this.selectedIdx
        if (res.status == '1') {
          this.concernList = res.data
        }
      })
    },
    selectConcern (index) {
      this.selectedIdx = index
      this.getConcernList()
    },
    /**
     * 跳转关注对象主页
     *  type  关注标识
     *    0-网红
     *    1-店铺
     */
    goMyConcernPage (item) {
      if (this.selectedIdx == '1') {
        this.$router.push({
          path: '/store',
          query: {
            storeNo: item.storeNo
          }
        })
      } else {
        this.$router.push({
          path: '/celebrity',
          query: {
            starNo: item.starNo
          }
        })
      }
    }
  }
}
</script>
