<template>
  <div class="new-floor WebCelebrityStore" :style="{background: productFloor.bgColor}">
    <!-- new title start -->
    <div class="mb-16" v-if="productFloor.sourcePage =='index' && productFloor.image">
      <OneBanner :productFloor="productFloor"></OneBanner>
    </div>
    <!-- new title end -->
    <!-- new content start -->
    <div class="new-store-wrap">
      <div class="new-store-scroll">
        <div class="new-store" v-for="(item, index) in productFloor.storeList" :key="index" @click="goStorePage(item.storeNo)">
          <div class="new-store-img-wrap">
            <img class="new-store-img" :src="item.storeImg" alt="">
          </div>
          <div class="new-store-name c_333">{{item.storeName}}</div>
          <p class="celebrityName" v-if="item.storeStarNickName"><span class="celebrityNameTxt">{{item.storeStarNickName}}</span></p>
        </div>
      </div>
    </div>
    <!-- new content end -->
  </div>
</template>

<script>
import OneBanner from 'components/common/banner/OneBanner'
export default {
  name: "WebCelebrityStore",
  props: {
    productFloor: {
      required: true,
      type: Object
    }
  },
  data () {
    return {}
  },
  components: {
    OneBanner
  },
  methods: {
    goStorePage (storeNo) {
      this.$router.push({
        path: '/store',
        query: {
          storeNo: storeNo
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/app";
@import "../../../assets/scss/flex";
.WebCelebrityStore{
    @include px2rem(padding, 16 0);

}
.new-store-scroll {
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling:touch;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  -webkit-transform: translateZ(0px);
  position: static;
  @include px2rem(padding, 0 24);
  font-size: 0;
  .new-store {
    display: inline-block;
    @include px2rem(width, 226);
    @include px2rem(padding, 10 23);
    @include px2rem(margin, 16 6);
    @include px2rem(border-radius, 12);
    background: #ffffff;
    box-shadow: 0 0 0.16rem 0 rgba(0, 0, 0, 0.06), 0 0.10667rem 0.10667rem 0 rgba(0, 0, 0, 0.02);
    position: relative;
    font-size: 0;
    box-sizing: border-box;
  }
  .new-store:first-of-type{
    margin-left: 0;
  }
  .new-store:last-of-type{
    margin-right: 0;
  }
  .new-store-img-wrap{
    @include px2rem(width, 180);
    @include px2rem(height, 180);
    overflow: hidden;
    .new-store-img{
      @include px2rem(width, 180);
      @include px2rem(height, 180);
      display: block;
    }
  }
  .new-store-name{
    @include font-dpr(26);
    @include px2rem(height, 34);
    @include px2rem(line-height, 37);
    @include px2rem(padding-top, 12);
    @include px2rem(padding-bottom, 2);
    text-align: center;
    @include singleline-ellipsis();
  }
  .celebrityName{
    position: absolute;
    left: 0;
    @include px2rem(top, 16);
    .celebrityNameTxt{
      @include px2rem(height, 28);
      @include px2rem(line-height, 28);
      @include px2rem(padding, 0 10);
      @include font-dpr(20);
      color: #fff;
      @include px2rem(border-radius, 0 14 14 0);
      @include px2rem(width, 78);
      @include lines-ellipsis(1);
      background-image: linear-gradient(-129deg, #64DDFF 3%, #3F92F6 100%);
      display: inline-block;
    }
  }
}
.new-store-scroll::-webkit-scrollbar {display: none; width: 0;height: 0; opacity: 0;width:0;height:0}
</style>

