<template>
  <div class="searchActivity">
    <SearchSort @setOrder="setOrder"></SearchSort>
    <div class="ActivityList" @scroll="onScroll($event)">
      <div class="Activitycolumn">
        <p class="ActivitycolumnTxt" v-if="title">限时促销：{{title}}</p>
        <ul class="ActivityGoods">
          <li class="ActivityGood" v-for="(item, idx) in list" :key="idx" @click="goDetail(item)">
            <img class="ActivityGoodImg lazy" v-lazy="item.productImg" alt="" lazy="loading">
            <div class="ActivityGoodInfo">
              <p class="ActivityGoodName" :class="{'biserial-good-crossBorder floor-good-crossBorder-y': item.isCrossBorder == 1}">{{item.productName}}</p>
              <div class="ActivityGoodLabelWrap">
                <span class="ActivityGoodLabel" v-for="(label, i) in item.activityLabel" :key="i">{{label}}</span>
              </div>
              <div class="ActivityGoodMoney biserial-good-label">
                <span class="biserial-good-info-price floor-good-price"><span class="biserial-good-info-price-before">￥</span>{{item.productPrice}}</span>
              </div>
              <!-- 加购物车 -->
              <img class="ActivityAddCar" src="../../assets/icon/icon/add_car.png" @click.stop="addCar(item)">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <img class="goTop" @click="goTop" src="../../assets/icon/icon/go_top.png" alt="">
    <img class="goCar" @click="goCar" src="../../assets/icon/icon/go_car.png" alt="">
  </div>
</template>

<script>
import { jointLand } from 'lib/until'
import { mapActions } from 'vuex'
import SearchSort from './SearchSort.vue'
export default {
  data () {
    return {
      title: '',
      activityNo: '',
      pageNo: 1,
      pageCount: 1,
      order: {
        isDesc: 0,
        searchType: 0
      },
      list: [],
      bScrollLoading: false
    }
  },
  components: {
    SearchSort
  },
  created () {
    this.showLoad(false)
    let activityNo = this.$route.query.activityNo
    this.$set(this.$data, 'activityNo', activityNo)
    this.showList()
  },
  mounted () {
    this.$nextTick(() => {
      let innerH = window.innerHeight
      let otherH = $('.head-cont').height()
      $('.searchActivity').css('height', innerH - otherH)
      $('.searchActivity').css('border-top', '1px solid #fff')
      $('.head-cont').css('border-bottom', '1px solid #fff')
    })
  },
  methods: {
    ...mapActions([
      "addInToShopCart"
    ]),
    onScroll (e) {
      // 滚动到底部
      if (e.target.scrollHeight- e.target.scrollTop == e.target.offsetHeight && !this.bScrollLoading) {
        this.showList(0, 1)
      }
    },
    // 排序
    setOrder (order) {
      this.order = order
      this.pageNo = this.pageCount = 1
      this.showList(1)
    },
    // 列表
    showList (pageNo, type) {
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.bScrollLoading = true
      this.showLoad(true)
      if (pageNo) {
        this.$set(this.$data, 'pageNo', pageNo)
        this.list = []
      }
      let { uid, token } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.searchProduct,
        data: {
          activityNo: this.activityNo,
          pageNo: this.pageNo,
          uid,
          token,
          ...this.order
        }
      }).then(({ data }) => {
        this.showLoad(false)
        let res = data
        if (res.status == 1) {
          if (type) {
            this.list = this.list.concat(res.data.productList)
          } else {
            this.list = res.data.productList
            this.title = res.data.title
          }
          this.pageNo += 1
          this.pageCount = res.pageCount
        } else {
          this.showToast({
            msg: res.statusMessage
          })
        }
        this.bScrollLoading = false
      })
    },
    goCar () {
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      this.$router.push('/shopCart')
    },
    // 回到顶部
    goTop () {
      document.getElementsByClassName('ActivityList')[0].scrollTop = 0
    },
    addCar (good) {
      console.log(good)
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      this.showLoad(true)
      this.addInToShopCart({
        productNo: good.productNo,
        activityNo: good.activityNo || '',
        starNo: '',
        quantity: 1
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == "1") {
          this.showToast({
            msg: '添加购物车成功'
          })
          console.log(res)
        } else {
          this.showToast({
            msg: res.statusMessage
          })
        }
      })
    },
    goDetail (good) {
      let {productNo, activityNo} = good
      this.$router.push({
        path: '/detail',
        query: {
          productNo,
          activityNo: activityNo || '',
          isActivity: activityNo ? 1 : 0
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/scss/app";
  .searchActivity{
    display: flex;
    flex-direction: column;
  }
  .ActivityList{
    flex: 1;
    overflow-y: scroll;
  }
  .ActivitycolumnTxt{
    @include px2rem(height, 68);
    @include px2rem(line-height, 68);
    @include px2rem(padding, 0 24);
    color: $color444;
    @include font-dpr(24);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .ActivityGoods{
    background: #ffff;
    .ActivityGood:last-of-type .ActivityGoodInfo{
      border-bottom: none;
    }
  }
  .ActivityGood{
    display: flex;
    flex-direction: row;
    align-items: center;
    @include px2rem(padding, 0 24);
    .ActivityGoodImg{
      @include px2rem(width, 200);
      @include px2rem(height, 200);
    }
    &>img[lazy=loading] {
      background: url('../../assets/icon/banner/lazy_proudt.png') center no-repeat;
      @include px2rem(background-size, 200 200);
    }
    .ActivityGoodInfo{
      flex: 1;
      @include px2rem(height, 240);
      @include px2rem(margin-left, 24);
      border-bottom: 1px solid #F4F4F4;
      display: flex;
      flex-direction: column;
      position: relative;
      @include px2rem(padding, 20 0);
    }
    .ActivityGoodName{
      @include px2rem(margin-top, 10);
      @include px2rem(margin-bottom, 12);
      @include px2rem(line-height, 40);
      color: $color444;
      @include font-dpr(28);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .ActivityGoodLabelWrap{
      font-size: 0;
      .ActivityGoodLabel{
        display: inline-block;
        @include font-dpr(24);
        @include px2rem(padding, 2 4);
        @include px2rem(border-radius, 4);
        border: 1px solid $redColor;
        color: $redColor;
        @include px2rem(line-height, 26);
        @include px2rem(margin-right, 12);
        @include px2rem(margin-bottom, 6);
      }
    }
    .ActivityGoodMoney{
      margin-top: auto;
    }
    .biserial-good-label{
      padding: 0;
      .biserial-good-info-price{
        @include px2rem(margin-right, 16);
      }
    }
    .ActivityAddCar{
      position: absolute;
      @include px2rem(width, 58);
      @include px2rem(height, 58);
      right: 0;
      @include px2rem(bottom, 28);
    }

  }
  .goTop,.goCar{
    @include px2rem(width, 84);
    @include px2rem(height, 84);
    position: fixed;
  }
  .goCar,.goTop{
    @include px2rem(right, 40);
    @include px2rem(bottom, 40);
  }
  .goTop{
    @include px2rem(bottom, 132);
  }
</style>
