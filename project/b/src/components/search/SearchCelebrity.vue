<template>
  <section class="SearchCelebrity">
    <p class="SearchCelebrityTit c_999">相关网红</p>
    <ul class="SearchCelebrityList">
      <router-link
        tag="li"
        :to="{path:'/celebrity', query: {starNo: item.starNo}}"
        class="celebrityItem"
        v-for="(item, index) in celebrity"
        :key="index"
      >
        <div class="celebrityPhotoWrap">
          <img class="celebrityPhoto" :src="item.img" alt="">
        </div>
        <p class="celebrityName">{{item.nickName}}</p>
      </router-link>
    </ul>
    <div class="SearchCelebrityLine"></div>
  </section>
</template>

<script>
export default {
  name: 'SearchCelebrity',
  props: {
    celebrity: {
      required: true,
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.SearchCelebrity{
  background: #fff;
  border-top: 1px solid #F0F0F0;
}
.SearchCelebrityTit{
  @include px2rem(line-height, 28);
  @include font-dpr(20);
  @include px2rem(margin-top, 32);
  @include px2rem(margin-bottom, 20);
  @include px2rem(padding, 0 24);
}
.SearchCelebrityList{
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling:touch;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  -webkit-transform: translateZ(0px);
  position: static;
  @include px2rem(padding, 0 24);
  @include px2rem(padding-bottom, 24);
  font-size: 0;
  .celebrityItem{
    display: inline-block;
    @include px2rem(margin-right, 66);
    text-align: center;
    @include px2rem(width, 118);
  }
  .celebrityPhotoWrap{
    @include px2rem(width, 100);
    @include px2rem(height, 100);
    overflow: hidden;
    border-radius: 50%;
    background: #F5F5F5;
    margin: 0 auto;
  }
  .celebrityPhoto{
    width: 100%;
    height: 100%;
    display: block;
  }
  .celebrityName{
    color: $color333;
    @include font-dpr(24);
    text-align: center;
    @include px2rem(width, 118);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    @include px2rem(padding-top, 8);
  }
}
.SearchCelebrityLine {
  @include px2rem(height,20);
  background: #F5F5F5;
}
</style>

