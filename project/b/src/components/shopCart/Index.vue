<template>
  <div class="shop-cart-wrap">
     <!-- diy header start -->
     <HeaderEmpty>
       <span
         v-if="(shopCart.invalidProductList.length || shopCart.productList.length)"
         class="cell_0 txt_r"
         slot="diy-text"
         @click="editAndRemove">
         {{headerText}}
      </span>
     </HeaderEmpty>
     <!-- diy header end -->

     <!--shop cart header tips start-->
     <!-- <HeaderTopTips class="f5f5f5 diyStyle" v-if="(shopCart.invalidProductList.length || shopCart.productList.length)"></HeaderTopTips> -->
      <!--shop cart header tips end-->

    <div class="product-list-empty" v-if="!shopCart.productList.length && shopCart.invalidProductList.length">
        <img src="../../assets/icon/shopCart/shopping_empty_icon@3x.png" alt="" class="empty-img">
        <p class="empty-text">去添加点什么吧～</p>
      </div>

      <!-- shop cart goods list start -->
        <section class="shop-cart-list">
          <section class="goods-list" ref="cartBox">
             <goodsCartItem
             :goodsList="shopCart.productList"
             @resetShopCartGoodsNum="resetShopCartGoodsNum"
             type="productList"
             @chooseCurProd="chooseCurProd"
             :isEditStatus = "isEditStatus"
             >
             </goodsCartItem>
          </section>
          <!-- invalid shop cart list-->
          <section class="goods-list goods-invide" v-if="shopCart.invalidProductList.length">
              <section class="invalid-tips clearfix">
                <span class="left-text fl">失效宝贝{{shopCart.invalidProductList.length}}件</span>
                <span class="right-btn fr" @click="clearInvidGodds($event)">清空失效宝贝</span>
              </section>
            <goodsCartItem :goodsList="shopCart.invalidProductList" type="invalidProductList"></goodsCartItem>
          </section>
          <!-- invalid shop cart list-->
          <!-- fixed footer start-->
          <p class="bottom-tips flex" v-if="Object.keys(shopCart.curShopCart).length > 1 && isShopTips">
            <span class="fl cell_0 txt_tips">提示：如您需使用优惠券付款，<b>请分别支付心仪商品；</b>购买多个商品暂不支持使用优惠券。</span>
            <span class="close-tips cell_1" @click="closeTips()"></span>
          </p>
          <footer class="shop-cart-bottom flex" v-if="shopCart.productList.length">
            <span class="circle cell_0 borderTop" :class="{'circle-check': isChooseAllGoods}" @click="clearUserChoose()">
              <span></span>
            </span>
            <span class="choose-text cell_0 borderTop">{{scaleGoodsLength>0?'已选': '全选'}}({{scaleGoodsQuantity}})</span>
            <span class="cell_1 borderTop seatBox"></span>
            <span class="total-goods-price cell_0 borderTop" v-if="isEditStatus">¥{{caleTotalPrice | fixed2NoRound}}</span>
            <button class="cell_0 pay-order" :disabled="scaleGoodsLength === 0" @click="payOrderOrRemoveGoods($event)">{{isEditStatus? '去结算': '删除 '}}</button>
          </footer>
          <!-- fixed footer end-->
        </section>
      <!-- shop cart goods list end -->
      <!-- shop cart empty start-->
         <div class="shop-cart-empty" v-if="!(shopCart.invalidProductList.length || shopCart.productList.length) && !isLoadHttpRequest">
           <img src="../../assets/icon/shopCart/shopping_empty_icon@3x.png" alt="" class="empty-img">
           <p class="empty-text">去添加点什么吧～</p>
           <button class="go-index" @click="goIndex" v-if="$store.state.config.fromChannel != 'sxypApp'">去逛逛</button>
         </div>
      <!-- shop cart empty end-->
   </div>
