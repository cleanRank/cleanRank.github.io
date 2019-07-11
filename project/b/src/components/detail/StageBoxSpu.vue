<template>
  <section class="staging_container slideInUp" id="stagingContainer" :style="{ position: position }">
    <div class="shadow" @click="cancelBtn()"></div>
    <div class="staging_wrap slideInDown">
      <div class="s_proinfos flex">
        <div class="pro_img cell_0">
          <img :src="currentParams.mainImagePath" alt="">
        </div>
        <div class="pro_info cell_1">
          <p class="pro_title" v-if="operator">中国{{operator.attribution}} {{productType == '101'?'话费充值': '流量充值'}}{{currentParams.productName}}</p>
          <p class="pro_title" v-else>{{currentParams.productName}}</p>
          <p class="pro_price c_red"><b class="font12">¥</b><b class="font17">{{currentParams.jdPrice}}</b></p>
          <!-- <p class="pro_proNo">商品编号：{{currentParams.productNo}}</p> -->
        </div>
        <span class="closeStageBoxBtn cell_0" @click="cancelBtn()"></span>
      </div>
      <p class="ActivityTxt salesPromotionColumn" v-if="salesPromotionList.length> 0 && salesPromotionList[0].activityType!=4 && salesPromotionList[0].activityType!=1">
        <span class="salesPromotionColumnLabel">{{salesPromotionList[0].activityTypeDesc}}</span>
        <span class="salesPromotionColumnDesc" v-if="quantity<salesPromotionList[0].discountRuleList[0].discountType">购{{salesPromotionList[0].discountRuleList[0].discountType}}件立享【满{{salesPromotionList[0].discountRuleList[0].discountThreshold}}元任选{{salesPromotionList[0].discountRuleList[0].discountType}}件】</span>
        <span v-else class="salesPromotionColumnDesc">已满{{salesPromotionList[0].discountRuleList[0].discountType}}件，仅需支付{{salesPromotionList[0].discountRuleList[0].discountThreshold}}元</span>
      </p>
      <p class="is7ToReturn" v-if="currentParams.is7ToReturn==0">此商品不支持七天无理由退货</p>
            <!-- goods sku list s-->
            <div class="autoScroll border-bottom" v-if="currentParams.spu.length>0">
              <div class="goods-sku-list isWk" v-if="isSpuListShow">
                <template v-for="(spu, _index) in currentParams.spu">
                  <div class="sku_item" id="satgeMonths" v-show="downpaymentRatio[paymentRatioIndex] != '100'" :key="_index">
                    <span class="stage_title">{{spu.saleName}}
                      <span class="errorTips" v-show="spu.isClearUserChoose">请选择{{spu.saleName}}</span>
                    </span>
                    <div class="c_list">
                      <template v-for="(_item, index) in spu.saleAttrList">
                        <a href="javascript:;" :key="index"
                        class="js_satge_a list_border"
                        :class="{'cur': _item.selected, 'dottedLine': _item.isNotExit}"
                        @click="chooseSku(_item.productNos, _index, index)"
                        >{{_item.saleValue}}</a>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- goods sku list e-->
          <div class="select_quantity flex">
            <p class="cell_1 sl_box">数量
              <span class="minBuy" v-if="currentParams.minBuyCnt>1">此商品最低{{currentParams.minBuyCnt}}件起售</span>
            </p>
            <span class="number-btn flex border_none">
              <button class="reduce-btn cell_0 line"
              :class="{'disabled-ctrl': quantity <= currentParams.minBuyCnt}"
              :disabled="(quantity<currentParams.minBuyCnt?currentParams.minBuyCnt:quantity) <= currentParams.minBuyCnt"
               @click="reduceGoodsNum(0, -1)"></button>
              <input type="text" class="cell_1" readonly :value="quantity<currentParams.minBuyCnt?currentParams.minBuyCnt:quantity">
              <button class="add-btn cell_0"
              :class="{'disabled-ctrl': (quantity<currentParams.minBuyCnt?currentParams.minBuyCnt:quantity) >= productStock}"
              :disabled=" (quantity<currentParams.minBuyCnt?currentParams.minBuyCnt:quantity) >= productStock "
              @click="reduceGoodsNum(1, 1)"></button>
            </span>
          </div>
          <div class="btn_wrap-n">
           <a href="javascript:;" class="go_order_btn" id="goOrderBtn" :class="{'disabledBtn': isClickNextBtn}" @click="emitParenType($event)">{{entryType?'加入购物车': '立即下单'}}</a>
         </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import { is_android } from 'lib/until'
