// 拆分spu组件内的 检查用户状态和确定订单方法到mixin
import Base64 from 'lib/Base64'
import { mapActions } from 'vuex'
import { app } from 'lib/until'
export default {
  methods: {
    ...mapActions([
      "showTwoBtnDialog",
      "updateGoodsInfo",
      "updateUserInfo",
      "addGoodsInfo"
    ]),
     // 立即下单
    confirmOrder () {
      let { jdPrice, productName, viceTitle, productStock, productNo, isActivity, currentSpu, fightGroupsOrderNo, fightGroupsNo, cannotsale, is7ToReturn, rebate, promoteSaleActivityList } = this.currentParams
      let activityNo = this.currentParams.activityNo || (promoteSaleActivityList && promoteSaleActivityList[0]?promoteSaleActivityList[0].activityNo:'') || ''
      if (!this.productType && cannotsale != 0) {
        this.showToast({
          msg: '已售罄，暂时无法加入购物车'
        })
        return false
      }
       // 更新数据到vuex
       // 虚拟商品信息
      let virtualDetail = {
        attribution: this.currentParams['attribution'] || '',                     // 手机运营商
        mobile: this.currentParams['phoneNo'] || '',                                 // 更新手机号码
        productName,                                               // 产品名称
        notEmpty: this.productType || '',                                     // 产品类型话费／流量
        is7ToReturn: this.currentParams['is7ToReturn'] || '',
        isCrossBorder: this.currentParams['isCrossBorder'] || 0                                // 是否是跨境商品
      }
      // common goods info
      let userChooseGoods = [
        {
          quantity: this.quantity,
          spu: currentSpu || '',
          fromNo: activityNo || '',                              // 活动no
          is7ToReturn,                                                         // 商品是否支持退换货
          starNo: this.starNo, // 网红编号
          rebates: rebate,
          productStock,
          qualityProduct: {
            fightGroupsOrderNo: fightGroupsOrderNo || '',              // 拼团订单号
            fightGroupsNo: fightGroupsNo || '',                       // 拼团编号
            isActivity: isActivity || 0,                               // 是否是活动商品
            productNo,                                                 // 商品id
            price: jdPrice,                                            // 商品单价
            productName,                                               // 产品名称
            mainImagePath: this.currentParams.mainImagePath,               // 品对应的小icon
            viceTitle                                                       // 副标题
          }
        }
      ]
      // 虚拟商品直接把is7ToReturn,isCrossBorder字段设置为0
      if (virtualDetail.notEmpty) {
        userChooseGoods[0].is7ToReturn = 0
        userChooseGoods[0].isCrossBorder = 0
        userChooseGoods[0].quantity = 1
        userChooseGoods[0].rebates = 0
      }
      this.addGoodsInfo(userChooseGoods)
  // 把数据更新到vuex goodsInfo.js
      this.updateGoodsInfo(virtualDetail)
      if (Object.keys(this.address).length>0 && this.bChooseAddress) {
        this.updateGoodsInfo({selectedAddress: this.address})
      }
  // 跳转到订单确认页面
      this.$router.push('/confirmorder')
    },
    // 查询用户状态
    checkUserStatus (type) {
      this.showLoad(true)
      let { uid, token, userId } = this.$store.state.userInfo
      // let message = this.$store.state.message
      // console.log(this.$store.state.userInfo)
      let orderId = this.$store.state.route.query.orderId
      let fromChannel = this.$store.state.config.fromChannel
      return this.$post({
        url: this.$store.state.api.CreditLine,
        data: {
          token,
          uid,
          orderId,
          rates: this.rates,
          centerUserId: this.$store.state.userInfo.userId,
          orderChannel: fromChannel
        }
      }).then(data => {
        // let _t = this
        let dialogInfo = {}
        let res = data.data
        let { status, statusDetail } = res
        this.showLoad(false)
    /**
     * 授信流程,走白条
     */
        if (!type && status != 1) {
          return false
        }
        if (status == 1) {
          this.objData = res
          this.byStagesDetail = res.data.list
          return false
        } else {
          dialogInfo = {
            msg: statusDetail,
            url: process.env.SXBTURL['CREDIT']
          }
          // 14 额度不足 28 额度激活中
          if (status == 27 || status == 28) {
            dialogInfo.lBtnText = "取消"
            dialogInfo.rBtnText = '确定'
          } else {
            dialogInfo = {
              msg: statusDetail,
              rBtnText: '确定',
              url: ''
            }
          }
        }
    // 两个按钮的弹框
        let { title, msg, lBtnText, rBtnText, url } = dialogInfo
    // 一个按钮的弹框
        this.showTwoBtnDialog({
          title,
          msg,
          lBtnText,
          rBtnText,
          confCallBack () {
            if (url && url != '') {
              // // requestId 案件编号(云贷返回)
              // // sourceid 商城默认06
              // // 授信跳转到云贷
              // let requestId = res.data.yundaiOrderNo
              // window.location.href = `${url}?sourceid=06&requestId=${requestId}&mobile=${mobile}&token=${token}`
              if (fromChannel == 'sxypApp') {
                // 客户端授信
                app.goCredit()
              } else {
                // h5授信
                let callUrl = window.location.href
                const callBackUrl = Base64.encode(callUrl)
                window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
              }
            }
          }
        })
      })
    },
    bankShow () {
      // 银行卡信息查询
      let uid = this.$store.state.userInfo.uid || window.sessionStorage.getItem('userId')
      let token = this.$store.state.userInfo.token || window.sessionStorage.getItem('token')
      let rates = this.nextData ? this.nextData.rates : ''
      return this.$post({
        url: this.$store.state.api.BankCardShowSX,
        data: {
          uid: uid,
          token: token,
          rates: rates
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        let { idName, idNumber } = res
        if (idName !='' && idNumber !='') {
          this.updateUserInfo({
            idName: idName,
            idNumber: idNumber,
            isFrom: 'api'
          })
        }
        if (res.status === "1") {
          res.data.forEach((item) => {
            if (item.cardType == 10) {
              // 支付卡
              this.bankNo = 1
              this.bankList = {
                bankphone: item.bankphone,
                bankName: item.bankName,
                bankCardNum: item.bankCardNum,
                bankCode: item.bankCode
              }
            }
          })
        } else {
        }
      })
    },
    selectComment (type) {
      this.showLoad(true)
      // 评价
      if (this.pageNo <= 1) {
        this.commentList = []
      }
      let { isActivity, activityNo } = this.$store.state.route.query
      const { productNo, copyProductNo } = this.$data
      // 判定当前productNo是否和url里面携带一致，这个字段主要用于区分活动
      if (this.islodingDom) {
        this.isActive = !(copyProductNo == productNo)
      }
      let url = type && type ==2 ? this.$store.state.api.selectProductComment : this.$store.state.api.selectTwoComment
      return this.$post({
        url: url,
        data: {
          productNos: `'${productNo}'`,
          isActivity: this.isActive?'0':isActivity,
          activityNo: this.isActive?'':activityNo,
          pageNo: this.pageNo,
          type: this.isAll ? this.isAll : ''
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          let {pageCount} = res
          if (pageCount) {
            this.pageCount = pageCount
          }
          let {productComments, sumCount, nongraphicalCount, feedbackRate} = res.data
          productComments.forEach((a) => {
            if (a.productCommentPicture) {
              a.productCommentPicture = a.productCommentPicture.split(',')
            }
          })
          // this.$set(this.$data, 'commentList', productComments)
          if (this.pageNo <= 1) {
            this.$set(this.$data, 'commentList', productComments)
          } else {
            this.commentList = this.commentList.concat(productComments)
          }
          this.$set(this.$data, 'sumCount', sumCount)
          this.$set(this.$data, 'nongraphicalCount', nongraphicalCount)
          this.$set(this.$data, 'feedbackRate', feedbackRate)
        }
      })
    }
  }
}
