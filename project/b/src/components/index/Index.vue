<template>
  <section>
    <!-- 首页专用的header s-->
    <SxypHeader :indexHotWord="indexHotWord"></SxypHeader>
    <!-- 品类 start -->
    <div class="new-category">
      <div class="new-category-list-showAll" v-if="noShowAll">
        <p>全部分类</p>
        <div class="new-category-list-change new-category-rotate" @click="newCategoryChange(1)"></div>
      </div>
      <div class="new-category-list-wrap" :class="{'new-category-showAll': noShowAll}">
        <div v-for="(item, idex) in topCategoryData" class="new-category-item " :class="{'new-category-item-after': OutCutIndex === idex}" @click="cutContent(idex, item.versionId, $event)" :key="idex">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="new-category-list-change" @click.self="newCategoryChange" v-if="!noShowAll"></div>
      <div class="new-category-list-pop" v-if="noShowAll" @click="newCategoryChange(1)"></div>
    </div>
    <!-- 品类 end -->
    <!-- 楼层组件 start -->
    <floorComponent v-if="versionId" :versionIdIndex="versionId"></floorComponent>
    <!-- 楼层组件 end -->
    <!--回到顶部s-->
    <section class="top_go" @click="goTop()" v-show="goTopIconFlag">
      <img src="../../assets/icon/icon/fanhui.png" class="" width="80%" height="80%">
    </section>
    <!--回到顶部e-->
    <!-- 启动广告 start -->
    <StartAdvertising
      v-if="advertisingFlag"
      @closeAdvertising="closeAdvertising"
    ></StartAdvertising>
    <!-- 启动广告 end -->
  </section>
</template>
<script>
  import SxypHeader from 'components/common/SxypHeader'
  import StartAdvertising from './StartAdvertising'
  import floorComponent from 'components/activity/Index'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        topCategoryData: [],
        OutCutIndex: 0,
        goTopIconFlag: false,
        noShowAll: false, // 控制首页分类显示状态
        versionId: '',
        indexHotWord: '',
        advertisingFlag: false
      }
    },
    computed: {
      ...mapGetters({
        cutIndexInfo: "getCutIndexInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateCutIndexInfo"
      ]),
      // 回到顶部
      goTop () {
        document.body.scrollTop = document.documentElement.scrollTop = 0
        this.$set(this.$data, 'goTopIconFlag', false)
      },
      // 滚动条事件
      scrollfunction () {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        this.$set(this.$data, 'goTopIconFlag', scrollTop > 1600)
      },
      getData (data) {
        this.topCategoryData = data
        this.$set(this.$data, 'topCategoryData', this.topCategoryData)
      },
      cutContent (cutIndex, versionId, e) {
        this.$forceUpdate()
        this.OutCutIndex = cutIndex
        this.versionId = versionId
        this.newCategoryChange(1)
        try {
          setTimeout(() => {
            document.querySelectorAll('.new-category-item')[cutIndex].scrollIntoView({block: "start"})
          }, 100)
        } catch (e) {
          console.log(e)
        }
      },
      getStartAdvertisingStatus () {
        // 判断是否首次加载
        let start_ad_flag = window.sessionStorage.getItem('start_ad_flag')
        if (start_ad_flag != 'yes') {
          // 首次加载-显示广告弹窗
          this.advertisingFlag = true
          window.sessionStorage.setItem('start_ad_flag', 'yes')
        }
      },
      // 关闭首页启动广告弹窗
      closeAdvertising () {
        this.advertisingFlag = false
      },
      newCategoryChange (type) {
        if (type == '1') {
          this.noShowAll = false
          document.querySelector('html').style.overflow = 'visible'
          document.querySelector('body').style.overflow = 'visible'
        } else {
          this.noShowAll = true
          document.querySelector('html').style.overflow = 'hidden'
          document.querySelector('body').style.overflow = 'hidden'
        }
      },
      /* 获取品类 start */
      getCategoryData () {
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.MiniHome,
          data: {}
        }).then(({data: res}) => {
          if (!res) {
            this.$router.push('/brokennet')
          }
          if (res.status == '1') {
            this.topCategoryData = res.data
            this.versionId = res.data[0].versionId
            if (res.hotWord) {
              this.indexHotWord = res.hotWord
            } else {
              this.indexHotWord = "请输入关键字搜索"
            }
            this.showLoad(false)
          }
        })
      }
      /* 获取品类 end */
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.scrollfunction, false)
      document.querySelector('html').style.overflow = 'visible'
      document.querySelector('body').style.overflow = 'visible'
      document.querySelector('html').style.background = '#F4F4F4'
      document.querySelector('body').style.background = '#F4F4F4'
      this.updateCutIndexInfo({
        cacheData: '',
        cacheDataIndex: '',
        cacheDataIActive: '',
        startIndexTimes: ''
      })
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      window.sessionStorage.setItem('scrollTop', scrollTop)
      next()
    },
    components: {
      SxypHeader,
      StartAdvertising,
      floorComponent
    },
    created () {
      this.getCategoryData()
    },
    mounted () {
       // 清空电影票标识
      window.sessionStorage.removeItem('isgomovie')
      this.$nextTick(() => {
        // 查询首页弹窗广告
        this.getStartAdvertisingStatus()
        // 设置延迟，方式history.go(-1)的时候会自动触发滚动条事件
        setTimeout(() => {
          window.addEventListener('scroll', this.scrollfunction, false)
        }, 300)
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/app";
  .position_navbar2{
    @include px2rem(top, 76);
    // top: 1.30667rem;
  }
</style>
