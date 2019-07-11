import { mapActions } from 'vuex'
import { app, getQueryString, is_weixn } from 'lib/until'
import { weChatPay } from 'lib/wxpay'
import sensors from 'sa-sdk-javascript'
// import Base64 from 'lib/Base64'
export default {
  methods: {
    ...mapActions([
      "showTwoBtnDialog",
      "updateGoodsInfo",
      "updateUserInfo",
      "addGoodsInfo"
    ]),
    paymenInfo (type) {
      this.showLoad(true)
      // 支付
      // let url = (type == 0) ? this.$store.state.api.LianLianPay : this.$store.state.api.PayInstalment
      let { uid, token } = this.$store.state.userInfo
      let bankcardno = this.bankList ? this.bankList.bankCardNum : this.bankcardno
      let data = {
        uid,
        token,
        bankcardno,
        centerUserId: this.$store.state.userInfo.userId,
        orderId: this.$store.state.route.query.orderId || window.sessionStorage.getItem('orderId'),
        // monthnum: this.month,
        orderChannel: this.$store.state.config.fromChannel
      }
      return this.$post({
        url: this.$store.state.api.LianLianPay,
        data: data
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == '1') {
          let gift = res.gift
          if (gift) {
            window.sessionStorage.setItem('gift', '1')
          } else {
            window.sessionStorage.removeItem('gift')
          }
          if (res.zeropay == '0') {
            // 去第三方页面，通知一下客户端
            if (this.$store.state.config.fromChannel=='sxypApp') { app.showAppTitle() }
            window.sessionStorage.setItem('activieType', '0')
            $('#req_data').val(res.data)
            $('#form_warp').submit()
            // gift 大礼包全额支付去连连页面，支付成功之后回到收银台需要显示弹框 [1]是
          // } else {
            // 额度支付 不显示弹框gift=2
            // gift 大礼包 [1]是 [2] 否
            // this.$router.push({path: 'paysucces', query: {gift: gift ? '1' : '2', quota: 1}})
          }
        // } else if (res.status == '39') {
        //   this.showToast({msg: '此拼团已满，还有更多好商品在等你领回家，去商城逛逛吧'})
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    quotaEnough () {
      this.showLoad(true)
      // 判断额度是否够用
      return this.$post({
        url: this.$store.state.api.QuotaEnough,
        data: {
          orderId: this.$store.state.route.query.orderId,
          centerUserId: this.$store.state.userInfo.userId,
          rates: this.rates
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == 1) {
         // 额度够用
          this.sendValidCode(null, 4)
        } else {
          this.showToast({ msg: res.statusDetail })
        }
      })
    },
    sendValidCode (type, code) {
      // 获取手机验证吗
      return this.$post({
        url: this.$store.state.api.SendValidCode,
        data: {
          verifyCode: '',
          mobile: this.$store.state.userInfo.mobile,
          type: code
        }
      }).then(data => {
        let res = data.data
        if (res.status == 1) {
           // 点击按钮选中协议
          this.isChecked = true
          // 调用支付键盘
          this.isShowPw = true
          // 倒计时开始
          if (type) {
            this.timeDown = 59
          }
        } else {
          this.showToast({ msg: res.statusDetail })
        }
      })
    },
    weChat (orderId, orderIndex) {
      // 微信支付
      let {fromChannel, ver} = this.$store.state.config
      if (fromChannel == 'sxypApp' && +(ver.replace(/\./g, '')) > 150) {
        app.wxPay({
          orderId
        })
        console.log("sxapp")
      } else if (is_weixn()) {
        this.wxPayment(orderId)
      } else {
        this.$router.push({
          path: '/cashier',
          query: {
            orderId,
            orderIndex
          }
        })
      }
    },
    wxPayment (orderId) {
      // h5，公众号内调起微信支付，查询是否微信授权
      // 授权成功, 调起支付
      let { uid, token, userId } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.Wxpay,
        data: {
          uid,
          token,
          centerUserId: userId,
          orderId,
          isWxBrowser: is_weixn()
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        window.sessionStorage.setItem('orderId', orderId)
        if (res.status == "1") {
          // 已授权
          weChatPay.weixinPay(res.data)
        } else if (res.status == "2") {
          // 微信未授权
          // 保存下单信息
          let goodsInfo = JSON.stringify(this.$store.state.goodsInfo)
          window.sessionStorage.setItem("goodsInfo", goodsInfo)
          window.sessionStorage.setItem("fromPage", this.$store.state.route.from.name)
          let appid = res.data.appId
          let redirect_uris = window.location.hash.indexOf('?') > -1 ? window.location.href + '&redirecUrl=1&orderId=' + orderId : window.location.href + '?redirecUrl=1&orderId=' + orderId
          let redirect_uri = encodeURIComponent(redirect_uris)
          // let redirect_uri = "http://youpintest.sxfqsc.com"
          let hrefs = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&response_type=code&scope=snsapi_userinfo&redirect_uri=${redirect_uri}&state=STATE#wechat_redirect`
          window.location.href = hrefs
        } else if (res.status == "76") {
          this.showToast({msg: res.statusDetail})
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    wechatSaveUserinfo () {
      // 保存微信code
      let { uid, token } = this.$store.state.userInfo
      let code = getQueryString('code')
      return this.$post({
        url: this.$store.state.api.WechatSaveUserinfo,
        data: {
          uid,
          token,
          code
        }
      }).then(data => {
        let res = data.data
        if (res.status == "1") {
          // 调起微信支付
          let orderId = this.$store.state.route.query.orderId || getQueryString('orderId') || ''
          this.wxPayment(orderId)
        } else {
          console.log(getQueryString('orderId'))
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    sxtPrePay (type) {
      // 水象通预支付
      this.showLoad(true)
      let { uid, token } = this.$store.state.userInfo
      const { addressNo, invoiceType, invoiceContent, invoiceTitle, invoiceUnit, email, taxpayerNumber, redBagId, checkList } = this.rendarrTemp
      let { redBagValue } = this.goodsInfo
      console.log("redBagValue")
      console.log(redBagValue)
      const productData = []
      this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, remark, fromNo, starNo }, index) => {
        productData.push({
          quantity,
          price: qualityProduct.price,
          productNo: qualityProduct.productNo,
          fromNo: fromNo || '',
          leaveMessage: remark,
          starNo: starNo
        })
      })
      let cardNo = []
      checkList.map((item) => {
        cardNo.push(item.cardNo)
      })
      // 优惠金额
      let discountAmount = (Number(this.discountAmount) + Number(redBagValue)).toFixed(2)
      // 实付金额
      let totalAmount = (Number(this.totalPrice) - Number(redBagValue)).toFixed(2)
      return this.$post({
        url: this.$store.state.api.sxtPrePay,
        data: {
          uid,
          token,
          addressNo,                        // 地址id
          // 商品数据
          productData: JSON.stringify(productData),
          // 发票信息
          invoiceData: JSON.stringify({
            invoiceUnit: invoiceUnit && invoiceUnit.trim(),
            invoiceContent: invoiceContent && invoiceContent.trim(),
            invoiceTitle,
            invoiceType,
            email: email && email.trim(),
            taxpayerNumber: taxpayerNumber?(taxpayerNumber.trim()): ''
          }),
          redBagId: redBagId || '',          // 红包id
          orderChannel: this.$store.state.config.fromChannel,         // 下单来源
          cardNo: cardNo.join(','),
          discountAmount: discountAmount,
          totalAmount: totalAmount
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == "1") {
          this.isShowPw = true
          if (type) {
            this.timeDown = 59
          }
        } else if (res.status == '24') {
          this.addOverFlow()
          let hashGoodsInfo = {}
          // 重构接口返回的数据
          this.rendarrTemp.userChooseGoods.map((_item, index) => {
            hashGoodsInfo[_item.qualityProduct.productNo] = _item
          })
          res.data.errorData.map((val, idx) => {
            const {price, mainImagePath, productName} = hashGoodsInfo[val.productNo]['qualityProduct']
            val = {
              ...val,
              newPrice: price,
              mainImagePath,
              productName
            }
            res.data.errorData[idx] = val
          })
          this.errorlist = res.data.errorData
          this.newPeopleActivityNo = res.data.newPeopleActivityNo
          this.isShowChangeBox = true
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    },
    sxtPay (password) {
      // 水象通支付
      this.showLoad(true)
      let { uid, token } = this.$store.state.userInfo
      const { invoiceType, invoiceContent, invoiceTitle, invoiceUnit, email, taxpayerNumber } = this.$data.rendarrTemp
      const productData = []
      const presetProperties = sensors.getPresetProperties() // 获取预置属性
      const distinct_id = sensors.store.getDistinctId() // 获取匿名id
      this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, remark, fromNo, starNo }, index) => {
        productData.push({
          quantity,
          price: qualityProduct.price,
          productNo: qualityProduct.productNo,
          fromNo: fromNo || '',
          leaveMessage: remark,
          starNo: starNo
        })
      })
      let { redBagId, checkList, fromPage, redBagValue } = this.goodsInfo
      let cardNo = []
      checkList.map((item) => {
        cardNo.push(item.cardNo)
      })
      // 平台类型
      let platform_type = 'H5'
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        platform_type = this.$store.state.config.Plat
      }
      // 合伙人等级（初级、中级）
      let partnershipLevel = this.$store.state.userInfo.memberLevel || ''
      switch (partnershipLevel) {
        case "1":
          partnershipLevel = '初级'
          break
        case "2":
          partnershipLevel = '中级'
          break
        default:
          partnershipLevel = ''
      }
      // 公共属性
      let publicAttribute = {
        platform_type: platform_type,
        partnerOrNot: partnershipLevel != '',
        partnershipLevel
      }
      // 模块来源
      let moduleSource = this.goodsInfo.fromPage
      switch (moduleSource) {
        case "Detail":
          moduleSource = '商品详情'
          break
        case "ShopCart":
          moduleSource = '购物车'
          break
        default:
          moduleSource = '订单列表'
      }
      let invoice = null // 单独处理发票
      if (invoiceTitle == '1') {
        invoice = {
          invoiceType,
          email: email && email.trim()
        }
      } else if (invoiceTitle == '2') {
        invoice = {
          invoiceUnit: invoiceUnit && invoiceUnit.trim(),
          invoiceContent: invoiceContent && invoiceContent.trim(),
          invoiceTitle,
          invoiceType,
          email: email && email.trim(),
          taxpayerNumber: taxpayerNumber?(taxpayerNumber.trim()): ''
        }
      }
      // 埋点数据
      let buryingPointObj = {
        moduleSource,
        invoice: invoiceType == undefined || invoiceType == 0 ? '' : JSON.stringify(invoice),
        receiverIdcard: this.idNumber || ''
      }
      // 预置属性合并
      let buryingPointData = Object.assign(publicAttribute, presetProperties, buryingPointObj)
      // 优惠金额
      let discountAmount = (Number(this.discountAmount) + Number(redBagValue)).toFixed(2)
      // 应付金额
      let totalAmount = (Number(this.totalPrice) - Number(redBagValue)).toFixed(2)
      console.log(buryingPointData)
      return this.$post({
        url: this.$store.state.api.sxtPay,
        data: {
          uid,
          token,
          frompage: fromPage == "ShopCart"? 2: 1,
          addressNo: this.addressNo,                        // 地址id
          // 商品数据
          productData: JSON.stringify(productData),
          // 发票信息
          invoiceData: JSON.stringify({
            invoiceUnit: invoiceUnit && invoiceUnit.trim(),
            invoiceContent: invoiceContent && invoiceContent.trim(),
            invoiceTitle,
            invoiceType,
            email: email && email.trim(),
            taxpayerNumber: taxpayerNumber?(taxpayerNumber.trim()): ''
          }),
          redBagId: redBagId || '',          // 红包id
          orderChannel: this.$store.state.config.fromChannel,         // 下单来源
          cardNo: cardNo.join(','),
          mobileValidCode: password,
          properties: JSON.stringify(buryingPointData), // 预置属性
          distinctId: distinct_id, // 匿名id
          discountAmount: discountAmount,
          totalAmount: totalAmount
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == "1") {
          // 判断是否需要调起微信支付
          let {orderId, payComplete} = res.data
          window.sessionStorage.setItem('orderId', orderId)
          if (payComplete != 1) {
             // 跳转到收银台页面
            this.weChat(orderId)
          } else {
             // 支付成功页
            this.$router.push({path: 'paysucces', query: {gift: 2}})
          }
        } else if (res.status == '24') {
          this.addOverFlow()
          let hashGoodsInfo = {}
          // 重构接口返回的数据
          this.rendarrTemp.userChooseGoods.map((_item, index) => {
            hashGoodsInfo[_item.qualityProduct.productNo] = _item
          })
          res.data.errorData.map((val, idx) => {
            const {price, mainImagePath, productName} = hashGoodsInfo[val.productNo]['qualityProduct']
            val = {
              ...val,
              newPrice: price,
              mainImagePath,
              productName
            }
            res.data.errorData[idx] = val
          })
          this.errorlist = res.data.errorData
          this.newPeopleActivityNo = res.data.newPeopleActivityNo
          this.isShowChangeBox = true
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