</template>
<script>
  // import HeaderTopTips from './HeaderTopTips'
  import goodsCartItem from './goodsCartItem'
  import HeaderEmpty from 'components/common/HeaderEmpty'
  import { mapActions } from 'vuex'
  import { app, is_weixn } from 'lib/until'
  import _ from 'lodash'
  export default {
    data () {
      return {
        headerText: '编辑',
        isLoadHttpRequest: true,  // true: 正在加载数据, false： 加载完成数据
        isShopTips: true, // 是否显示tips
        shopCart: {
          // 去结算页面用户选中的所有商品
          curShopCart: {},
          // 删除页面用户选中的商品
          curRemoveList: {},
          productList: [],
          invalidProductList: []
        },
        minBuyFlag: false,
        minArr: {}
      }
    },
    created () {
      this.$nextTick(() => {
        this.showLoad(true)
        // 获取购物车列表
        this.queryShopCart()
      .then(({data: res}) => {
        this.showLoad(false)
        this.isLoadHttpRequest = false
        if (res.status == '1') {
          let data = res.data
          data.productList.map((item, i) => {
            let qualityProduct = item.product
            delete item.product
            item.qualityProduct = qualityProduct
            item.productStock = item.stock
          })
          if (data.invalidProductList) {
            data.invalidProductList.map((item, i) => {
              let qualityProduct = item.product
              delete item.product
              item.qualityProduct = qualityProduct
            })
          }
          Object.assign(this.shopCart, data)
        } else {
          this.showToast({
            msg: res.statusDetail
          })
        }
      })
      })
    },
    watch: {
      "shopCart.curShopCart": {
        handler (curVal, oldVal) {
          this.isShopTips = true
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        "queryShopCart",
        "addGoodsInfo",
        "updateGoodsInfo"
      ]),
      // 购物车结算获取几件结算
      getMinbuy () {
        const curShopCart = this.shopCart.curShopCart
        console.log("测试数据:"+JSON.stringify(curShopCart))
        let cartIds = []
        let that = this
        for (let i in curShopCart) {
          cartIds.push(curShopCart[i].cartId)
        }
        return this.$post({
          url: this.$store.state.api.saleNumber,
          data: {
            uid: this.$store.state.userInfo.uid,
            token: this.$store.state.userInfo.token,
            cartIds: cartIds.join(',')
          }
        }).then(({data: res}) => {
          // status!=1后台有修改件数
          if (res.status!=1) {
            that.$set(that.$data, 'minBuyFlag', true)
            that.$set(that.$data, 'minArr', res.data)
          } else {
            that.$set(that.$data, 'minBuyFlag', false)
          }
          console.log("haha1:"+that.minBuyFlag)
        })
      },
      // 去首页
      goIndex () {
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          app.goIndex()
        } else {
          this.$router.push('/')
        }
      },
      // 关闭提示框信息
      closeTips () {
        this.isShopTips = false
      },
      // 去结算
      payOrder (e) {
        const curShopCart = this.shopCart.curShopCart
        let he = this.$refs.cartBox.clientHeight
        let eve = he / (Object.keys(curShopCart).length)
        console.log("高度:"+he)
        let errItemArr = []
        let that = this
        if (Object.keys(curShopCart).length > 0) {
          // 遍历需要结算的列表，筛选不符合件数要求的
          for (let i in curShopCart) {
            console.log("筛选:"+JSON.stringify(curShopCart[i]))
            if (curShopCart[i].minBuyCnt>curShopCart[i].quantity) {
              if (Object.keys(curShopCart).length > 1) {
                that.showToast({
                  msg: `抱歉，您购物车部分商品不符合起售条件`
                })
              } else {
                that.showToast({
                  msg: `抱歉，此商品${curShopCart[i].minBuyCnt}件起售`
                })
              }
              errItemArr.push(i)
              // 页面滚动到不符合商品处
              console.log("第几个不符合:"+errItemArr[0])
              if (errItemArr[0]>4) {
                // 页面滚动距离加页面高度
                let sHeight = 4*eve + (document.body || document.documentElement).scrollTop
                if ((errItemArr[0]*eve)>sHeight) {
                  window.scrollTo(0, (errItemArr[0]*eve)-sHeight)
                }
              }
              return false
            }
          }
          // 购物车不支持跨境商品和普通商品一起结算
          let curShopCarts = JSON.parse(JSON.stringify(Object.values(curShopCart)))
          let crossBorderFlg = 0
          curShopCarts.forEach((i) => {
            if (i.isCrossBorder==1) {
              crossBorderFlg++
            }
            return crossBorderFlg
          })
          if (crossBorderFlg!=curShopCarts.length&&crossBorderFlg>0) {
            this.showToast({
              msg: '请分开结算水象国际商品和其他商品'
            })
          } else {
            that.getMinbuy().then(function () {
              let minflag = that.minBuyFlag
              console.log('haha:'+minflag)
              // 没有修改件数
              if (!minflag) {
                console.log("yuanshi2:"+JSON.stringify(that.shopCart.productList))
                let obj = {
                  isCrossBorder: curShopCarts[0].isCrossBorder || 0
                }
                // 数据add到vuex goodsInfo userChooseGoods
                that.addGoodsInfo(Object.values(curShopCart))
                // 把数据更新到vuex goodsInfo.js
                that.updateGoodsInfo(obj)
                .then(() => {
                  console.log('curShopCart')
                  console.log(curShopCart)
                  // 更新数据成功以后跳转到订单确认页面
                  window.sessionStorage.setItem('fromPage', 'ShopCart')
                  that.$router.push("/Confirmorder")
                })
              } else {
                console.log("yuanshi:"+JSON.stringify(that.shopCart.productList))
                // 根据返回的数据重构购物车列表
                that.shopCart.productList.forEach(function (_ite, _index) {
                  that.minArr.forEach(function (subite, subindex) {
                    if (_ite.qualityProduct.productNo==subite.productNo) {
                      that.showToast({
                        msg: '商品有限购改动，请查看编辑。'
                      })
                      that.$set(that.shopCart.productList[_index], 'minBuyCnt', subite.minBuyCnt)
                    }
                  })
                })
              }
            })
          }
        } else {
          this.showToast({
            msg: '请选择要结算的商品'
          })
        }
      },
      // 去结算或者删除购物车商品
      payOrderOrRemoveGoods (e) {
        if (this.isEditStatus) {
          if (this.$store.state.config.fromChannel != 'sxypApp' && !is_weixn()) {
            this.$router.push('/download')
            return false
          }
          // 去结算
          this.payOrder(e)
        } else {
          let _t = this
          this.showDialog({
            title: '删除提示',
            msg: '确定要从购物车删除所选商品？',
            lBtnText: "取消",
            confCallBack () {
              // 删除商品
              let productNos = []
              Object.values(_t.shopCart.curRemoveList).map((_item, index) => {
                let str = ""
                const { productNo } = _item.qualityProduct
                if (_item.fromNo) {
                  str = `${productNo}-${_item.fromNo}`
                } else {
                  str = `${productNo}`
                }
                productNos.push(str)
              })
              _t.removeShopCartGoods(productNos.join(','))
            }
          })
        }
      },
      // 清空失效宝贝
      clearInvidGodds (e) {
        let _t = this
        this.showDialog({
          title: "清空失效宝贝",
          msg: '确定要清空失效宝贝',
          lBtnText: '取消',
          rBtnText: '确定',
          confCallBack () {
            let productNos = []
            _t.shopCart.invalidProductList.map((_item, index) => {
              let str = ""
              const { qualityProduct, fromNo } = _item
              if (fromNo) {
                str = `${qualityProduct.productNo}-${fromNo}`
              } else {
                str = `${qualityProduct.productNo}`
              }
              productNos.push(str)
            })
            _t.removeShopCartGoods(productNos.join(','), 'clear')
          }
        })
      },
      // 购物车删除商品（单个/多个）
      removeShopCartGoods (productNo, flag) {
        const { uid, token } = this.$store.state.userInfo
        this.showLoad(true)
        this.$post({
          url: this.$store.state.api.DelShoppingCart,
          data: {
            uid,
            token,
            productNo
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status === '1') {
            // if flag存在代表是清空商品 else 代表删除制定商品
            if (flag) {
              this.shopCart.invalidProductList = []
            } else {
              const listArr = []
              const { curRemoveList, productList, curShopCart } = this.shopCart
              const removeList = Object.keys(curRemoveList)
              productList.map((val, index) => {
                if (!(removeList.indexOf((index + '')) > -1)) {
                  listArr.push(val)
                } else {
                  delete curShopCart[index]
                }
              })
              this.shopCart.productList = listArr
              this.shopCart.curRemoveList = []
            }
          } else {
            this.showToast({
              msg: res.statusDetail
            })
          }
        })
      },
      // 清空/选中的商品
      clearUserChoose () {
        // 根据 isEditStatus 区分 清空/选中
        let isChooseAllGoods = this.isChooseAllGoods
        let type = this.isEditStatus?'curShopCart': 'curRemoveList'
        if (isChooseAllGoods) {
          this.$set(this.$data.shopCart, type, {})
        }
        this.shopCart.productList.filter((_item, index) => {
          _item.isCheck = !isChooseAllGoods
          if (!isChooseAllGoods) {
            this.$set(this.shopCart[type], index, _item)
          }
          this.shopCart.productList.splice(index, 1, _item)
        })
      },
      // 编辑或者删除购物车
      editAndRemove () {
        const { productList } = this.shopCart
        if (this.headerText === '编辑') {
          this.headerText = "完成"
          this.shopCart.curRemoveList = {}
          // 还原数据
          productList.filter((_item, index) => {
            _item.isCheck = false
            productList.splice(index, 1, _item)
          })
        } else {
          // const curShopCartArr = Object.keys(curShopCart)
          this.headerText = "编辑"
          this.shopCart.curShopCart = {}
          // 把curShopCart的数据赋值给productList
          productList.map((val, index) => {
            val.isCheck = false
            productList.splice(index, 1, val)
          })
        }
        this.isShopTips = false
      },
      // 点击加减按钮
      resetShopCartGoodsNum (objCopy) {
        let that = this
        // type: 0 减  type: 1 增加
        console.log("点击改变:"+JSON.stringify(objCopy))
        if (objCopy.type) {
          if (!((+objCopy._item.quantity)<10)) {
            that.showToast({
              msg: '不能再添加更多了哦！'
            })
            return false
          }
        } else {
          if (!((+objCopy._item.quantity) > (+objCopy._item.minBuyCnt))) {
            that.showToast({
              msg: `亲，真的不能再减少了，商品是${(+objCopy._item.minBuyCnt)}件起售的呢~`
            })
            return false
          }
        }
        let { _item, index } = _.cloneDeep(objCopy)
        const num = (+_item.quantity) + objCopy.num
        this.showLoad(true)
        // 调用修改购物车商品信息接口
        this.$post({
          url: this.$store.state.api.editShoppingCart,
          data: {
            uid: this.$store.state.userInfo.uid,
            token: this.$store.state.userInfo.token,
            productNo: _item.qualityProduct.productNo,
            num: num,
            activityNo: _item.fromNo
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status === 1) {
            _item.quantity = num
            _item.isCheck = true
            that.shopCart.productList.splice(index, 1, _item)
            that.$set(that.shopCart.curShopCart, index, _item)
            // 获取最新限购数
            that.shopCart.productList.forEach(function (_ir, _ind) {
              if (_ir.productNo==_item.qualityProduct.productNo) {
                that.$set(that.shopCart.productList[_ind], "minBuyCnt", res.data.minBuyCnt)
              }
            })
          } else {
            that.showToast({
              msg: res.statusMessage
            })
          }
        })
      },
      // 选中商品
      chooseCurProd ({_item, index}) {
        let isEditStauts = this.isEditStatus?'curShopCart':'curRemoveList'
        _item['isCheck'] = !_item['isCheck']
        this.shopCart.productList.splice(index, 1, _item)
        if (_item['isCheck']) {
          this.$set(this.$data.shopCart[isEditStauts], index, _item)
        } else {
          // 由于vue不支持直接通过delete方式删除对象属性，所以通过如下hack方法解决
          const curShopCart = _.cloneDeep(this.shopCart[isEditStauts])
          delete curShopCart[index]
          this.$set(this.$data.shopCart, isEditStauts, curShopCart)
        }
      }
    },
    computed: {
      // 是否选中了所有商品
      isChooseAllGoods () {
        const { productList } = this.shopCart
        if (this.isEditStatus) {
          return this.scaleGoodsLength === productList.length
        } else {
          return this.scaleGoodsLength === productList.length
        }
      },
      // 计算选中商品总价
      caleTotalPrice: function () {
        let totalPrice = 0
        const curShopCart = this.shopCart.curShopCart
        Object.values(curShopCart).map((_item, index) => {
          if (!_item) return false
          totalPrice = totalPrice + (_item.qualityProduct.price * _item.quantity)
        })
        return totalPrice
      },
      // 是否是编辑状态
      isEditStatus () {
        return this.headerText == "编辑"
      },
      // 计算选中的商品长度
      scaleGoodsLength () {
        const { curShopCart, curRemoveList } = this.shopCart
        if (this.isEditStatus) {
          return Object.keys(curShopCart).length
        } else {
          return Object.keys(curRemoveList).length
        }
      },
      // 计算购物车所有商品的数量
      scaleGoodsQuantity () {
        const { curShopCart, curRemoveList } = this.shopCart
        let totalLength = 0
        if (this.isEditStatus) {
          Object.values(curShopCart).forEach(function (val) {
            if (!val) return false
            totalLength = totalLength + parseFloat(val.quantity)
          })
        } else {
          Object.values(curRemoveList).forEach(function (val) {
            if (!val) return false
            totalLength = totalLength + parseFloat(val.quantity)
          })
        }
        return totalLength
      }
    },
    components: {
      // HeaderTopTips,
      goodsCartItem,
      HeaderEmpty
    }
  }
