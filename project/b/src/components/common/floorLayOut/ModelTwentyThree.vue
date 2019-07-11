<template>
<section>
  <div class="flex">
      <div v-if="productFloor.banner.length==2">
        <div class="twoImg" v-for="(item, index) in productFloor.banner" :key="index">
            <div>
                <img src="item.picUrl" alt="">
            </div>
        </div>
      </div>
      <div v-if="productFloor.banner.length==3">
        <div class="threeImg" v-for="(item, index) in productFloor.banner" :key="index">
            <div>
                <img src="item.picUrl" alt="">
            </div>
        </div>
      </div>
      <div v-if="productFloor.banner.length==4">
        <div class="fourImg" v-for="(item, index) in productFloor.banner" :key="index">
            <div>
                <img src="item.picUrl" alt="">
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
    }
  },
  props: {
    productFloor: {
      required: true,
      type: Object
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/app";
.twoImg,.threeImg,.fourImg{
    width:100%;
    @include px2rem(margin-bottom, 20);
    @include px2rem(padding, 0 24);
    overflow: hidden;
    div{
        float: left;
    }
    img{
      display: block;
      width:100%    
    }
}
.twoImg{
    div{
      @include px2rem(width, 344); 
      @include px2rem(height, 258);  
      @include px2rem(margin-right, 14);  
    }
    div:last-child{
       @include px2rem(margin-right, 0); 
    }
}
.threeImg{
    div{
      @include px2rem(width, 226); 
      @include px2rem(height, 170);
      @include px2rem(margin-right, 12);
    }
    div:last-child{
       @include px2rem(margin-right, 0); 
    }
}
.fourImg{
    @include px2rem(margin-bottom, 0);
    div{
      @include px2rem(width, 168); 
      @include px2rem(height, 126); 
      @include px2rem(margin-right, 10);
    }
    div:last-child{
       @include px2rem(margin-right, 0); 
    }
}
</style>
