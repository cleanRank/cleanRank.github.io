<template>
<section v-if="commentList">
<div class="nodata_order"v-if="commentList.length==0 && detailIndex != 1">
  <img src="../../assets/icon/icon/pl_jg.png">
  <p>还没有评论哦～</p>
</div>
<ul class="comment_list_wrap" v-else>
  <template v-for="(item, i) in commentList">
  <li class="comment_item_box" :key="i">
    <div class="conment_box">
      <div class="nickname_box flex">
        <span class="cell_0 headerIcon_box">
          <img class="header_icon" :src="item.userImg">
        </span>
        <span class="name_box cell_0 font24">{{item.nickName?item.nickName:'匿名'}}</span>
        <span class="cell_1 star_box">
          <template v-for="j in 5">
            <b :key="j" :class="['star_x', item.productCommentGrade>=j?'star_h':'']"></b>
          </template>
        </span>
      </div>
      <p class="spec_title c_999 font12">{{item.skuParameters}}</p>
      <p class="spec_title c_999 font12">购买时间: &nbsp;{{item.orderTime}}</p>
      <p class="content_box font14">{{item.productCommentContent}}</p>
      <div class="comment_img_list flex">
        <template v-for="(_item, k) in item.productCommentPicture">
          <span class="comment_img_item cell_0" :key="k">
            <img :src="_item" @click="toggleFullScreenBanner(k, item.productCommentPicture)">
          </span>
        </template>
      </div>
      <p class="reply_conment" v-if="item.content"><b class="font14">掌柜回复：</b><span class="font14 c_999">{{item.content}}</span></p>
    </div>
    <div class="horizontal_line"></div>
  </li>
  </template>
</ul>
<section class="detailBox" v-if="fullScreenBannerShowFlag" :class="{fullScreenBanner: fullScreenBannerShowFlag}" @click="toggleFullScreenBanner">
  <swiper :options="swiperOptionComment">
    <template id="" v-for="(slide, index) in bannerComment">
      <swiper-slide :key="index">
        <div class="img_box maxWH">
          <span><img alt="" class="" :src="slide"></span>
        </div>
      </swiper-slide>
    </template>
    <div class="swiper-pagination font12" slot="pagination" v-show="bannerComment.length > 0"></div>
  </swiper>
</section>
</section>
</template>
<script>
export default {
  data () {
    return {
      swiperOptionComment: {
        speed: 1000,
        initialSlide: 0,
        preventClicksPropagation: true,
        paginationType: 'fraction',
        pagination: '.swiper-pagination'
      },
      fullScreenBannerShowFlag: false,
      bannerComment: []
    }
  },
  props: {
    commentList: {
      required: true,
      type: Array,
      default: []
    },
    detailIndex: {
      required: false,
      type: String
    }
  },
  methods: {
    // 切换全屏banner显示状态
    toggleFullScreenBanner (index, item) {
      this.bannerComment = []
      this.fullScreenBannerShowFlag = !this.fullScreenBannerShowFlag
      if (item) {
        let obj = JSON.parse(JSON.stringify(item))
        obj.splice(index, 1)
        obj.unshift(item[index])
        this.bannerComment = obj
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nodata_order{
  padding-top: 1.72rem;
  img{
    width: 6.13333rem;
  }
  p{
    color: #999;
    padding-top: 0;
  }
}
.swiper-pagination{
    width: 0.8rem;
    height: 0.45333rem;
    line-height: 0.45333rem;
    position: absolute;
    bottom: 0.4rem;
    left: auto;
    right: 0.4rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.26);
    border-radius: 0.22667rem;
}
</style>
