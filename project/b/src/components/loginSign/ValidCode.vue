<template id="">
  <section>
  <div class="inp flex" v-if="type != 6">
    <!-- <label class="cell_0">验证码</label> -->
    <p class="cell_1" v-if="!pirtureImg"><input type="text" maxlength="6" name="pictureCode" placeholder="输入图形验证码"  autocomplete="off" data-validate="pictureCode" reg="pictureCode" v-model="pictureCode" @focus="pirtuceCode"></p>
    <p class="cell_1" v-else><input type="text" maxlength="6" name="pictureCode" placeholder="输入图形验证码"  autocomplete="off" data-validate="pictureCode" reg="pictureCode" v-model="pictureCode"></p>
    <div class="getYzm cell_0 pictureYzm"><img :src="pirtureImg" @click="pirtuceCode" v-if="pirtureImg"></div>
  </div>
  <div class="inp flex">
      <!-- <label class="cell_0">验证码</label> -->
      <p class="cell_1" v-if="type==3"><input type="text" maxlength="6" name="mobileValidCode" placeholder="注册手机短信验证码"  autocomplete="off" data-validate="phoneyzm" v-model="valideCode" reg="phoneyzm"></p>
      <p class="cell_1" :class="{'shadowBox':type==6}" v-else><input type="text" maxlength="6" name="mobileValidCode" placeholder="输入短信验证码"  autocomplete="off" data-validate="phoneyzm" v-model="valideCode" reg="phoneyzm"></p>
      <button
         class="getYzm cell_0"
         :class="{ 'dis_color': timeDown != 0, 'shadowBox':type==6}"
         id="jsGetPhoneYZM"
         @click="sendValidCode"
         :disabled="timeDown != 0">
         {{timeDown == 0 ? '获取验证码': timeDown + "s"}}
      </button>
  </div>
  </section>
</template>
<script type="text/javascript">
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        pictureCode: '',
        valideCode: '',
        pirtureImg: '',
        timeDown: 0,
        stateType: true
      }
    },
    props: {
      type: {
        type: String,
        required: true
      },
      iphoneNum: {
        type: [String, Number],
        required: true
      },
      status: {
        type: [String, Number],
        required: true
      }
    },
    watch: {
      status: {
        // 状态码返回错误，更新图形验证码
        handler (val, oldval) {
          if (val && val!=oldval) {
            this.pictureCode = ''
            this.valideCode = ''
            this.pirtuceCode()
          }
        }
      }
    },
    created () {
      if (window.sessionStorage.getItem('iphoneNum')) {
        this.pirtureImg = process.env.APIPORT + '/oss/downloadverifyCode.do?mobile=' + this.iphoneNum + '&timer=' + new Date().getTime()
        return false
      }
      if (this.type==3) {
        this.pirtuceCode()
        return false
      }
    },
    methods: {
      ...mapActions([
        "updateToast"
      ]),
      // 倒计时
      timeDwon () {
        this.$set(this.$data, 'timeDown', 59)
        window.interval = setInterval(() => {
          if (this.$data.timeDown <= 0) {
            clearInterval(window.interval)
            return false
          }
          let second = parseInt(this.$data.timeDown) - 1
          this.$set(this.$data, 'timeDown', second)
        }, 1000)
      },
      sendValidCode () {
        this.showLoad(true)
        let { required } = this.$store.state.regex.pictureCode   // 手机号码检验规则
        if (this.pictureCode == '' && this.type != 6) {
          this.showLoad(false)
          this.updateToast({
            msg: required
          })
          return false
        }
        if (this.type == 6) {
          this.pirtuceCode()
        }
        if (!this.stateType) {
          this.showLoad(false)
          return false
        }
        // 获取手机验证吗
        return this.$post({
          url: this.$store.state.api.SendValidCode,
          data: {
            verifyCode: this.pictureCode,
            mobile: this.iphoneNum,
            type: this.type
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == 1) {
            this.timeDwon()
          } else {
            this.pictureCode = ''
            this.pirtuceCode()
            this.updateToast({ msg: res.statusDetail })
          }
        })
      },
      pirtuceCode () {
        let { required, msg, pattern } = this.$store.state.regex.phone   // 手机号码检验规则
        if (this.iphoneNum == '') {
          this.updateToast({
            msg: required
          })
          this.stateType = false
          return false
        } else {
          if (!pattern.test(this.iphoneNum)) {
            this.updateToast({ msg })
            this.stateType = false
            return false
          }
        }
        this.stateType = true
        // 图片验证码
        this.pirtureImg = process.env.APIPORT + '/oss/downloadverifyCode.do?mobile=' + this.iphoneNum + '&timer=' + new Date().getTime()
        this.$set(this.$data, 'pirtureImg', this.pirtureImg)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pictureYzm{
    background: url('../../assets/icon/icon/tpyzm_code.png') no-repeat left top;
    background-size: 100% 100%;
  }
  .pictureYzm img{
    width: 100%;
    height: .96rem;
  }
</style>
