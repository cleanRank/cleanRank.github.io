<template>
  <div class="new-floor">
    <!-- new title start -->
    <OneBanner v-if="productFloor.image" :productFloor="productFloor"></OneBanner>
    <!-- new title end -->
    <!-- new content start -->
    <div class="new_layout_box13" :style="{backgroundImage: 'url('+ productFloor.bgImage +')'}">
      <div class="new-floor-layout new-floor-layout13" >
        <template v-for="(item, index) in productFloor.subFloor">
          <div class="new-index-template-two-four" :key="item.layoutType">
            <template v-for="(_item, idx) in item.prudouct">
              <a class="new-index-template-item" href="javascript:;"  @click="bannerDetail(_item)" :key="_item.id"><img :src="_item.picture"></a>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- new content end -->
  </div>
</template>

<script>
  import OneBanner from 'components/common/banner/OneBanner'
  export default {
    name: "NewModelThirteen",
    props: {
      productFloor: {
        required: true,
        type: Object
      }
    },
    components: {
      OneBanner
    },
    methods: {
      bannerDetail (val) {
        if (val.urlContent) {
          if (val.urlType == "PRODUCT") {
            val.urlContent = `#/detail?productNo=${val.productNo}`
          }
          window.location.href= val.urlContent
        }
      }
    }
  }
</script>
