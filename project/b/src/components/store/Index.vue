<template>
  <section>
    <div class="store">
      <div class="fixedContainer">
        <div class="celebrityInfoWrap flex" :style="{backgroundImage: (store.banner? 'url('+store.banner+')':'linear-gradient(-135deg, #3FFFF1 0%, #6D64FF 100%)')}">
        <div class="celebrityHeadImgWrap">
          <img
            class="celebrityHeadImg"
            :src="store.img"
            alt
          >
        </div>
        <div class="celebrityInfo">
          <p class="celebrityName">{{store.name}}</p>
          <p class="celebritySignature">{{store.explanation}}</p>
        </div>
        <div class="concernStatusWrap">
          <div class="concernStatus" @click="followedMethod">
                <span :class="store.followersStatus == '1'?'c_999':''">{{store.followersStatus == '1'?'已关注':'关注'}}</span>
            </div>
          </div>
        </div>
        <ul class="sotreGoodsSort flex" v-if="isShowSort">
          <li
            v-for="(item, index) in sortList"
            :key="index"
            :class="[{'active':index == sortIndex},{'sort':item.type.length>1}]"
            class="goodsSortItem cell_1"
            @click="productsSort(index,item.type)"
          >
            <span class="goodsSortTxt" :class="sortFlag == '0'? 'activeBefore':'activeAfter'">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="sotreGoodsList" v-if="storeProducts.length">
        <template v-for="(item, index) in storeProducts">
          <div class="sotreGoodWrap" :key="index" @click="goodDetail(item)">
            <div class="sotreGoodWrapImgCon">
              <img
                class="sotreGoodWrapImg lazy"
                v-lazy="item.mainImagePath"
                :alt="item.productName"
                :title="item.productName"
                lazy="loading"
              >
            </div>
            <div class="sotreGoodDetails">
              <div class="sotreGoodName">{{item.productName}}</div>
              <div class="sotreGoodPayMonthlyNo">
                <div class="sotreGoodPayPrice"><span class="small">￥</span>{{item.price}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import BodyBg from "../../mixin/index"
export default {
  mixins: [BodyBg],
  data () {
    return {
      storeNo: this.$route.query.storeNo || 0, // 编号
      store: {}, // 店铺信息
      storeProducts: [], // 店铺商品
      pageNo: 1, // 当前页数
      pageCount: 4, // 总页数
      pageSize: 30, // 分页单位
      type: 0, // 排序类型
      sortList: [ // 排序类型
        {
          name: '综合',
          type: [0]
        },
        {
          name: '销量',
          type: [1, 2]
        },
        {
          name: '价格',
          type: [3, 4]
        },
        {
          name: '新品',
          type: [5]
        }
      ],
      sortIndex: 0,
      sortFlag: 1,
      isSCrollLoading: false,
      isShowSort: true
    }
  },
  created () {
    this.getStoreInfo()
    this.getStoreProducts()
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll, false)
    })
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.onScroll, false)
    next()
  },
  methods: {
    // 获取店铺信息
    getStoreInfo () {
      this.showLoad(true)
      let uid = this.$store.state.userInfo.uid || ""
      this.$post({
        url: this.$store.state.api.storeInfo,
        data: {
          uid,
          storeNo: this.storeNo
        }
      }).then(({ data: res }) => {
        this.showLoad(false)
        if (res.status == "1") {
          this.store = res.data
        }
      })
    },
    /**
     * 查询店铺主页商品(*代表必填)
     * uid  用户id
     * storeNo* 店铺编号
     * type*  排序类型
     *  1-销量升序
     *  2-销量降序
     *  3-价格升序
     *  4-价格升序
     *  5-新品
     *  其他:综合
     * pageNo* 当前页
     * pageSize 分页单位
     */
    getStoreProducts (type) {
      if (this.pageCount < this.pageNo) {
        return Promise.resolve()
      }
      this.isSCrollLoading = true
      this.showLoad(true)
      let uid = this.$store.state.userInfo.uid || ""
      return this.$post({
        url: this.$store.state.api.storeProducts,
        data: {
          uid,
          storeNo: this.storeNo,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: this.type
        }
      }).then(({ data: res }) => {
        this.showLoad(false)
        this.isSCrollLoading = false
        if (res.status == "1") {
          this.pageNo += 1
          this.pageCount = res.pageCount
          if (!type) {
            this.storeProducts = res.data
          } else {
            this.storeProducts = this.storeProducts.concat(res.data)
          }
        } else {
          this.isShowSort = false
        }
      })
    },
    // 选中排序类型
    productsSort (index, typeArr) {
      this.pageNo = 1
      if ((index == this.sortIndex) && (index && index != 3)) {
        if (!this.sortFlag) {
          this.sortFlag = 1
        } else {
          this.sortFlag = 0
        }
      } else {
        this.sortIndex = index
        this.sortFlag = 0
      }
      this.type = typeArr[this.sortFlag]
      this.storeProducts = []
      this.getStoreProducts()
    },
    /**
     * 网红-店铺关注、取消关注(*代表必填)
     * uid* 用户id
     * followType*  1-网红  2-店铺
     * followNo*  网红或店铺编号
     * status 1-关注  0-取消关注
     */
    // 切换关注状态
    followedMethod () {
      let { uid } = this.$store.state.userInfo
      if (!uid) {
        this.$router.push('/login')
        return false
      }
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.follow,
        data: {
          uid,
          followType: 2,
          followNo: this.store.storeNo,
          status: this.store.followersStatus == '0'? 1 : 0
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          this.store.followersStatus = res.data.status
        }
      })
    },
    // 跳转商品详情
    goodDetail (good) {
      this.$router.push({
        path: 'detail',
        query: {
          productNo: good.productNo,
          isActivity: 0,
          activityNo: ''
        }
      })
    },
    onScroll () {
      if (this.isBottom() && !this.isSCrollLoading) {
        this.getStoreProducts('1')
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    }
  }
}
</script>
