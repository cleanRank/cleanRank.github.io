<template>
<section class="apply_after_wrap" v-if="isLoding">
  <div class="apply_after_top bg">
    <GoodsBox :product="product"></GoodsBox>
  </div>
  <!-- 选择退款不展示数量选择 -->
  <div class="apply_num_box bg" v-if="!$route.query.isCancel&&afterSaleType!=3 && asList.showAfterSaleCount!='0'">
    <p class="as_title_box no_border">申请数量<b class="c_red" v-if="isShowerror&&(canAftersaleCnt>asList.canAftersaleCnt || !canAftersaleCnt)">&nbsp;&nbsp;申请售后数量有误</b></p>
    <div class="select_quantity apply_select_quantity flex">
      <span class="number-btn flex">
        <button class="reduce-btn cell_0 line"
          :disabled="canAftersaleCnt <= 1"
          @click="reduceGoodsNum(0, -1)"></button>
        <input type="tel" :class="['cell_1', canAftersaleCnt>asList.canAftersaleCnt || canAftersaleCnt<=0?'c_red':'']" :value="canAftersaleCnt" v-model="canAftersaleCnt" v-on:input="judgeValue">
        <button class="add-btn cell_0"
        :disabled="canAftersaleCnt > asList.canAftersaleCnt"
        @click="reduceGoodsNum(1, 1)"
        ></button>
      </span>
      <p class="cell_1 sl_box c_777 font14">&nbsp;&nbsp;(最大可申请数量为{{asList.canAftersaleCnt}})</p>
    </div>
  </div>
  <div class="apply_num_box bg mar16">
    <p class="as_title_box no_border">售后类型<b class="c_999">&nbsp;&nbsp;(必选)</b><b class="c_red" v-if="isShowerror&&afterSaleType<1">&nbsp;&nbsp;请选择售后类型</b></p>
    <div class="apply_type_btn">
      <template v-for="(item, i) in asList.afterSaleType">
        <span :class="['js_btn', afterSaleType==i+1 || (asList.afterSaleType.length==1 && afterSaleType!=0)?'cur_btn':'']" :key="i" @click="selectSaleType(item.type)">{{item.typeDesc}}</span>
      </template>
    </div>
    <div class="refund_num_box" v-if="afterSaleType && afterSaleType!=2">
      <p class="refund_monery">退款金额(含水象通)<b class="c_red">¥ <input type="text" class="c_red" v-model="applyRefundAmount"></b></p>
      <p class="refund_txt">退款金额最高可退还¥{{asList.totalRefundAmount}}</p>
    </div>
  </div>
  <div class="apply_num_box bg">
    <p class="as_title_box no_border">售后原因<b class="c_red" v-if="isShowerror&&tabIndex<0">&nbsp;&nbsp;请选择售后原因</b></p>
    <div class="reason_select_box c_999" @click="showReson">{{tabIndex==-1?'请选择售后原因(必选)':asList.afterSaleReason[tabIndex].reasonDesc}}</div>
  </div>
  <div class="apply_num_box reason_box bg mar16">
    <p class="as_title_box no_border">原因描述</p>
    <div class="reason_explain_wrap">
      <textarea minlength="5" maxlength="500" class="reason_explain" placeholder="请详细描述这个问题，不少于5字" v-model="afterSaleReasonDesc"></textarea>
      <p class="num_box">{{afterSaleReasonDesc.length>0?500-afterSaleReasonDesc.length:0}}/500</p>
    </div>
  </div>
  <div class="apply_num_box bg mar16" v-if="!$route.query.isCancel">
    <p class="as_title_box no_border">上传商品损坏或其他售后原因的照片</p>
    <div class="flex upload_img_box">
      <div class="card-upload cell_0" v-for="(item, i) in imgList" :key="i">
        <img :src="item" alt="上传图片">
        <p class="clearImg_box" @click="clearImg(i)"></p>
      </div>
      <div class="card-upload cell_0" v-if="imgList.length<3">
        <input class="license" @change="uploadFile($event)" type="file" name="license" accept="image/*">
      </div>
    </div>
  </div>
  <button class="btnCom apply_after_btn" @click="applySubmit">立即申请</button>
  <Selects
  v-if="stagesFlag"
  :afterSaleReason="asList.afterSaleReason"
  :tabindex = "tabIndex"
  :title="'售后原因'"
  @reasonType = "emitParenType"
  ></Selects>
