<template>
  <section class="vd_container" style="padding-top: 1.41333rem">
    <div class="tab_head_top flex notFromPzsc" v-show="finishedFlag">
      <a href="javascript:;" class="cell_1" :class="{'active': productType == '101' || productType == '102'}" @click="switchTab('101')">话费及流量</a>
      <a href="javascript:;" class="cell_1 tab_ht-tab3" :class="{'active': productType == '106'}" @click="switchTab('106')" v-if="vipList.length > 0">热门会员</a>
      <!-- origion @click="setVipListSku(true, 0)" -->
    </div>
    <section class="stagings_container" v-if="productType !== '106'" style="background: #ffffff">
      <div class="phone_num flex">
        <p class="inf_p cell_1">
          <input class="pho_n" id="telPhone" type="tel" placeholder="请输入手机号码" disabled="" maxlength="11" :value="userInfo.mobile">
        </p>
        <label class="mail_list no_bag cell_0"></label>
        <label class="clear_pho cell_0 hide"></label>
      </div>
      <p class="error_p">(默认号码）{{operator.attribution}}{{operator.city}}</p>
      <div v-if="supportedNumber">
        <h2 class="charge-title"><span class="charge-title-text">充话费</span></h2>
        <div class="moneylist" id="goodsInfoContainer">
          <div class="nav_box">
            <template v-for="(_item, index) in billList">
              <div class="cell_0 nav_list" :key="index" @click="chooseElement(_item, '101', $event)">
                <div class="package_box page_box_new" :class="{'active': _item.productNo == currentProductNo}">
                  <p class="package_num font18 c_999">{{_item.productName}}</p>
                  <p class="package_num c_999 sj_f">售价：{{_item.price}}元</p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <h2 class="charge-title"><span class="charge-title-text">充流量</span></h2>
        <div class="moneylist" id="goodsInfoContainer">
          <div class="nav_box">
            <template v-for="(_item, index) in flowList">
              <div class="cell_0 nav_list" :key="index" @click="chooseElement(_item, '102', $event)">
                <div class="package_box page_box_new" :class="{'active': _item.productNo == currentProductNo}">
                  <p class="package_num font18 c_999">{{_item.productName}}</p>
                  <p class="package_num c_999 sj_f">售价：{{_item.price}}元</p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <p class="ts_m">*支持全国漫游 月底失效</p>
      </div>
      <div v-else>
        <img src="../../assets/icon/nonsupport.jpg" style="width: 100%" alt="" @click="showToast({msg: '当前号段不支持充值业务'})">
      </div>
      <p class="dummyProblem">
        <router-link to="/dummyProblem" class="font12 c_999">常见问题</router-link>
      </p>
    </section>
    <section v-else class="vip_container">
      <div class="vip_icontainer">
        <div class="vip_container-top">
          <!-- <img src="../../assets/icon/icon/vip_banner.jpg" class="vip_banner" alt=""> -->
          <section class="vips">
            <h2 class="hot_title">
              <span>热门会员</span>
            </h2>
            <ul class="vips_list">
              <li class="vips_list-item" :class="{'selected': vipIdx == vipIndex}" v-for="(vip, vipIdx) in vipList" :key="vipIdx" @click="chooseVipItem(vip, vipIdx, 0, $event)">
                <img :src="vip.mainImagePath" :alt="vip.productName" class="vips_list-img">
              </li>
            </ul>
          </section>
          <section class="vip_periods">
            <h3>期限</h3>
            <ul class="vip_periods_list">
              <li class="vip_periods_list-item" :class="{selected: vipSpuIdx == currentVipIndex}" @click="chooseVipSkuItem(vipSpu.productNos, vipSpuIdx)" v-for="(vipSpu, vipSpuIdx) in saleAttrList" :key="'v' + vipIndex + 'i' + vipSpuIdx">
                {{vipSpu.saleValue}}
              </li>
            </ul>
          </section>
          <div class="vip_warmtip">
            <label class="vip_warmtip-label">温馨提示：</label>
            <p class="vip_warmtip-cont">
              <span class="vip_warmtip-detail">付款成功后，10分钟左右，会以短信形式，发送［激活码或兑换码］到您的手机，请注意查收。</span>
              <span class="vip_warmtip-detail">如果充值失败，首付款将于1-2个工作日内退回，授信额度将于3-7个工作日内恢复。</span>
            </p>
          </div>
        </div>
        <div class="problem_instr">
          <router-link class="problem_instr_link" to="/vipChgQuestion">常见问题</router-link>
          <router-link class="problem_instr_link" to="/vipCardIntro">会员卡介绍</router-link>
        </div>
      </div>
    </section>
  </section>
</template>
<script type="text/javascript">
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import mixin from './mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      // tab索引
      // tabIndex: 0,
      // 运营商基本信息
      operator: {
        attribution: '',
        city: '',
        mainImagePath: ''
      },
      billImage: '',
      flowImage: '',
      billList: [],          // 话费列表
      flowList: [],          // 流量列表
      vipList: [],           // 热门会员
      stagesFlag: false,     // 是否选择分期
      // productList: [],       // 商品列表
      currentProductNo: '',
      // 当前用户选择信息
      currentParams: {
        firstPaymen: 0.00,
        mainImagePath: ''
      },
      // 分期期数的索引
      rateIndex: '',
      // 区分话费还是流量
      productType: this.$route.query.productType || '101',
      vipIndex: 0,
      currentVipIndex: -1,
      vipStagesFlag: false,
      currentVipParams: null,
      saleAttrList: [],
      supportedNumber: !/^(147|145|170)/.test(this.$store.state.userInfo.mobile),
      finishedFlag: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  methods: {
    ...mapActions([
      "updateToast",
      "updateUserInfo",
      "updateGoodsInfo",
      "loginTokenWanKa",
      "showTwoBtnDialog",
      "showOneBtnDialog"
    ]),
    // 选择元素
    chooseElement (productItem, productType, e) {
      this.$set(this.$data, 'productType', productType)
      this.currentProductNo = productItem.productNo
      const product = {...productItem}
      product.jdPrice = product.price
      product.select = !product.select
      const mainImagePath = productType == '101' ? this.billImage : this.flowImage
      this.$set(this.$data.operator, 'mainImagePath', mainImagePath)
      this.$set(this.$data, 'currentParams', _.merge({}, this.$data.currentParams, product, {mainImagePath}))
      this.confirmOrder()
      // this.$router.push("/Confirmorder")
      // this.$set(this.$data, 'stagesFlag', true)
    },
    // 获取商品列表
    fetchProductList (productType) {
      // 缓存productType到data
      if (!this.supportedNumber) {
        return true
      }
      // 切换tab的时候首先从缓存数据里面取
      if (this.$data.billList.length || this.$data.flowList.length) {
        return true
      }
      let { uid, token } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.virtualproductdetailshow2,
        data: {
          uid,
          token,
          phoneNo: this.userInfo.mobile,
          productType
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == 1) {
          let { data, dataRecharge, phoneInfo } = res
          // phoneInfo.mainImagePath = res.mainImagePath
          this.billImage = res.mainImagePath
          this.flowImage = res.mainImagePathRecharge
          // this.$set(this.$data, 'productList', data)
          this.$set(this.$data, 'billList', data)
          this.$set(this.$data, 'flowList', dataRecharge)
          this.$set(this.$data, 'operator', phoneInfo)
          this.$set(this.$data, 'currentParams', Object.assign(this.$data.currentParams, phoneInfo))
        } else {
          this.updateToast({ msg: res.statusDetail })
        }
      })
    },
    cancelBox () {
      this.$set(this.$data, 'stagesFlag', false)
      // this.$set(this.$data, 'currentIndex', '')
      this.currentProductNo = ''
    },
    switchTab (pType) {
      this.productType = pType
    },
    // 获取会员列表
    fetchVipList (skuIndex) {
      if (this.$data.vipList.length > 0) {
        // this.$set(this.$data, 'vipList', this.$data.vipList)
        return false
      } else {
        this.showLoad(true)
        return this.$post({
          url: this.$store.state.api.HotMemberSkuShow,
          data: {}
        }).then(({ data: res }) => {
          this.showLoad(false)
          if (res.status == 1) {
            const vipList = res.data.map(vip => ({...vip, skuInfo: []}))
            this.$set(this.$data, 'vipList', vipList)
            this.fetchVipListSku(this.vipList[this.vipIndex].productNo, skuIndex)
          }
          // return res.data
        })
      }
    },
    setVipListSku (enterVipFlag, skuIndex) {
      const thisVip = this.vipList[this.vipIndex]
      if (enterVipFlag) {
        this.$set(this.$data, 'productType', '106')
        this.fetchVipList(skuIndex)
      } else if (thisVip.skuInfo.length == 0) {
        // this.$set(this.$data.vipList[this.vipIndex], 'skuInfo', [])
        this.fetchVipListSku(thisVip.productNo, skuIndex)
      } else {
        if (this.$data.vipList[this.vipIndex].skuInfo[skuIndex]) {
          this.$set(this.$data, 'saleAttrList', thisVip.skuInfo[skuIndex].spu[0].saleAttrList)
        } else {
          this.fetchVipListSku(thisVip.productNo, skuIndex)
        }
      }
    },
    chooseVipItem (vip, vipIndex, skuIndex, e) {
      if (vipIndex >= 4) {
        this.updateToast({ msg: '攻城狮正在努力研发中' })
        return
      }
      this.$set(this.$data, 'vipIndex', vipIndex)
      this.setVipListSku(false, skuIndex)
    },
    fetchVipListSku (productNo, skuIndex) {
      this.showLoad(true)
      let { uid, token } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.productdetailshowspujd,
        data: {
          uid,
          token,
          productNo
        }
      }).then(({ data: res }) => {
        this.showLoad(false)
        this.$set(this.$data.vipList[this.vipIndex].skuInfo, skuIndex, res.data)
        this.$set(this.$data, 'saleAttrList', res.data.spu[0].saleAttrList)
        return res.data
      })
    },
    // 热门会员 -> 选择期限
    chooseVipSkuItem (productNos, vipSkuIndex) {
      this.$set(this.$data, 'currentVipIndex', vipSkuIndex)
      if (this.vipList[this.vipIndex].skuInfo[vipSkuIndex]) {
        this.choosedVipSkuItem(vipSkuIndex)
      } else {
        this.fetchVipListSku(productNos, vipSkuIndex).then(d => {
          this.choosedVipSkuItem(vipSkuIndex)
        })
      }
    },
    choosedVipSkuItem (vipSkuIndex) {
      // this.$set(this.$data, 'vipStagesFlag', true)
      const curVip = this.vipList[this.vipIndex]
      const { mainImagePath, productName, productNo, skuInfo: curVipSku, jdPrice } = curVip
      // const {downpaymentRatio, monthnumList, spu, jdPrice, currentSpu} = curVipSku
      const currentVipParams = {
        productNo,
        productName,
        mainImagePath,
        jdPrice,
        phoneNo: this.userInfo.mobile,
        ...curVipSku[vipSkuIndex]
      }
      this.currentParams = currentVipParams
      this.confirmOrder()
      // this.$set(this.$data, 'currentVipParams', currentVipParams)
    },
    cancelVipBox () {
      this.$set(this.$data, 'vipStagesFlag', false)
      this.$set(this.$data, 'currentVipIndex', -1)
    }
  },
  created () {
    this.fetchProductList('101')
    this.fetchVipList(0).then(() => {
      this.finishedFlag = true
    }, (err) => {
      this.finishedFlag = true
    })
  }
}
</script>
<style media="screen" lang="scss" scoped>
@import "../../assets/scss/dummydetail.scss";
@import "../../assets/scss/chargeVip.scss";
@import "../../assets/scss/flex";
.hot_title {
  @include display-flex;
  @include justify-content(space-between);
  @include align-items(center);
  .vipkf {
    @include font-dpr(24);
    @include px2rem(padding-right, 50);
    background: url(../../assets/icon/detail/vipkf.png) 100% 50%/contain no-repeat;
  }
}
.tab_head_top{
  position: fixed;
  left: 0;
  top: 0;
  @include px2rem(height,106);
  @include px2rem(line-height,106);
  color: #999;
  width: 100%;
  @include font-dpr(32);
  border-top: 1px solid $borderColor;
  background-color: #fff;
  z-index: 8;
  > .cell_1 {
    text-align: center;
    color: #999;
    border-bottom: 1px solid $borderColor;
    &.active{
      color: $mainColor;
      border-bottom:1px solid $mainColor;
    }
  }
  &.notFromPzsc {
    @include px2rem(margin-top, 88);
  }
}
.stagings_container {
  background: #fff;
}
.dummyProblem {
  @include px2rem(padding-top, 18);
  @include px2rem(margin-top, 27);
  border-top: 1px solid $borderColor;
  background: $bgColor;
}
.charge-title {
  position: relative;
  @include px2rem(margin, 10 0 36);
  &:before {
    position: absolute;
    left: 50%;
    top: 50%;
    content: "";
    @include px2rem(width, 330);
    @include px2rem(height, 2);
    background: #e0e0e0;
    -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
  }
  text-align: center;
  .charge-title-text {
    position: relative;
    display: block;
    @include font-dpr(28);
    @include px2rem(width, 130);
    color: $color333;
    margin: 0 auto;
    background: #fff;
  }
}

.nav_box>div {
  float: left;
}

.nav_box:after {
  content: "clear";
  display: block;
  overflow: hidden;
  clear: both;
  visibility: hidden;
  height: 0;
}

.page_box_new {
  padding: 0.4rem 0;
  min-height: auto;
}
</style>
