<template>
  <div class='site-frame'>
    <div class='site-frame-index'>
      <div class='index-header'>
        <span @click="getShopFromFosition"><img src="../../assets/icon/icon_address.png">{{shopName?shopName:'请先定位店铺'}}<i></i></span>
        <span @click='goSearch'></span>
      </div>
      <div class='swiper' v-if="banner&&banner.length">
        <swiper class='swiper-container' indicator-dots='true' autoplay='true' interval='3000' circular='true' duration='500' indicator-color='rgba(255,255,255,.2)' indicator-active-color='#fff'>
          <block v-for='(item, index) in banner ' :key='index'>
            <swiper-item class='swiper-item'>
              <image :src='item.imagePath' class='slide-image' />
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class='store-content'>
        <button open-type='getUserInfo' @getuserinfo='bindGetUserInfo' class='sand-code'>
          <img src='/static/images/icon_sancode.png' class='codeImage' alt=''>
        </button>
        <p>扫描商品条形码购物</p>
        <p class="store">或者门店二维码定位</p>
      </div>
    </div>
    <div class='site-frame-cart current active' v-show='currentInfo' >
      <div class="mod" v-if="currentInfo">
        <div class="mod-comdity">
          <div class="comdity-name">{{currentInfo.itemName}}</div>
          <div class="comdity-info">
            <em>￥{{currentInfo.totalAmt?currentInfo.totalAmt:currentInfo.retailPrice}}</em>
            <div class="add-sub">
              <span @click="reduce(currentInfo)"></span>
              <input class="cart-num-input" type="number" v-model.number="currentInfo.cnt" maxlength='2' confirm-type="done" v-on:input="bindinput(currentInfo)" @blur="lostBlur(currentInfo)">
              <span @click="addCart(currentInfo)"></span>
            </div>
          </div>
        </div>
        <p class="mod-skuName" v-if="currentInfo.skuName">{{currentInfo.skuName}}</p>
      </div>
    </div>
    <div class='site-frame-cart' v-show='cartNum' :class='{"active":!cartShow}'>
      <div class='cart-money' >
        <span @click='scanCart'><em>{{cartNum}}</em></span>
        <span>￥{{cartPrice}}</span>
      </div>
      <div class='cart-buy'>
        <span @click="settlement">去结算</span>
        <!-- <button v-else open-type="getPhoneNumber" @getphonenumber="bindgetphonenumber">去结算</button> -->
      </div>
    </div>
    <div class='mask-alyer' v-show='cartShow&&cartNum' @click='scanCart'>
      <div class='cart-shop' @click.stop='scanCart(1)'>
        <div class="shop-head">
          <span>您选购的商品</span>
          <span @click="deleteCart">清空购物车</span>
        </div>
        <scroll-view scroll-y="true" class="shop-comdity">
          <div class="mod" v-for="(item, index) in storeInfo" :key="index">
            <div class="mod-comdity">
              <div class="comdity-name">{{item.itemName}}</div>
              <div class="comdity-info">
                <em>￥{{item.totalAmt?item.totalAmt:item.retailPrice}}</em>
                <div class="add-sub">
                  <span @click="reduce(item)"></span>
                  <input class="cart-num-input" type="number" v-model.number="item.cnt" maxlength='2' confirm-type="done" v-on:input="bindinput(item)" @blur="lostBlur(item)">
                  <span @click="addCart(item)"></span>
                </div>
              </div>
            </div>
            <p class="mod-skuName" v-if="item.skuName">{{item.skuName}}</p>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class='mask-alyer alyer-high' v-show="goodsShow">
      <div class="mask-goods" v-if="goodsInfo">
        <div class="goods-headPic">
          <img :src="goodsInfo[goodsIndex].pic" alt="">
        </div>
        <span class="close" @click="closeGoods"></span>
        <div class="goods-info">
          <p>￥{{goodsInfo[goodsIndex].retailPrice}}</p>
          <p>{{goodsInfo[goodsIndex].itemName}}</p>
        </div>
        <div class="goods-cate">
          <h5>分类</h5>
          <ul>
            <li :class="{'active':goodsIndex==index}" v-for="(item, index) in goodsInfo" :key="index" @click="changeGoodsIndex(item, index)">{{item.skuName}}</li>
          </ul>
        </div>
        <div class="goods-count">
          <span class="count">数量</span>
          <div class="add-sub">
            <span @click="goodsReduce"></span>
            <input class="cart-num-input" type="number" v-model.number="goodsInfo[goodsIndex].cnt" maxlength='2' confirm-type="done" v-on:input="goodsInput" @blur="goodsBlur">
            <span @click="goodsAddCart"></span>
          </div>
        </div>
        <p class="confirm" @click="goodsInfoConfirm">确定</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getWxStorage, setWxStorage, getWxShopId, setWxShopId, getWxPhone, setWxPhone, setOpenId, getWxToken, setWxToken, creatOrder, setWxShopName, isAndroid } from '@/utils/index'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      cartShow: 0, // 购物车商品弹层是否显示
      goodsShow: 0, // 多种商品规格弹层
      goodsInfo: '', // 子商品list
      goodsIndex: 0, // 多子商品指针
      goodsCnt: 1, // 多子商品件数
      shopName: '', // 店铺名称
      shopId: '', // 店铺id
      phone: '',
      openId: '',
      code: '', // 登录code
      shopCode: '',
      cartPrice: 0,
      storeInfo: [],
      currentInfo: '',
      sandFlag: 1, // 扫描方式 1：扫描门店二维码 2:扫描条形码
      banner: ''
    }
  },
  onLoad (query) {
    let shopName = this.$root.$mp.query.shopName // 店铺列表跳转过来不用调用根据shopcode获取店铺信息
    if (shopName) {
      this.shopName = shopName
      this.shopId = getWxShopId()
      this.shopCode = wx.getStorageSync('shopCode')
    } else {
      this.shopCode = decodeURIComponent(query.scene)
      if (this.shopCode === 'undefined') {
        this.shopCode = '' // 不是从店铺二维码进入小程序去本地缓存店铺编码
      }
      // this.shopCode = wx.getLaunchOptionsSync().query.scene || ''
      console.log('this.shopcode', this.shopCode)
      if (this.shopCode) {
        wx.setStorageSync('shopCode', this.shopCode)
      }
      this.getInfoFromShopCode() // 判断是否登录、通过店铺code调取店铺信息
    }
  },
  onHide () {
    if (this.shopId) {
      setWxStorage(this.storeInfo)
    }
  },
  onShow () { // 每次页面打开都会执行
    this.phone = getWxPhone() // 获取手机缓存
    this.updateCouponList({}) // 清空优惠券
    if (this.shopId) {
      this.storeInfo = getWxStorage() || []
      // this.getBannerByShopId() // 根据shopId获取banner信息
      // if (this.storeInfo) {
      //   this.cartNum = this.storeInfo.length
      // }
      if (this.storeInfo.length === 0) {
        // this.goodsInfo = ''
        this.currentInfo = ''
      }
    }
  },
  computed: {
    cartNum () {
      let i = 0
      let p = 0
      if (this.storeInfo) {
        this.storeInfo.forEach(v => {
          i = i + (v.cnt ? v.cnt : 1)
          p = p + v.retailPrice * v.cnt
        })
        this.cartPrice = p.toFixed(2)
      } else {
        i = 0
      }
      if (i === 0) {
        this.cartShow = 0
      }
      return i
    }
  },
  methods: {
    ...mapActions([
      'updateOrderId',
      'updateCouponList'
    ]),
    closeGoods () { // 子商品弹层关闭初始化
      this.goodsCnt = 1
      this.goodsInfo = ''
      this.goodsShow = 0
      this.goodsIndex = 0
    },
    deleteCart () {
      this.storeInfo = []
      this.currentInfo = ''
      setWxStorage(this.storeInfo)
    },
    // 手动根据gprs定位店铺
    getShopFromFosition () {
      if (!this.$timeStamp.getLayTime()) {
        return false
      }
      this.getShopInfoFromLocation()
    },
    changeGoodsIndex (item, index) { // 选择子商品规格
      if (this.goodsIndex === index) {
        return false
      }
      this.goodsIndex = index
    },
    // 根据店铺id获取banner信息
    getBannerByShopId () {
      this.$http.getBannerByShopId({shopId: this.shopId}).then(res => {
        this.banner = res.result
      }).catch(res => {
      })
    },
    goSearch () { // 搜索
      if (!this.$timeStamp.getLayTime()) {
        return false
      }
      if (!this.shopId) {
        this.$Toast('请先选择店铺')
        return false
      }
      this.currentInfo = ''
      wx.navigateTo({
        url: '/pages/history/index?id=' + this.shopId
      })
    },
    goShopList () {
      wx.navigateTo({
        url: '/pages/index/shopList'
      })
    },
    // 根据经纬度定位店铺
    getShopInfoFromLocation () {
      let _this = this
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          _this.$http.getMinimumShopList({latitude: res.latitude, longitude: res.longitude, distance: 0, size: 0}).then(res => {
            if (res.appCode === 'S0000' && res.result.length) {
              _this.diffShopInfo(res.result[0].shopId)
              _this.shopCode = res.result[0].storageCode
              wx.setStorageSync('shopCode', res.result[0].storageCode)
              _this.shopId = res.result[0].shopId
              setWxShopId(res.result[0].shopId)
              setWxShopName(res.result[0].shopName)
              _this.shopName = res.result[0].shopName
              _this.getBannerByShopId()
            }
          }).catch(res => {
            _this.clearStorage()
          })
        }
      })
    },
    // 定位店铺失败清除缓存
    clearStorage () {
      setWxShopId('')
      setWxShopName('')
      wx.setStorageSync('shopCode', '')
      setWxStorage([])
      this.storeInfo = []
      this.currentInfo = ''
      this.shopId = ''
      this.shopCode = ''
      this.shopName = ''
    },
    diffShopInfo (id) {
      if (id !== this.shopId) {
        this.storeInfo = []
        this.currentInfo = ''
        setWxStorage([])
      }
    },
    getStoreInfo () { // 获取店铺信息
      this.$http.getStoreInfo({shopCode: this.shopCode}).then(res => {
        if (res.appCode === 'S0000' && res.result && res.result.shopId) {
          this.diffShopInfo(res.result.shopId)
          this.shopId = res.result.shopId
          this.shopCode = res.result.shopCode
          wx.setStorageSync('shopCode', res.result.shopCode)
          setWxShopId(res.result.shopId)
          setWxShopName(res.result.shopName)
          this.shopName = res.result.shopName
          this.getBannerByShopId()
        } else {
          this.clearStorage()
        }
      }).catch(res => {
        this.clearStorage()
      })
    },
    // 微信登录
    wxLogin () {
      let _this = this
      wx.login({
        success: (res) => {
          _this.$http.westoreLogin({wxcode: res.code, sourceApplication: 3, sourceDevice: isAndroid() ? 1 : 2, sourcePlatform: 2}).then(res => {
            console.log('login')
            setWxToken(res.result.token)
            setOpenId(res.result.openid)
            _this.openId = res.result.openid
            _this.hasShopCode() // 判断是否有shopCode
          }).catch(res => {
          })
        },
        fail: () => {
        }
      })
    },
    // 判断是否有shopCode如果有则直接获取店铺信息、如果没有需要经纬度定位功能
    hasShopCode () {
      !this.shopCode ? this.getShopInfoFromLocation() : this.getStoreInfo() // 没有店铺code调用定位功能
    },
    getInfoFromShopCode () { // 根据店铺code设置店铺code缓存以及判断是否登录、未登录则调用登录
      getWxToken() ? this.hasShopCode() : this.wxLogin() // 未获取token缓存等调用微信登录否则校验是否有店铺code
    },
    settlement () { // 去结算
      if (!this.$timeStamp.getLayTime()) {
        return false
      }
      if (!this.phone) {
        this.$http.checkIsMobileAudit().then(res => {
          if (res.result && res.result.mobileAudit) {
            this.createOrder()
            this.phone = res.result.mobile
            setWxPhone(res.result.mobile)
          } else {
            wx.navigateTo({
              url: '/pages/login/bindPhone'
            })
          }
        }).catch(res => {
        })
      } else {
        this.createOrder()
      }
    },
    createOrder () {
      this.$http.createOrder({goodsList: creatOrder(this.storeInfo), shopId: this.shopId}).then(res => {
        if (res.result && res.result.orderId) {
          this.storeInfo = []
          this.currentInfo = ''
          this.updateOrderId(res.result.orderId)
          wx.navigateTo({
            url: '/pages/confirmorder/index'
          })
        }
      }).catch(res => {
      })
    },
    computedStoreInfo (item) {
      this.storeInfo.forEach((v, i) => {
        if (v.skuId === item.skuId) {
          v.cnt = item.cnt
          v.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
        }
      })
    },
    computedCurrentInfo (item) {
      if (this.currentInfo) {
        if (this.currentInfo.skuId === item.skuId) {
          this.currentInfo.cnt = item.cnt
          this.currentInfo.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
        }
      }
    },
    storeInfoConcat (item) { // 扫描出商品信息处理
      this.storeInfo = this.storeInfo ? this.storeInfo : []
      let f = 0
      if (this.storeInfo) {
        this.storeInfo.forEach(v => { // 已存在商品记录则数量+1
          if (v.skuId === item.skuId) {
            f = 1
            v.cnt >= 99 ? this.$Toast('单件商品限制99件') : v.cnt++
          }
        })
      }
      if (f === 0) { // 不存在商品记录则push数据
        this.storeInfo.push(item)
      }
    },
    getBanner () {
      this.$http.getIndexBannerInfo().then(res => {
        this.banner = res.result
      }).catch(res => {
      })
    },
    deleteCurrentInfo (item) {
      if (this.currentInfo.skuId === item.skuId) {
        this.currentInfo = ''
      }
    },
    goodsAddCart () {
      this.goodsInfo.forEach(v => {
        if (v.cnt >= 99) {
          this.$Toast('')
          return false
        } else {
          v.cnt = v.cnt + 1
        }
      })
    },
    goodsReduce () {
      this.goodsInfo.forEach(v => {
        v.cnt = v.cnt < 2 ? 1 : v.cnt - 1
      })
    },
    addCart (item) {
      if (item.cnt >= 99) {
        this.$Toast('')
        return false
      } else {
        item.cnt = item.cnt + 1
        item.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
        this.computedStoreInfo(item)
        this.computedCurrentInfo(item)
      }
    },
    reduce (item) {
      if (item.cnt < 2) {
        this.deleteCurrentInfo(item)
        this.storeInfo.forEach((v, i) => {
          if (v.skuId === item.skuId) {
            this.storeInfo.splice(i, 1)
          }
        })
      } else {
        item.cnt = item.cnt - 1
        item.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
        this.computedStoreInfo(item)
        this.computedCurrentInfo(item)
      }
    },
    goodsInfoConfirm () { // 确定子商品按钮
      this.dealGoodsInfo(this.goodsInfo[this.goodsIndex])
      this.closeGoods()
    },
    dealGoodsInfo (item) {
      if (this.currentInfo && this.currentInfo.skuId === item.skuId) {
        this.currentInfo.cnt = this.currentInfo.cnt + item.cnt
      } else {
        this.currentInfo = item
      }
      // this.$Toast('已加入购物车')
      this.storeInfoConcat(item)
      setWxStorage(this.storeInfo)
    },
    sandCode () {
      wx.scanCode({
        success: (res) => {
          if (res.scanType !== 'WX_CODE') { // 不是小程序码
            if (this.shopId) {
              this.$http.getGoodsInfo({goodsSn: res.result, shopId: this.shopId}).then(res => {
                if (res.result.length > 1) {
                  console.log('111', res.result)
                  res.result.forEach(v => {
                    v.cnt = 1
                  })
                  this.goodsInfo = res.result
                  this.goodsShow = 1
                } else if (res.result.length === 1) {
                  res.result[0].cnt = 1
                  this.dealGoodsInfo(res.result[0])
                }
              }).catch(res => {
              })
            } else {
              this.$Toast('请先定位店铺')
              return false
            }
          } else { // 小程序码
            if (res.path) {
              let arr = res.path.split('=')
              if (arr.length > 1) {
                this.shopCode = arr[1]
                wx.setStorageSync('shopCode', arr[1])
                this.getStoreInfo()
              }
            } else {
              this.$Toast('请扫描门店二维码')
              return false
            }
          }
        },
        fail: () => {
        }
      })
    },
    scanCart (x = 0) { // 点击购物车弹出购物车商品
      if (x === 1) {
        return false
      }
      this.cartShow = !this.cartShow
    },
    goodsInput () {
      if (typeof this.goodsCnt !== 'number' && this.goodsCnt !== '') {
        this.goodsCnt = 1
      }
    },
    goodsBlur () {
      if (!this.goodsCnt) {
        this.goodsCnt = 1
      }
    },
    bindinput (item) {
      item.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
      if (typeof item.cnt !== 'number' && item.cnt !== '') {
        item.cnt = 1
      }
      this.resetCartInfo(item)
      this.computedCurrentInfo(item)
    },
    lostBlur (item) {
      if (item) {
        if (!item.cnt) {
          item.cnt = 0
        }
        this.resetCartInfo(item)
        item.totalAmt = (item.cnt * item.retailPrice).toFixed(2)
      }
    },
    resetCartInfo (item) {
      if (item.cnt === 0) {
        this.currentInfo = ''
        this.storeInfo.forEach((v, i) => {
          if (v.skuId === item.skuId) {
            this.storeInfo.splice(i, 1)
          }
        })
      } else {
        this.computedStoreInfo(item)
      }
    },
    bindGetUserInfo (e) { // 授权获取用户信息
      if (e.mp.detail.userInfo) {
        if (!wx.getStorageSync('userInfo')) {
          e.mp.detail.userInfo.openid = this.openId
          this.$http.updateWxUserInfo(e.mp.detail.userInfo).then(res => {
            wx.setStorageSync('userInfo', 1)
          }).catch(res => {
          })
        }
        if (!this.phone) {
          this.$http.checkIsMobileAudit().then(res => {
            if (res.result && res.result.mobileAudit) {
              this.sandCode() // 调取微信扫描功能
              this.phone = res.result.mobile
              setWxPhone(res.result.mobile)
            } else {
              wx.navigateTo({
                url: '/pages/login/bindPhone'
              })
            }
          }).catch(res => {
          })
        } else {
          this.sandCode() // 调取微信扫描功能
        }
      } else {
        this.$Toast('请先授权应用')
      }
    }
  }
}
</script>
