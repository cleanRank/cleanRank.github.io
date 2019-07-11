<template>
  <section class="my-collection">
     <!-- 收藏列表 s-->
      <section class="my-collect-wrap">
        <!-- 收藏商品列表 s -->
        <Collect-List :goodsList="goodsList" @checkIsFollow="checkGoodsListIsFollow"></Collect-List>
        <!-- 收藏商品列表 e -->
      </section>
     <!-- 数据列表 e-->

     <!-- 失效的收藏列表 s-->
      <section class="my-collect-wrap invalid" v-if="timeOutList.length">
        <section class="invalid-tips clearfix">
          <span class="left-text fl">失效宝贝{{timeOutList.length}}件</span>
          <span class="right-btn fr" @click="confirmClear">清空失效宝贝</span>
        </section>
        <!-- 收藏商品列表 s -->
        <Collect-List :goodsList="timeOutList" @checkIsFollow="checkTimeOutIsFollow"></Collect-List>
        <!-- 失效的收藏列表 e -->
      </section>
     <!-- 数据列表 e-->
      <!-- 数据为空 s-->
        <div v-if="(!goodsList.length && !timeOutList.length) && !isLoadHttpRequest" class="nodata_order">
          <img src="../../assets/icon/icon/blank_sc_icon.png">
          <p>亲您还没有收藏的商品哦～</p>
          <router-link tag="button" class="go-shop-btn" to="/">去逛逛</router-link>
        </div>
      <!-- 数据为空 e-->
  </section>
</template>
<script>
import CollectList from './Collect-List'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      goodsList: [],
      timeOutList: [],
      isLoadHttpRequest: true  // true: 正在加载数据, false： 加载完成数据
    }
  },
  methods: {
    ...mapActions([
      "delMyCollection",
      "addMyCollection"
    ]),
    // 确定清楚我的收藏
    confirmClear () {
      let _t = this
      this.showDialog({
        title: "清空失效宝贝",
        msg: '确定要清空失效宝贝？',
        lBtnText: '取消',
        rBtnText: '确定',
        confCallBack () {
          _t.clearAllCollect()
        }
      })
    },
    // 清空失效宝贝
    clearAllCollect () {
      // 过滤出来所有失效的productNo，并且拼接成字符串
      const proNoList = this.timeOutList.reduce((proNoList, _item) => {
        return `${proNoList}${!proNoList? '': ','}${_item.productNo}`
      }, '')
      // proNoList为空字符串代表失效的商品都手动取消关注了
      if (!proNoList) {
        this.timeOutList = []
        return false
      }
      // 如果失效宝贝列表中的商品都已经取消关注直接 return
      this.showLoad(true)
      this.delMyCollection(proNoList)
      .then(({data: res}) => {
        this.showLoad(false)
        if (res.status == 1) {
          this.timeOutList = []
        } else {
          this.showToast({
            msg: res['statusDetail']
          })
        }
      })
    },
    // 取消或者关注该商品
    checkIsFollow ({key, _item}, list) {
      // 设置为false为选中状态， true为未选中状态
      const isCheck = !!list[key]['isCheck']
      this.showLoad(true)
      if (!isCheck) {
        // 取消关注
        this.delMyCollection(_item.productNo)
        .then(({data: res}) => {
          this.showLoad(false)
          if (res.status == 1) {
            this.showToast({
              msg: '取消收藏'
            })
             // 取消关注成功
            this.spliceOriginArr(list, key)
          } else {
            this.showToast({
              msg: res.statusDetail
            })
          }
        })
      } else {
        this.showLoad(false)
        this.addMyCollection(_item.productNo)
        .then(({data: res}) => {
          if (res.status == 1) {
            this.showToast({
              msg: '收藏成功'
            })
             // 取消关注成功
            this.spliceOriginArr(list, key)
          } else {
            this.showToast({
              msg: res.statusDetail
            })
          }
        })
      }
    },
    // 取消关注以后，修改原数组
    spliceOriginArr (list, key) {
      // 取消关注成功
      list[key]['isCheck'] = !list[key]['isCheck']
      list.splice(key, 1, list[key])
    },
    // 检查失效的宝贝列表
    checkTimeOutIsFollow (obj) {
      this.checkIsFollow(obj, this.timeOutList)
    },
    checkGoodsListIsFollow (obj) {
      this.checkIsFollow(obj, this.goodsList)
    }
  },
  components: {
    "Collect-List": CollectList
  },
  created () {
    this.showLoad(true)
    const { token, uid } = this.$store.state.userInfo
    // 拉取我的收藏列表
    this.$post({
      url: this.$store.state.api.QueryMyCollection,
      data: {
        token,
        uid
      }
    }).then(({data: res}) => {
      this.showLoad(false)
      this.isLoadHttpRequest = false
      if (res.status == 1) {
        // 未失效收藏列表
        this.goodsList = res.data.enableList || []
        // 失效收藏列表
        this.timeOutList = res.data.unableList || []
      } else {
        this.showToast({
          msg: res.statusDetail
        })
      }
    })
  }
}
</script>

<style lang="scss">
  @import "../../assets/scss/app";
  .my-collection{
    position: relative;
     .invalid{
       .goods-title, .goods-tag{
         color: #DADADA;
       }
     }
  }
</style>
