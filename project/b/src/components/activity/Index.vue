<template>
  <section v-if="isLoding">
    <div class="floor-list" :class="[isClass]">
      <div class="floor" v-for="(floor, index) in floorData.listFloor" :key="'Model' + index" :floor="floor.floorType">
        <ModelOne v-if="floor.floorType == 1" :floor="floor"></ModelOne>
        <ModelTwo v-if="floor.floorType == 2 && floor.listFloorDetail.length>0" :floor="floor"></ModelTwo>
        <ModelThree v-if="floor.floorType == 3 && floor.listFloorDetail[0].prudouct && floor.listFloorDetail[0].prudouct.length>0" :floor="floor"></ModelThree>
        <ModelFour v-if="floor.floorType == 4" :floor="floor"></ModelFour>
        <ModelFive v-if="floor.floorType == 5" :floor="floor"></ModelFive>
        <ModelSix v-if="floor.floorType == 6 && floor.activityInfos.length>0" :floor="floor"></ModelSix>
        <ModelSeven v-if="floor.floorType == 7 && floor.listFloorDetail[0].prudouct.length>0" :floor="floor"></ModelSeven>
        <ModelNine v-if="floor.floorType == 9 && floor.activityInfos.length>0" :floor="floor"></ModelNine>
        <ModelTen v-if="floor.floorType == 10 && floor.listFloorDetail.length>0" :floor="floor"></ModelTen>
        <ModelEleven v-if="floor.floorType == 11 && floor.listFloorDetail.length >0" :floor="floor"></ModelEleven>
        <ModelTwelve v-if="floor.floorType == 12 && floor.listFloorDetail.article.length>0" :floor="floor.listFloorDetail"></ModelTwelve>
        <ModelThirteen v-if="floor.floorType == 13" :floor="floor"></ModelThirteen>
        <ModelFourteen v-if="floor.floorType == 14" :floor="floor"></ModelFourteen>
        <ModelFifteen :ref="'fifteen'+floor.floorId" v-if="floor.floorType == 15" :floor="floor" :videoList="videoList"></ModelFifteen>
        <ModelSixteen v-if="floor.floorType == 16" :floor="floor"></ModelSixteen>
        <ModelSeventeen v-if="floor.floorType == 17" :floor="floor"></ModelSeventeen>
      </div>
    </div>
    <!-- 分享 -->
    <div class="share-btn" @click="share" v-if="this.shareWord && this.shareImg && this.bShare && $store.state.route.name != 'Index' && $store.state.config.fromChannel == 'sxypApp'">快来分享好货了</div>
    <go-top v-if="!versionIdIndex"></go-top>
  </section>
</template>