// import mixin from './mixin'
export default {
  data () {
    return {
      isGrayBtn: false,
      // 每月还款金额
      monthMoney: 0,
      // 用户选择首付比例
      paymentRatioIndex: 0,
      // 首付金额
      downPayAmount: 0,
      // 分期期数的索引
      rateIndex: '',
      position: is_android() ? 'fixed' : 'fixed',
      isSpuListShow: this.$store.state.route.name == 'Detail' && this.currentParams.spu.length > 0,
      quantity: this.quantitys || 1 // 商品数量
    }
  },
  props: {
    operator: {
      required: false,
      type: Object
    },
    currentParams: {
      required: true,
      type: Object,
      default: {
        downpaymentRatio: ''
      }
    },
    productType: {
      required: false
    },
    currentIndex: {},
    entryType: {},
    quantitys: {
      required: true,
      type: Number
    },
    salesPromotionList: {
      required: true,
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    "currentParams.cannotsale": {
      handler: function (val, oldVal) {
        if (val && val != 0) {
          console.log(val)
          this.showToast({ msg: '库存不足，请重新选择' })
        }
      }
    },
    "quantity": {
      handler: function (val, oldVal) {
        // 计算支付金额、优惠金额
        this.$emit("settlementAmount", val)
      }
    }
  },
  computed: {
    ...mapGetters({
      configInfo: "getConfigInfo"
    }),
    // 是否可以点击下一步, 是否置灰点击下一步
    isClickNextBtn () {
      const { cannotsale } = this.currentParams
      return cannotsale && cannotsale != '0' || this.isGrayBtn
    },
    // 计算首付比例
    downpaymentRatio () {
      let { downpaymentRatio } = this.currentParams
      if (downpaymentRatio) {
        return this.currentParams.downpaymentRatio.split(',')
      } else {
        return []
      }
    },
    productStock () {
      // 商品限购数量
      let {productStock, userCount, activityNo} = this.currentParams
      let { uid } = this.$store.state.userInfo
      if (uid && activityNo) {
        return userCount >= productStock ? productStock : userCount
      } else {
        return productStock
      }
    }
  },
  methods: {
    ...mapActions([
      "showTwoBtnDialog",
      "updateGoodsInfo",
      "updateUserInfo"
    ]),
    reduceGoodsNum (type, num) {
       // type: 0 减  type: 1 增加
      if (type) {
        if (!((+this.quantity) < this.productStock)) {
          this.showToast({
            msg: '不能再添加更多了哦！'
          })
          return false
        }
      } else {
        if (!((+this.quantity) > 1)) {
          this.showToast({
            msg: '商品已达最小数量，不能继续减少'
          })
          return false
        }
      }
      this.quantity = (+this.quantity) + num
    },
    // 通知父级组件
    emitParenType (e) {
      if (!this.isClickNextBtn) {
        this.$emit("emitParenType", e)
      }
    },
    /**
     * @param  {[string]} pruductNoList 用户选择sku对应的商品NO
     * @param  {[number]} spuIndex      表示选择spu的索引
     * @param  {[number]} skuIndex      表示选择sku的索引
     * @param {[string]} curSkuProNo   当前选中sku对应的商品No
     * @param {[number]} curSkuProNoIndex 当前选中sku对应的商品No索引
     */
    chooseSku (pruductNoList, spuIndex, skuIndex) {
      let isGrayBtnFlag = false  // 判定spu弹框下面的按钮是否可以点击的标志
      let isUserChooseNotExit = false
      let curSkuProNoList = []
      let firstJoin = false
      const { spu, curSkuProNo } = this.currentParams
      curSkuProNo.splice(spuIndex, 1, pruductNoList)
      // 点击的时候，当前纬度的sku为选中状态，其余sku 取消选中状态
      spu[spuIndex]['saleAttrList'].map((val, index) => {
        if (index == skuIndex) {
          val.selected = true
          val.isNotExit = false
        } else {
          //  val.isNotExit = false
          val.selected = false
        }
        spu[spuIndex]['saleAttrList'].splice(index, 1, val)
      })
      // 把选中所有sku对应的productNo取出来赋值给curSkuProNoList
      curSkuProNo.map((curVal, idx) => {
        if (curVal != '') {
          curSkuProNoList.push(curVal.split(','))
        }
      })
      // 把所有选中的状态取出来，然后取交集
      const intersectionArr = _.intersection(...curSkuProNoList)
      // 如果当前选中的sku对应的productNos没有交集
      //  if (!(intersectionArr && intersectionArr.length>0)) {
      //    curSkuProNo.splice(spuIndex, 1, pruductNoList)
      //  }
      setTimeout(() => {
        spu.map((val, idx) => {
          let arrSkuProNoList = []
          let isChooseSelected = false
          val.isClearUserChoose = false  // 判断是否显示红色tips的标志
          // 如果没有交集，则把当前数组赋值给选中的sku数组列表
          if (!(intersectionArr && intersectionArr.length > 0)) {
            arrSkuProNoList.push(spu[spuIndex].saleAttrList[skuIndex].productNos.split(','))
          } else {
            curSkuProNo.map((v, i) => {
              if (idx == i || v == '') {
                return false
              }
              arrSkuProNoList.push(v.split(','))
            })
          }
          val.saleAttrList.map((_item, index) => {
            let saleAttrList = _item.productNos.split(',')
            // 如果spu的纬度和当前循环到的纬度一样，则直接return 回去
            if (spuIndex == idx) {
              return false
            }
            // 首先判断当前选中的几个sku是否有交集如果没有,则其余的纬度都显示error信息
            if (!(intersectionArr && intersectionArr.length > 0)) {
              val.isClearUserChoose = true
              _item.selected = false
              if (!firstJoin) {
                firstJoin = true
                curSkuProNoList = [pruductNoList.split(',')]
              }
            }
            // 判断当前sku与已经选中的数据是否有交集(已经选中的sku，需要排除当前纬度)
            let curProNo = _.intersection(...arrSkuProNoList, saleAttrList)[0]
            /**
             * 如果selected是true代表是当前选中状态
             * 需要判断用户选中的这个sku对应productNo，
             * 是否在其他spu的sku对应的productno中有交集
             * 如果没有则这个属性的外边框变成虚线，然后提示用户请选择属性
             */
            // 当前sku对应的productNos
            let isSelected = !!(_item.selected && (curProNo && curProNo.length > 0))
            _item.selected = isSelected
            if (_item.selected) {
              isChooseSelected = _item.selected
            }
            // 当前属性需要和除本纬度以外所有选中的属性进行取交集操作，如果能取出来那代表可以选择
            if (curProNo) {
              _item.isNotExit = false
            } else {
              _item.isNotExit = true
              _item.selected = false
            }
            val.saleAttrList.splice(index, 1, _item)
          })
          // 如果当前纬度没有选中的状态，那么判定当前需要显示红色error信息, 并且底部的btn置灰不能点击
          if (!isChooseSelected && idx != spuIndex) {
            this.currentParams.curSkuProNo.splice(idx, 1, "")
            val.isClearUserChoose = true
            isGrayBtnFlag = true
          }
          if (val.isClearUserChoose && !isUserChooseNotExit) {
            isUserChooseNotExit = true
          }
          spu.splice(idx, 1, val)
        })
        this.$set(this.$data, 'isGrayBtn', isGrayBtnFlag)
        if (!isUserChooseNotExit) {
          // 三个属性取交集，然后重新渲染页面
          const productNos = this.intersectionArr()
          // 取出来数组交集的productNo通知父级组件
          this.emitParentInfo(productNos)
          // this.isMoneyCalced = false
        }
      }, 0)
    },
    // 判断是否只选中啦一个spu
    checkOneSku () {
      let num = 1
      const { curSkuProNo } = this.currentParams
      curSkuProNo.map((val, index) => {
        if (val == '') {
          num++
        }
      })
      return num
    },
    // 该函数是在提交代码的时候取出来交集用的
    intersectionArr (pruductNoList) {
      let curSpu = []
      this.currentParams.curSkuProNo.map((val, index) => {
        curSpu[index] = val.split(',')
      })
      // 判断当前选中的几个spu是否都有值
      const chooseNum = this.checkOneSku()
      // 数组取交集 如果选中的数组只有刚才用户点击的有值，那么直接把用户选中的spu返回去，否则取交集
      const productNos = _.intersection(...curSpu)[0]
      if (chooseNum == 1) {
        return productNos
      } else {
        return [pruductNoList.split(',')]
      }
    },
    // 通知父级组件
    emitParentInfo (productNos) {
      this.$emit('chooseSpu', productNos)
    },
    // 取消选择
    cancelBtn () {
      this.$emit('cancelBox', "")
    }
  },
  created () {
    const { spu } = this.currentParams
    spu && spu.map((val, idx) => {
      if (val.isClearUserChoose) {
        this.isGrayBtn = true
      }
    })
    let quantity = this.quantity<this.currentParams.minBuyCnt?this.currentParams.minBuyCnt:this.quantity
    this.$emit("settlementAmount", quantity)
  }
}
</script>
<style media="screen" lang="scss">
@import "../../assets/scss/app";
.swiper-contain-stage .swiper-container {
  position: static;
}
.go_order_btn.disabledBtn {
  background-color: $disColor;
}
.goods-sku-list {
  // @include px2rem(padding-bottom, 28);
  // @include px2rem(margin-bottom, 28);
  // // border-bottom: 1px solid $borderColor;
  // &.isWk {
  //   @include px2rem(margin-bottom, 10);
  // }
}
.price_box {
  margin-top: 0.26667rem;
  border-top: 1px solid $borderColor;
}
.minBuy{
  color: #FD455F;
  @include font-dpr(20);
}
.ActivityTxt{
  height: auto;
  @include px2rem(min-height, 68);
  @include px2rem(line-height, 68);
  @include px2rem(padding, 0 24 0 45);
  background: #F4F4F4;
  &.salesPromotionColumn{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
