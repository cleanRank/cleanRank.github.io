<template lang="html">
  <load-more
    :bottom-method="loadBottom"
    :bottom-all-loaded="allLoaded"
    :auto-fill="false"
    ref="loadmore">
    <ul class="commodity-list">
      <li class="clearfix commodity-item"
          v-if="list.length > 0"
          v-for="(value, index) in list"
          :key="index">
        <div class="list-img-box">
          <img v-if="value.itemPicPath" :src="value.itemPicPath" alt="">
          <img v-else :src="imgObj.img" alt="">
        </div>
        <div class="commodity-list-describe">
          <p class="list-code">
            <span class="list-time-describe">供货商品</span>
          </p>
          <p class="list-headline">
            <span class="list-title">{{value.itemName}}</span>
          </p>
          <p class="list-price">
            <span class="list-label">协议价</span>&nbsp;&nbsp;
            <span v-if="!value.change" class="list-unit-price">¥{{value.purchasePrice}}</span>
            <input
              v-if="value.change"
              v-model="value.purchasePrice"
              autofocus="autofocus"
              class="list-unit-input">
          </p>
          <div class="list-reset">
            <div v-if="!value.change"
              class="list-reset-modification"
              @click="modification(value, index)">
              修改
            </div>
            <div v-if="!value.change" @click="deleteFile(value, index)" class="list-reset-delete">
              删除
            </div>
            <div v-if="value.change"
              @click="nomodification(value, index)"
              class="list-reset-affirm">
              确定
            </div>
          </div>
        </div>
      </li>
    </ul>
  </load-more>
</template>

<script>
import loadMore from 'components/common/LoadMore'
export default {
  data () {
    return {
      list: [],
      ajaxObj: {
        page: 1
      },
      imgObj: {
        img: require('../../../assets/icon/icon/logo@2x.png')
      },
      allLoaded: false
    }
  },
  mounted () {
    window.sessionStorage.removeItem("commodityItem")
  },
  components: {
    loadMore
  },
  created () {
    this.getcommodityList()
  },
  methods: {
    loadBottom () {
      this.getcommodityList()
    },
    getcommodityList () {
      this.$http.applySelect({
        page: this.ajaxObj.page++,
        param: {
          itemType: 2
        },
        size: 10
      }).then(res => {
        if (res.result) {
          res.result.datas.forEach(v => {
            v.change = false
            v.itemPicPath = v.itemPicPaths[0] || this.imgObj.img
          })
          this.$refs.loadmore.onBottomLoaded()
          this.list = this.list.concat(res.result.datas)
          this.$emit('change-list', this.list)
          if (res.result.datas.length < 10) {
            this.allLoaded = true
          }
        } else {
          this.allLoaded = true
        }
      }).catch(e => {
        this.allLoaded = true
      })
    },
    modification (item, index) { // 修改
      window.sessionStorage.setItem('commodityItem', JSON.stringify(item))
      this.$router.push({
        path: '/add'
      })
      // item.change = !item.change
      // this.list.splice(index, 1, item)
    },
    nomodification (item, index) {
      item.change = !item.change
      this.list.splice(index, 1, item)
      this.$emit('change-list', this.list)
    },
    deleteFile (item, index) { // 删除商品
      this.$http.applyRemove({
        applyDtlId: item.applyDtlId
      }).then(res => {
        this.list.splice(index, 1)
        this.$emit('change-list', this.list)
      }).catch(e => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/informationIndex.scss";
</style>