<script>
  import ModelOne from 'components/common/floorLayOutNew/ModelOne' // 1-图片-热区
  import ModelTwo from 'components/common/floorLayOutNew/ModelTwo' // 2-图片轮播
  import ModelThree from 'components/common/floorLayOutNew/ModelThree' // 3-商品单列
  import ModelFour from 'components/common/floorLayOutNew/ModelFour' // 4-商品双列
  import ModelFive from 'components/common/floorLayOutNew/ModelFive' // 5-品牌管理
  import ModelSix from 'components/common/floorLayOutNew/ModelSix' // 6-秒杀（商品单列）
  import ModelSeven from 'components/common/floorLayOutNew/ModelSeven' // 7-图片单列
  import ModelNine from 'components/common/floorLayOutNew/ModelNine' // 9-秒杀图片单列
  import ModelTen from 'components/common/floorLayOutNew/ModelTen' // 10-图片平分
  import ModelEleven from 'components/common/floorLayOutNew/ModelEleven' // 11-优惠券
  import ModelTwelve from 'components/common/floorLayOutNew/ModelTwelve' // 12-内容版式
  import ModelThirteen from 'components/common/floorLayOutNew/ModelThirteen' // 13-商品三列
  import ModelFourteen from 'components/common/floorLayOutNew/ModelFourteen' // 14-商品轮播
  import ModelFifteen from 'components/common/floorLayOutNew/ModelFifteen' // 14-视频版式
  import ModelSixteen from 'components/common/floorLayOutNew/ModelSixteen' // 16-营销
  import ModelSeventeen from 'components/common/floorLayOutNew/ModelSeventeen' // 17-横切
  import GoTop from './GoTop'
  import { mapGetters, mapActions } from 'vuex'
  import { UPDATE_SHARE_INFO } from 'store/mutation-types'
  export default {
    data () {
      return {
        isLoding: false,
        versionName: '',
        shareWord: '',
        shareImg: '',
        floorData: {},
        isCache: false,
        cacheData: [],  // 取首页切换所有缓存数据
        cacheList: [],  // 取首页当前切换缓存数据
        isPreview: false,
        bShare: true,
        firstFloorType: null,
        videoList: []
      }
    },
    computed: {
      ...mapGetters({
        cutIndexInfo: "getCutIndexInfo"
      }),
      isClass () {
        if (this.$store.state.route.name == 'Index') {
          return 'mg172'
        } else {
          if (this.$store.state.config.fromChannel == 'sxypApp' && this.bShare) {
            return 'pb98'
          } else if (this.firstFloorType == 2) {
            return 'mg20'
          } else {
            return ''
          }
        }
      }
    },
    props: {
      versionIdIndex: {
        type: String
      }
    },
    components: {
      ModelOne,
      ModelTwo,
      ModelThree,
      ModelFour,
      ModelFive,
      ModelSix,
      ModelSeven,
      ModelNine,
      ModelTen,
      ModelEleven,
      ModelThirteen,
      ModelFourteen,
      ModelTwelve,
      ModelFifteen,
      ModelSixteen,
      ModelSeventeen,
      GoTop
    },
    beforeRouteLeave (to, from, next) {
      if (to.name == 'Detail') {
        let scrollTopArr = JSON.parse(window.sessionStorage.getItem('scrollTopArr') || "[]")
        let obj = {
          versionId: from.params.versionId,
          scrollTop: document.body.scrollTop || document.documentElement.scrollTop
        }
        if (scrollTopArr.length>0) {
          scrollTopArr.forEach((item) => {
            if ([item.versionId].indexOf(obj.versionId)!=-1) {
              item.scrollTop = obj.scrollTop
            } else {
              scrollTopArr.push(obj)
            }
          })
          let hash = {}
          scrollTopArr = scrollTopArr.reduce((preVal, curVal) => {
            hash[curVal.versionId] ? '' : hash[curVal.versionId] = true && preVal.push(curVal)
            return preVal
          }, [])
        } else {
          let obj = {
            versionId: from.params.versionId,
            scrollTop: document.body.scrollTop || document.documentElement.scrollTop
          }
          scrollTopArr.push(obj)
        }
        window.sessionStorage.setItem('scrollTopArr', JSON.stringify(scrollTopArr))
      } else {
        window.sessionStorage.removeItem('scrollTopArr')
      }
      next()
    },
    beforeRouteUpdate (to, from, next) {
      this.showLoad(true)
      let { versionId } = to.params
      this.isPreview = to.query.yulan && to.query.yulan!='' || false
      this.versionId = versionId
      this.firstFloorType = null
      let scrollTopArr = JSON.parse(window.sessionStorage.getItem('scrollTopArr') || '[]')
      let scrollTop = 0
      let obj = {
        versionId: from.params.versionId,
        scrollTop: document.body.scrollTop || document.documentElement.scrollTop
      }
      if (scrollTopArr.length>0) {
        scrollTopArr.forEach((item) => {
          if ([item.versionId].indexOf(this.versionId)!=-1) {
            scrollTop = item.scrollTop
          } else {
            scrollTopArr.push(obj)
          }
          if ([item.versionId].indexOf(from.params.versionId)!=-1) {
            item.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          }
        })
        let hash = {}
        scrollTopArr = scrollTopArr.reduce((preVal, curVal) => {
          hash[curVal.versionId] ? '' : hash[curVal.versionId] = true && preVal.push(curVal)
          return preVal
        }, [])
      } else {
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
        let obj = {
          versionId: from.params.versionId,
          scrollTop
        }
        scrollTopArr.push(obj)
        scrollTop = 0
      }
      window.sessionStorage.setItem('scrollTopArr', JSON.stringify(scrollTopArr))
      this.getFloorData().then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, 1)
          window.scrollTo(0, scrollTop)
        })
        let videoList = []
        if (this.floorData.listFloor.length>0) {
          this.floorData.listFloor.forEach((item, index) => {
            if (index == 0 && item.floorType == 2 && item.listFloorDetail.length>0) {
              this.firstFloorType = 2
            }
            if (item.floorType == '12') {
              this.bShare = false
            }
            if (item.floorType == '15') {
              videoList.push(item)
            }
          })
          this.videoList = videoList
        }
        if (this.shareWord && this.shareImg && this.bShare) {
          this.$root.$emit('showShareBtn', true)
        }
        this.$root.$emit('setTitle', this.versionName)
          // 更新分享信息
        let url = window.location.origin + window.location.pathname + "#/activity/" + versionId + "?share=1&fromChannel=sxyph5"
        this.$store.commit(UPDATE_SHARE_INFO, {
          showFlag: true,
          title: this.shareWord,
          desc: '美好生活，优品一下',
          link: url,
          imgUrl: this.shareImg || ''
        })
      })
      next()
    },
    created () {
      let {versionId} = this.$route.params
      this.versionId = versionId
      this.isPreview = this.$route.query.yulan && this.$route.query.yulan!='' || false
      this.getFloorData().then(() => {
        setTimeout(() => {
          let scrollTopArr = JSON.parse(window.sessionStorage.getItem('scrollTopArr') || '[]')
          let scrollTop = 0
          for (let i = 0; i<scrollTopArr.length; i++) {
            if (scrollTopArr[i].versionId == this.versionId) {
              scrollTop = scrollTopArr[i].scrollTop
            }
          }
          if (scrollTopArr.length>0) {
            window.scrollTo(0, 1)
            window.scrollTo(0, scrollTop)
          } else {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
          }
        }, 1200)
        if (this.floorData.listFloor.length>0) {
          var videoList = []
          this.floorData.listFloor.forEach((item, index) => {
            if (index == 0 && item.floorType == 2 && item.listFloorDetail.length>0) {
              this.firstFloorType = 2
            }
            if (item.floorType == '12') {
              this.bShare = false
            }
            if (item.floorType == '15') {
              videoList.push(item)
            }
          })
          this.videoList = videoList
        }
        if (this.shareWord && this.shareImg && this.bShare) {
          this.$root.$emit('showShareBtn', true)
        }
        this.$root.$emit('setTitle', this.versionName)
          // 更新分享信息
        let url = window.location.origin + window.location.pathname + "#/activity/" + versionId + "?share=1&fromChannel=sxyph5"
        this.$store.commit(UPDATE_SHARE_INFO, {
          showFlag: true,
          title: this.shareWord,
          desc: '美好生活，优品一下',
          link: url,
          imgUrl: this.shareImg || ''
        })
      })
    },
    watch: {
      "versionIdIndex": {
        handler (val, oldVal) {
          if (val && val != oldVal) {
            this.$set(this.$data, 'isCache', false)
            this.cacheList = []
            this.$forceUpdate()
            this.getFloorData()
            this.$nextTick(() => {
              window.scrollTo(0, 1)
              window.scrollTo(0, 0)
            })
          }
        }
      }
    },
    methods: {
      ...mapActions([
        "updateCutIndexInfo"
      ]),
      /* 获取楼层 start */
      getFloorData () {
        this.floorData = {}
        this.cacheList = []
        this.showLoad(true)
        if (this.cutIndexInfo.cacheData) {
          // 获取除第一次点击之外的点击时间
          let tapTime = new Date().getTime()
          this.cutIndexInfo.cacheData.forEach((obj) => {
            if (obj.versionId == this.versionIdIndex && (tapTime - obj.startTapTime) < 180000) {
              this.$set(this.$data, 'cacheList', JSON.parse(JSON.stringify(obj)))
              this.$set(this.$data, 'isCache', true)
              return
            }
          })
        }
        if (this.isCache) {
          // 使用缓存数据
          this.floorData = this.cacheList
          this.versionName = this.cacheList.versionName
          this.shareWord = this.cacheList.shareWord
          this.shareImg = this.cacheList.shareImg
          setTimeout(() => {
            this.isLoding = true
            this.showLoad(false)
          }, 800)
          return false
        }
        let { uid, token } = this.$store.state.userInfo
        let yulan = this.isPreview ? 2:''
        return this.$post({
          url: this.$store.state.api.MiniActiveTemplate,
          data: {
            versionId: this.versionIdIndex || this.versionId,
            uid,
            token,
            yulan
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == '1') {
            var videoList = []
            for (let i = 0; i<res.data.listFloor.length; i++) {
              res.data.listFloor[i].rebateStatus = res.data.rebateStatus
              if (res.data.listFloor[i].floorType == '15') {
                videoList.push(res.data.listFloor[i])
              }
            }
            this.videoList = videoList
            this.floorData = res.data
            this.versionName = res.data.versionName
            this.shareWord = res.data.shareWord
            this.shareImg = res.data.shareImg
            if (this.versionIdIndex) {
              let startTapTime = new Date().getTime()
              // 记录第一次点击时间
              res.data.startTapTime = startTapTime
              if (this.cutIndexInfo.cacheData) {
                this.cutIndexInfo.cacheData.forEach((obj, index) => {
                  if (obj.versionId == this.versionIdIndex) {
                    this.cacheData.splice(index)
                    return
                  }
                })
              }
              this.cacheData.push(res.data)
              this.updateCutIndexInfo({cacheData: this.cacheData})
            }
          } else {
            this.floorData = {}
            this.showToast({msg: res.statusDetail})
          }
          setTimeout(() => {
            this.isLoding = true
            this.showLoad(false)
          }, 1000)
        })
      },
      /* 获取楼层 end */
      share () {
        this.$root.$refs.header.shareUrl()
      }
    }
  }
</script>
