<template>
<section class="springActivity_wrap" v-if="isLoding">
  <div class="springActivity_box">
    <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/hb_01.jpg" class="springActivity_img">
    <div class="btn_subject">
      <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/btn.png" class="btn_img" @click="getRedpacket">
    </div>
  </div>
  <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/hb_02.jpg" class="springActivity_img">
  <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/hb_03.jpg" class="springActivity_img">
  <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/hb_04.jpg" class="springActivity_img">
  <div class="pop_box" v-if="isShowpop">
    <div class="opa" @click="showpop"></div>
    <div :class="['pulse', isShowpop?'animation':'']">
      <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/lqcg.png" class="springActivity_img" @click="showpop">
      <router-link tag="div" to="/myRedpacket" class="btn_subject">
        <img src="https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/look.png" class="btn_img">
      </router-link>
    </div>
  </div>
</section>
</template>
<script>
import { UPDATE_SHARE_INFO } from 'store/mutation-types'
import {jointLand} from 'lib/until'
export default {
  data () {
    return {
      subjectNo: '',
      isLoding: false,
      isShowpop: false
    }
  },
  created () {
    this.showRedpacket().then(() => {
      this.$root.$emit('showShareBtn', true)
      // 更新分享信息
      let url = window.location.origin + window.location.pathname + "#/springActivity?fromChannel=sxyph5"
      this.$store.commit(UPDATE_SHARE_INFO, {
        showFlag: true,
        title: '新春红包大派送！百万红包瓜分攻略来袭～',
        desc: '开工福利 | 水象宝宝专属年会大赏！',
        link: url,
        imgUrl: 'https://qmarket.oss-cn-shanghai.aliyuncs.com/qmarket/redbag/share.jpg' || ''
      })
    })
  },
  methods: {
    showRedpacket () {
      // 查询红包
      return this.$post({
        url: this.$store.state.api.InternalCoupon,
        data: {}
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        if (res.status == 1) {
          this.$set(this.$data, 'subjectNo', res.subjectNo)
        }
      })
    },
    getRedpacket () {
      let {token, uid} = this.$store.state.userInfo
      // 判断是否登录
      if (!token&!uid) {
        jointLand()
      } else {
        // 领取红包
        this.getSubject()
      }
    },
    getSubject () {
      let {mobile, token} = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.GetSubjectAppInternal,
        data: {
          mobile: mobile,
          token,
          subjectNo: this.subjectNo
        }
      }).then(data => {
        let res = data.data
        if (res.status == 1) {
          // 领取成功
          this.showpop()
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    showpop () {
      this.isShowpop = !this.isShowpop
    }
  }
}
</script>
