<template>
  <section class="hbWrap" style="height: 90%" v-if="isLoding">
    <div class="wrapper" v-if="radList.length>0">
      <ul class="couponsBox" id="page1">
        <li class="couponsCon" v-for="(coupons, i) in radList" :key="i" :class="coupons.useStatus==2 ? 'couponsOk' : 'couponsNo'" ref="coupons" data-type="0">
          <div class="couponsItem flex" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="couponsTap">
            <img class="couponsLeftImg" src="../../assets/icon/member/coupons-ok.png" v-if="coupons.useStatus==2">
            <img class="couponsLeftImg" src="../../assets/icon/member/coupons-no.png" v-else>
            <div class="couponsDetail flex">
              <p class="couponsMoney">
                <span class="couponsMoneyNum">{{coupons.parValue}}</span>
                <span class="couponsScope">元</span>
                <span v-if="!coupons.minOrderMoney||coupons.minOrderMoney==0.00"></span>
                <span v-else class="couponsScope">（满{{coupons.minOrderMoney}}-{{coupons.parValue}})</span>
              </p>
              <div class="couponsTit">
                <p class="couponsName">{{coupons.showName}}</p>
                <img class="couponsUseBtn" v-if="coupons.useStatus==2 && coupons.jumpType && coupons.jumpType !='0'" src="../../assets/icon/icon/coupons-use.png" @click="couponsUse(coupons)">
              </div>
              <div class="couponsTimeLimit">
                <p class="couponsTimeLimitTxt">{{coupons.startTime | timeFormat(6)}}-{{coupons.endTime | timeFormat(6)}}</p>
                <p class="couponsRule" v-if="coupons.otherRuleDesc" @click="viewRules(coupons)" :class="coupons.isshowRuleDesc ? 'couponsRuleImgTop' : 'couponsRuleImgBot'">
                  优惠券使用规则<img class="couponsRuleImg" src="../../assets/icon/member/rule-ok.png" v-if="coupons.useStatus==2">
                  <img class="couponsRuleImg" src="../../assets/icon/member/rule-no.png" v-else>
                </p>
              </div>
            </div>
            <div class="couponsRuleDetail" v-if="coupons.otherRuleDesc && coupons.isshowRuleDesc">
              <img class="couponsRuleDetailLine" src="../../assets/icon/member/coupons-line.png">
              <div class="couponsRuleDetailTxt">{{coupons.otherRuleDesc}}</div>
            </div>
          </div>
          <div class="couponsDelete" @click="deleteCoupons(coupons, i)"><span>删除</span></div>
        </li>
      </ul>
      <p class="no_datas" v-if="countLen==1">没有更多红包了！</p>
    </div>
    <div v-else class="nodata_order">
      <img src="../../assets/icon/icon/blank_coupon_icon.png">
      <p>暂时还没有优惠券哦~</p>
    </div>
  </section>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        radList: [],
        isSCrollLoading: 0,
        pageNo: 1,
        pageCount: 1,
        countLen: 0,
        isLoding: false,
        iStartX: 0,
        iEndX: 0

      }
    },
    beforeRouteLeave (to, from, next) {
      $(window, document).unbind('scroll')
      next()
    },
    created () {
      if (this.$store.state.userInfo.loginTokenWanKaState === 2) {
        this.myCouponShow()
      } else {
        this.$store.watch(state => {
          return state.userInfo.loginTokenWanKaState
        }, (loginState) => {
          loginState === 2 && this.myCouponShow()
        })
      }
      this.updateCoupon()
    },
    methods: {
      ...mapActions([
        "showTwoBtnDialog"
      ]),
      updateCoupon () {
        this.$nextTick(() => {
          $(window, document).bind('scroll', () => {
            if (this.isBottom() && !this.isSCrollLoading) {
              this.pageNo = (+this.pageNo) + 1
              this.myCouponShow(1)
            }
          })
        })
      },
      myCouponShow (type) {
        if (this.pageNo == 1) {
          this.isSCrollLoading = 0
        }
        if (this.pageCount && this.pageCount < this.pageNo) {
          this.isSCrollLoading = 1
          this.$set(this.$data, 'countLen', '1')
          return
        }
        let { uid, token, mobile } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.MyCouponShow,
          data: {
            uid: uid,
            token: token,
            mobile: mobile,
            pageNo: this.pageNo
          }
        }).then(data => {
          this.showLoad(false)
          this.isLoding = true
          let res = data.data
          if (res.status == "1") {
            this.pageNo = res.pageNo
            this.pageCount = res.pageCount
            res.data.forEach((item) => {
              item.isshowRuleDesc = false
            })
            if (!type) {
              this.$set(this.$data, 'radList', res.data)
            } else {
              this.radList = this.radList.concat(res.data)
            }
          } else {
//            this.showToast({msg: res.statusDetail})
          }
        })
      },
      isBottom () {
        if ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight >= document.body.scrollHeight) {
          return 1
        } else {
          return 0
        }
      },
      viewRules (radList) {
        if (this.checkSlide()) {
          this.restSlide()
          return false
        }
        radList.isshowRuleDesc = !radList.isshowRuleDesc
      },
      couponsTap () {
        if (this.checkSlide()) {
          this.restSlide()
        }
      },
      touchStart (e) {
        this.iStartX = e.touches[0].clientX
      },
      touchEnd (e) {
        // 当前滑动的父级元素
        let parentElement = e.currentTarget.parentElement
        let type = parentElement.dataset.type
        // 记录结束位置
        this.iEndX = e.changedTouches[0].clientX
        // 左滑
        if (type == 0 && this.iStartX - this.iEndX > 30) {
          this.restSlide()
          parentElement.dataset.type = 1
        }
        // 右滑
        if (type == 1 && this.iStartX - this.iEndX < -30) {
          this.restSlide()
          parentElement.dataset.type = 0
        }
        this.iStartX = this.iEndX = 0
      },
      // 复位
      restSlide () {
        let couponsNodeAll = this.$refs.coupons
        for (let i = 0; i < couponsNodeAll.length; i++) {
          couponsNodeAll[i].dataset.type = 0
        }
      },
      // 检测复位
      checkSlide () {
        let couponsNodeAll = this.$refs.coupons
        for (let i = 0; i < couponsNodeAll.length; i++) {
          if (couponsNodeAll[i].dataset.type == 1) {
            return true
          }
        }
        return false
      },
      deleteCoupons (coupons, index) {
        this.showDialog({
          title: ' ',
          msg: "您确定要删除吗？",
          rBtnText: '确定',
          lBtnText: '取消',
          confCallBack: () => {
            // 删除优惠券请求
            let { uid, token } = this.$store.state.userInfo
            this.$post({
              url: this.$store.state.api.deleteMyCoupon,
              data: {
                uid,
                token,
                couponId: coupons.id
              }
            }).then(({data: res}) => {
              this.showLoad(false)
              console.log(res)
              if (res.status == "1") {
                this.restSlide()
                this.radList.splice(index, 1)
                this.showToast({msg: '删除成功'})
              } else {
                this.showToast({msg: res.statusDetail})
              }
            })
          },
          cancelBack: () => {
            this.restSlide()
          }
        })
      },
      // 去使用
      couponsUse (coupons) {
        if (this.checkSlide()) {
          this.restSlide()
          return false
        }
        if (!coupons.jumpParam) {
          return false
        }
        if (coupons.jumpType == 1) {
          // 跳转商品
          this.$router.push({
            path: '/detail',
            query: {
              productNo: coupons.jumpParam
            }
          })
        } else if (coupons.jumpType == 2) {
          // 跳转活动
          this.$router.push({
            name: 'Activity',
            params: {
              versionId: coupons.jumpParam
            }
          })
        }
      }
    }
  }
</script>

