<template>
<section>
  <div class="flex hy_wrap_box">
      <div class="list" v-for="(item,index) in floor.article" :key="index">
          <div class="floorBan">
              <img :src="item.titleImg" class="content-cover" alt="">
          </div>
          <div class="floorCon">
              <p class="floorTit"> {{item.title}} </p>
              <p class="floorSubTit hideWord" ref="toggle">
                   {{item.summary}}
              </p>
              <p class="showMore" v-show="item.summary.length>100" ref="txt" @click="showMore(index)">全部展开</p>
              <div class="floorBom">
                  <div class="floorInfo">
                      <span>作者：{{item.author}}</span>
                      <span>{{item.updateTime | timeFormat(1) }}</span>
                  </div>
                  <div class="toDetail" @click="toDetail(item.id)">开始学习</div>
              </div>
          </div>
      </div>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      ifMore: false,
      list: []
    }
  },
  props: {
    floor: {
      required: true,
      type: Object
    }
  },
  methods: {
    showMore (index) {
      let that = this
      if (that.$refs.txt[index].innerHTML=='全部展开') {
        that.$refs.txt[index].innerHTML='收起'
        that.$refs.toggle[index].classList.remove('hideWord')
        that.$refs.toggle[index].classList.add('showWord')
      } else {
        that.$refs.txt[index].innerHTML='全部展开'
        that.$refs.toggle[index].classList.remove('showWord')
        that.$refs.toggle[index].classList.add('hideWord')
      }
    },
    toDetail (number) {
      this.$router.push({
        path: '/announceDetail',
        query: {
          origin: 'floor',
          isAc: true,
          contentId: number,
          fromChannel: 'sxyph5'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/app";
.list{
    @include px2rem(margin, 0 24 20);
    @include px2rem(padding, 0 0 24);
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    @include px2rem(border-radius, 12);
    .floorCon{
      @include px2rem(padding, 0 24);
    }
    .floorBan{
      @include px2rem(width, 702);
      @include px2rem(height, 240);
      @include px2rem(margin-bottom, 24);
      overflow: hidden;
      img{
          display:block;
          width:100%
      }
      .content-cover{
        @include px2rem(width, 702);
        @include px2rem(height, 240);
      }
    }
    .floorTit{
      @include font-dpr(28);
      color:#333;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @include px2rem(margin-bottom, 10);
    }
    .floorSubTit{
      @include font-dpr(24);
      color:#999;
      text-align: justify;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      @include px2rem(margin-bottom, 10);
    }
    .hideWord{
        -webkit-line-clamp:3;
    }
    .showWord{
      -webkit-line-clamp:0;
    }
    .showMore{
      color:#444;
      @include font-dpr(24);
      text-align: right;
      @include px2rem(margin-bottom, 24);
    }
    .floorBom{
        overflow: hidden;
        @include px2rem(line-height, 52);
        .floorInfo{
            float: left;
            @include font-dpr(22);
            color:#999;
        }
        .toDetail{
            float:right;
            @include px2rem(width, 160);
            @include px2rem(height, 52);
            border: 1px solid #FD455F;
            text-align: center;
            @include px2rem(line-height, 52);
            @include px2rem(border-radius, 52);
            color:#FD455F;
        }
    }
}
</style>