</section>
</template>
<script>
import GoodsBox from 'components/afterSales/childCommon/GoodsBox'
import Selects from 'components/afterSales/childCommon/Selects'
export default {
  data () {
    return {
      imgList: [],
      isLoding: false,
      asList: {},
      product: {},
      afterSaleType: 0, // 申请售后类型
      stagesFlag: false,
      tabIndex: -1,
      afterSaleReasonDesc: '',
      isShowerror: false,
      applyRefundAmount: 0,
      canAftersaleCnt: 1 // 申请数量
    }
  },
  components: {
    GoodsBox,
    Selects
  },
  // computed: {
  //   applyRefundAmount () {
  //     // 每个商品金额*申请数量 + 余数
  //     let {everyRefundAmount, remainder} = this.asList
  //     let applyRefundAmount = ((+everyRefundAmount) * this.canAftersaleCnt + (+remainder)).toFixed(2)
  //     return applyRefundAmount
  //   }
  // },
  created () {
    this.showPage()
  },
  methods: {
    emitParenType (val) {
      // 获取售后原因
      this.tabIndex = val
      this.showReson()
    },
    showReson () {
      this.stagesFlag = !this.stagesFlag
    },
    selectSaleType (type) {
      // 选择售后类型
      this.afterSaleType = type
      this.getAmount()
    },
    reduceGoodsNum (type, num) {
       // type: 0 减  type: 1 增加
      if (type) {
        if ((+this.canAftersaleCnt) >= this.asList.canAftersaleCnt) {
          this.showToast({
            msg: '数量超过可申请售后数量'
          })
          return false
        }
      } else {
        if ((+this.canAftersaleCnt) < 1) {
          return false
        }
      }
      this.canAftersaleCnt = (+this.canAftersaleCnt) + num
      this.getAmount()
    },
    getAmount () {
      // 计算退款金额
      let {totalRefundAmount, refundDetailList} = this.asList
      // this.applyRefundAmount = ((+everyRefundAmount) * this.canAftersaleCnt + (+remainder)).toFixed(2)
      // 根据数量匹配对应的退款金额
      refundDetailList && refundDetailList.map((item, index) => {
        if (item.refundCount == this.canAftersaleCnt) {
          this.applyRefundAmount = item.refundAmount
        }
      })
      // 选择退款默认最大数量
      if (this.afterSaleType==3) {
        // this.applyRefundAmount =((+everyRefundAmount) * this.asList.canAftersaleCnt + (+remainder)).toFixed(2)
        this.applyRefundAmount = totalRefundAmount
      }
    },
    judgeValue () {
      // 1≤判断输入值≤可申请售后商品数量；
      if (this.canAftersaleCnt && this.canAftersaleCnt <= 0) {
        this.canAftersaleCnt = 1
      } else if ((+this.canAftersaleCnt) > this.asList.canAftersaleCnt) {
        this.showToast({
          msg: '数量超过可申请售后数量'
        })
        this.canAftersaleCnt = this.asList.canAftersaleCnt
      }
      this.getAmount()
    },
    clearImg (i) {
      // 删除图片
      this.imgList.splice(i, 1)
    },
    uploadFile (event) {
      // 上传图片
      let img=event.target.files
      if (!img.length) {
        return false
      }
      this.compressFile(img[0])
    },
    compressFile (file, wantedSize = 150000, event) {
      const curSize = file.size || file.length * 0.7
      const quality = Math.max(wantedSize / curSize, 0.65)
      window.lrz(file, {
        // 压缩照片
        width: 880,
        quality
      }).then((src) => {
        this.imgList.push(src.base64)
      }).always(function () {
        // 清空文件上传控件的值
        event.target.value = null
      })
    },
    showPage () {
      if (this.$route.query.isCancel && this.$route.query.isCancel == '1') {
        this.$store.state.route.meta.title = '取消订单'
      } else {
        this.$store.state.route.meta.title = '申请售后服务'
      }
      let {uid, token} = this.$store.state.userInfo

      return this.$post({
        url: this.$store.state.api.afterSaleApply,
        data: {
          uid,
          token,
          orderId: this.$route.query.orderId || ''
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        this.isLoding = true
        if (res.status == "1") {
          let {productImage, productName, productPrice, buycount, canAftersaleCnt} = res.data
          this.product = {
            productImage,
            productName,
            productPrice,
            buycount
          }
          if (this.$route.query.isCancel && this.$route.query.isCancel == '1') {
            this.canAftersaleCnt = canAftersaleCnt
          }
          this.getAmount()
          this.$set(this.$data, 'asList', res.data)
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    },
    applySubmit () {
      // 提交售后申请
      if (this.tabIndex < 0 || this.afterSaleType < 1 || !this.canAftersaleCnt || this.canAftersaleCnt > this.asList.canAftersaleCnt) {
        this.isShowerror = true
        return false
      }
      if ((this.afterSaleType == 1 || this.afterSaleType == 3) && !this.applyRefundAmount) {
        this.showToast({
          msg: '退款金额不可为空'
        })
        return false
      } else if (this.applyRefundAmount > (+this.asList.totalRefundAmount) || this.applyRefundAmount < -0.00001) {
        this.showToast({
          msg: '退款金额申请超限'
        })
        return false
      }
      if (this.afterSaleReasonDesc&&this.afterSaleReasonDesc.length<5) {
        this.showToast({
          msg: '原因描述不能少于5个字'
        })
        return false
      }
      this.showLoad(true)
      this.isShowerror = false
      let {uid, token} = this.$store.state.userInfo
      if (this.afterSaleType==3) { // 选择退款，提交申请售后数量为最大
        this.canAftersaleCnt = this.asList.canAftersaleCnt
      }
      return this.$post({
        url: this.$store.state.api.applySubmit,
        data: {
          uid,
          token,
          orderId: this.$route.query.orderId || '',
          applyRefundCount: this.canAftersaleCnt, // 申请售后的数量
          applyRefundAmount: this.applyRefundAmount, // 申请退款金额
          afterSaleType: this.afterSaleType, // 申请售后类型
          afterSaleReason: this.asList.afterSaleReason[this.tabIndex].reason, // 申请售后原因
          afterSaleReasonDesc: this.afterSaleReasonDesc, // 原因描述
          images: this.imgList.join(','),
          sourceType: 1
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == "1") {
          // 返回上一页
          this.showToast({msg: '申请成功'})
          if (this.$store.state.route.from.name == 'AfterSalesList') {
            window.sessionStorage.setItem('tabIndex', 1)
          }
          window.history.go(-1)
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
