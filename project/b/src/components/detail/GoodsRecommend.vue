<template>
  <div class="floor_conent_recommend floor_conent" v-if="productRecommend.length>0" :class="{'bottompadding': this.$route.name === 'Paysucces'}">
    <ul class="recommend_title flex">
      <li class="cell_1 title_item">
        <a href="javascript:;">宝贝推荐</a>
      </li>
    </ul>
    <ul class="ac_list_2 mar15">
        <li v-for="(item, i) in productRecommend" :key="i" class="index_list_2">
          <a href="javascript:;" class="ac_cell_2" @click="goDetail(item, $event)">
            <div class="img_box">
              <img v-lazy="item.proImage" class="lazy prod_pic" :title="item.proName"  alt="item.proName" lazy="loading"/>
             </div>
            <div class="goods_detail_box">
              <div class="goods_name">{{item.productName}}</div>
              <div class="goods_price"><span class="price_z">￥{{item.price}}</span></div>
            </div>
          </a>
        </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
  import { getQueryString } from 'lib/until'
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        productRecommend: [],
        recentView: [],
        hasLogin: false,
        tabIndex: 0
      }
    },
    activated () {
      this.productRecommend = []
      this.showList()
    },
    props: ['productNo', 'type'],
    created () {
      this.showList()
    },
    methods: {
      ...mapActions([
        "updateToast"
      ]),
      showList () {
        return this.$post({
          url: this.$store.state.api.RecommendProduct,
          data: {
            pageNO: 1,
            productNo: this.$store.state.route.query.productNo || getQueryString('productNo') || this.productNo
          }
        }).then(data => {
          let res = data.data
          if (res.status == 1) {
            this.$set(this.$data, 'productRecommend', res.data.slice(0, 6))
          } else {
          }
        })
      },
      changeTab (num) {
        this.$set(this.$data, 'tabIndex', num)
      },
      goDetail (recommendProduct, e) {
        const {productNo} = recommendProduct
        if (this.type && this.type==1) {
          window.location.href = '#/detail?productNo='+productNo +'&isActivity=0'
        } else {
          this.$emit('productNo', recommendProduct.productNo)
        }
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .img_box {
    position: relative;
    @include px2rem(width, 240);
    @include px2rem(height, 240);
    margin: 0 auto;
    .prod_pic {
      width: 100%;
      height: 100%;
    }
    .tag_img {
      height: .45rem;
      width: auto;
    }
  }
  .img_box [lazy="loading"] {
    background: url("../../assets/icon/banner/lazy_proudt.png") no-repeat 50% 50% / 100% 100%;
  }
  .title_item{
    text-align:center;
    @include px2rem(height,94);
    @include px2rem(line-height,94);
    a{
      @include font-dpr(30);
      color:$color333;
      font-weight: 500;
      @include px2rem(padding-left,42);
      background: url(../../assets/icon/icon/xin_03.png) no-repeat left center;
      @include px2rem(background-size, 32 32);
    }
    &.active{
      a{
        color:$mainColor;
        border-bottom:1px solid $mainColor;
        @include px2rem(padding-bottom,24);
      }
     }

  }
  .ac_list_2 .index_list_2{
    height: auto;
    // @include px2rem(padding, 0 10);
    .ac_cell_2{
      @include px2rem(padding, 0 7.5 0);
      // border: 1px solid $borderColor;
    }
  }
  .goods_detail_box{
    @include px2rem(margin-top,15);
    @include px2rem(padding, 0 0 12 10);
    // .goods_name{
    //   @include px2rem(padding-right, 40);
    // }
  }
  .floor_conent_recommend{
    // padding-bottom:1.2rem;
    margin-top: -1.6rem;
    background: #f5f5f5;
  }
  .bottompadding{
    padding-bottom: 0.4rem;
  }
</style>