</script>
<style lang="scss">
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.shop-cart-wrap{
  @include px2rem(padding-bottom, 294);
  border-top: 1px solid  $borderColor;
  .shop-cart-bottom{
    position: fixed;
    left: 0;
    bottom: 0;
    @include px2rem(bottom, 92);
    background: #FAFAFA;
    width: 100%;
    height: 1.3067rem;
    line-height: 1.3067rem;
    justify-content: center;
    align-items: center;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    // border-top: 1px solid  $borderColor;
    overflow: hidden;
  }
  .borderTop{
     border-top: 1px solid  $borderColor;
  }
  .seatBox{
    height: 100%;
  }
  .circle{
      width: 1.16rem;
      height: 2.1067rem;
      position: relative;
      background: #fff;
      &>span {
        display: block;
        position: absolute;
        left: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        width: .4rem;
        height: .4rem;
        border: 1px solid #666666;
        border-radius: 50%;
      }
    }
  .empty-img{
    display: block;
    width: 3.3333rem;
    height: 3.7333rem;
    margin: 2.8rem auto 0 auto;
  }
  .empty-text{
    text-align: center;
    color: #666;
    @include font-dpr(28);
    margin-top: .6667rem;
  }
  .go-index{
    display: block;
    width: 3.0667rem;
    height: .9333rem;
    text-align: center;
    @include font-dpr(32);
    color: #fff;
    margin: .72rem auto 0 auto;
    background: $mainColor;
    border-radius: 0.46665rem;
  }
  .top-tips{
    text-align: center;
    line-height: .96rem;
    color: $mainColor;
    @include font-dpr(24);
    &>span:nth-of-child(1) {
      &:after {
        content: "";
        display: block;
      }
    }
  }
  .goods-list{
    background: #fff;
    ul {
      li {
        justify-content: center; align-items: center;
        padding: .4rem;
        padding-left: 0;
        border-bottom: 1px solid $borderColor;
      }
    }
    .goods-image{
      display: block;
      width: 2.4rem;
      height: 2.4rem;
      margin: 0 .2667rem 0 0;
    }
    .goods-info{
       .goods-title{
         @include font-dpr(28);
         color: $color333;
         display: block;
         height: 0.56rem;
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 1;
         -webkit-box-orient: vertical;
         line-height: .56rem;
         &.crossBorder_goods{
           background: url('../../assets/icon/icon/quqiu.png') left 0.09rem no-repeat;
          @include px2rem(background-size, 102 34);
          @include px2rem(text-indent, 106);
         }
       }
       .goods-spu{
         @include font-dpr(24);
         height: .4267rem;
         color: #999;
         line-height: .4533rem;
         overflow: hidden;
         max-width: 70%;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        margin-bottom: 0.06rem;
       }
       .goods-price{
        //  display: inline-block;
         @include font-dpr(32);
         color: $redColor;
         padding-top: .24rem;
        //  font-weight: bold;
       }
    }
  }
  .circle-check{
     &>span {
        background: $mainColor;
        border: none !important;
        border-radius: 50%;
        color: #fff;
        &:after{
          content: '\00a0';
        display: inline-block;
        border: 2px solid #fff;
        border-top-width: 0;
        border-right-width: 0;
        width: .192rem;
        height: .1067rem;
        -webkit-transform: rotate(-50deg);
        position: absolute;
        top:.1067rem;
        left:.08rem;
        }
    }
  }
  .choose-text{
    height: 100%;
    @include font-dpr(26);
    color: #666666;
    margin-left: -.1333rem;
  }
  .pay-order{
    display: block;
    width: 3.3333rem;
    height: 100%;
    line-height: 100%;
    color: #fff;
    background: $mainColor;
    @include font-dpr(30);
  }
  .total-goods-price{
    @include font-dpr(32);
    color: $redColor;
    height: 1.3067rem;
    overflow: hidden;
    padding-right: .2667rem;
    &:before {
      content: "合计：";
      color: #999999;
      @include font-dpr(24);
    }
  }
  .shop-cart-bottom{
    .circle {
      height: 1.3067rem;
      background: #FAFAFA;
      &>span{
        top: 50%;
      }
    }
  }
  .goods-invide{
    .goods-title, .goods-spu{
      color: #DADADA !important;
    }
     .circle {
      &>span {
        border: 1px solid $borderColor;
      }
     }
  }
  .product-list-empty{
    background: #fff;
    overflow: hidden;
    padding-bottom: .8667rem;
    &>img{
      margin-top: .4rem;
    }
    .empty-text {
      margin-top: 0;
    }
  }
  .shop-cart-bottom{
    button:disabled {
      background: #d7d7d7;
    }
  }
  .bottom-tips{
    position: fixed;
    @include px2rem(bottom, 189);
    left: 0;
    width: 100%;
    // height: .96rem;
    // line-height: .96rem;
    @include px2rem(line-height, 34);
    @include px2rem(padding, 15 30 20 24);
    background: #FFF8E8;
    @include font-dpr(24);
    text-align: center;
    color: #FAA61A;
    justify-content: space-between;
    // justify-content: center;
    align-items: center;
    overflow: hidden;
    .txt_tips{
      @include px2rem(width, 650);
      b{
        color: $mainColor;
        font-weight: normal;
      }
    }
    .close-tips{
      width: .5333rem;
      height: .5333rem;
      background: url('../../assets/icon/shopCart/public_all_off_n@3x.png') no-repeat center;
      @include px2rem(background-size, 40 40);
    }
  }
}
.diyStyle{
  .GGCT_box{
    background: $bgColor;
    border-bottom: none;
  }
}
</style>
