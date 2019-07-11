<template>
<section>
  <div class="flex hy_wrap_box">
    <div class="cell_1 hy_item" :class="{'curvisit':cutIndex == i}" v-for="(item, i) in productFloor.childFloors" @click="tabConent(item, i)">
      <img :src="item.picUrl" class="lazy"  :title="item.name"  :alt="item.name" width="100%" lazy="loading"/>
    </div>
  </div>
  <!-- 楼层 -->
  <div class="tabfloor_wrap_box">
    <ModelTwo v-if="curItem.layoutType == 2 && curItem.prudouct.length > 0" :productFloor="curItem" ></ModelTwo>
    <ModelSeven v-if="curItem.layoutType == 7" :productFloor="curItem"></ModelSeven>
    <Banner v-if="curItem.layoutType == 12 && curItem.banner.length > 0" :bannerhome="curItem.banner"></Banner>
  </div>
</section>
</template>
<script>
import ModelTwo from './ModelTwo'
import ModelSeven from './ModelSeven'
import Banner from 'components/otherIndex/Banner'
export default {
  data () {
    return {
      cutIndex: 0
    }
  },
  props: {
    productFloor: {
      required: true,
      type: Object
    }
  },
  computed: {
    curItem () {
      const item = this.productFloor.childFloors[this.cutIndex]
      if (item.layoutType == 2) {
        // 添加标识，区分是否显示背景色
        item.isbgColor = '1'
      }
      // 添加标识来源，区别组件样式
      return {...item, sourcePage: 'index'}
    }
  },
  components: {
    ModelTwo,
    ModelSeven,
    Banner
  },
  methods: {
    tabConent (item, i) {
      this.cutIndex = i
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
@import "../../../assets/scss/app";
.hy_wrap_box{
  border-bottom: 1px solid #e0e0e0;
  @include px2rem(margin-bottom, 30);
}
.hy_item{
  img{
    width: 100%;
    height: 100%;
  }
}
.curvisit{
  position: relative;
  &:before{
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    @include px2rem(width, 42);
    @include px2rem(height, 22);
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
    background: url(../../../assets/icon/oindex/Triangle3x.jpg) no-repeat center/contain;
  }
}
</style>
