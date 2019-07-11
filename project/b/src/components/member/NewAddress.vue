<template>
  <section class="address_wrap" id="editListWrap">
    <div id="addressForm" class="flex stick_wrap">
      <div class="stick_main">
        <div class="add_addr_list ">
          <p class="flex info_p">
            <label class="cell_0 l_b">收件人</label>
            <input v-formBlur type="text" class="cell_1 addr_input" placeholder="姓名" name="consignee" data-required="required"  data-validate="name" reg="name" v-model.trim="consignee" maxlength="10" @blur="changeCount(consignee)">
          </p>
          <p class="flex info_p">
            <label class="cell_0 l_b">手机号</label>
            <input v-formBlur type="tel" class="cell_1 addr_input " placeholder="手机号"  name="consigneeMobile" maxlength="11" data-required="required" v-model.trim="consigneeMobile" reg="phone" data-validate="phone" @blur="changeCount(consigneeMobile)">
          </p>
          <router-link tag="p" to="/setAddress" class="flex info_p">
            <label class="cell_0 l_b">地区信息</label>
            <input type="text" readonly class="cell_1 addr_input select_address" placeholder="请选择" name="address" id="selectAddress" v-model="addressList" reg="address" data-validate="address"/>
          </router-link>
          <p class="flex info_p">
            <label class="cell_0 l_b">详细地址</label>
            <input v-formBlur type="text" class="cell_1 addr_input" maxlength="50"  placeholder="如街道、门牌号、楼层及房间号"  name="addDetail" data-required="required" v-model="addDetail" reg="addDetail" data-validate="addDetail" @blur="changeCount(addDetail)">
          </p>
          <!-- <p class="flex info_p">
            <label class="cell_0 l_b">地址标签</label>
            <select class="cell_1" name="addresslabel" v-model="addresslabel" pass="true" @change="changeCount(addresslabel)"><option addresslabel value="">请选择</option><option v-for="item in qualityParameterJson">{{item.parameterName}}</option></select>
          </p> -->
          <!-- <valid-code type="3" ref="validCodeDom" :iphoneNum="iphoneNum" :status="status"></valid-code> -->
        </div>
        <div class="tishi">请填写真实的收货地址，以免影响您的正常收货，对于地址不详的订单水象优品有权拒单</div>
      </div>
      <div class="add_addr_wrap stick_footer">
        <button class="btnCom" @click="bindEvent">保存</button>
      </div>
    </div>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import ValidCode from 'components/loginSign/ValidCode'
  export default {
    data () {
      return {
        qualityParameterJson: '', // 地址标签
        consignee: '', // 收货人姓名
        consigneeMobile: '', // 收货人手机号码
        addProvince: '',  // 收货地址-省
        addProvinceCode: '',  // 收货地址-省编码
        addCity: '',  // 收货地址-市
        addCityCode: '',  // 收货地址-市编码
        addCounty: '',  // 收货地址-县
        addCountyCode: '',  // 收货地址-县编码
        addTown: '',  // 收货地址-镇 (可空)
        addTownCode: '',  // 收货地址-镇编码 (可空)
        addDetail: '',  // 收货详细地址
        addresslabel: '', // 收货人关系标签 (可空),
        addressList: '', // 收货地址
        addressObj: [],
        iphoneNum: '', // 注册手机号码
        status: ''
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name != 'SetAddress') {
        window.sessionStorage.removeItem('iphoneNum')
        // window.sessionStorage.removeItem('pictureCode')
        // window.sessionStorage.removeItem('pirtureImg')
        // 离开这个页面,清空此页面所用值
        this.updateAddressInfo({
          consignee: '', // 收货人姓名
          consigneeMobile: '', // 收货人手机号码
          addProvince: '',  // 收货地址-省
          addProvinceCode: '',  // 收货地址-省编码
          addCity: '',  // 收货地址-市
          addCityCode: '',  // 收货地址-市编码
          addCounty: '',  // 收货地址-县
          addCountyCode: '',  // 收货地址-县编码
          addTown: '',  // 收货地址-镇 (可空)
          addTownCode: '',  // 收货地址-镇编码 (可空)
          addDetail: '',  // 收货详细地址
          addresslabel: '', // 收货人关系标签 (可空),
          addressNo: '',
          addDefault: ''
        })
      } else {
        window.sessionStorage.setItem('iphoneNum', this.iphoneNum)
        // window.sessionStorage.setItem('pictureCode', this.$refs.validCodeDom.$data.pictureCode)
        // window.sessionStorage.setItem('pirtureImg', this.$refs.validCodeDom.$data.pirtureImg)
      }
      next()
    },
    created () {
      this.showLoad(false)
      // this.qualityParameterShow()
      this.addressShow()
    },
    computed: {
      ...mapGetters({
        addressInfo: "getAddressInfo"
      })
    },
    components: {
      "valid-code": ValidCode
    },
    methods: {
      ...mapActions([
        "updateAddressInfo"
      ]),
      addressShow () {
        this.iphoneNum = window.sessionStorage.getItem('mobile')
        if (this.addressInfo.addressNo) {
          this.$store.state.route.meta.title = '编辑地址'
        } else {
          this.$store.state.route.meta.title = '新增地址'
        }
        let {consignee, consigneeMobile, addDetail, addresslabel} = this.addressInfo
        this.consignee = consignee
        this.consigneeMobile = consigneeMobile
        this.addDetail = addDetail
        this.addresslabel = addresslabel
        if (this.addressInfo.addProvince) {
          let {addProvince, addProvinceCode, addCity, addCityCode, addCounty, addCountyCode, addTown, addTownCode} = this.addressInfo
          this.addProvince = addProvince
          this.addProvinceCode = addProvinceCode
          this.addCity = addCity
          this.addCityCode = addCityCode
          this.addCounty = addCounty
          this.addCountyCode = addCountyCode
          this.addTown = addTown
          this.addTownCode = addTownCode
          this.addressList = addProvince+addCity+addCounty+addTown
        }
      },
      changeCount (val) {
        if (val != '') {
          this.addressObj = {
            consignee: this.consignee, // 收货人姓名
            consigneeMobile: this.consigneeMobile, // 收货人手机号码
            addDetail: this.addDetail,  // 收货详细地址
            addresslabel: this.addresslabel // 收货人关系标签 (可空),
          }
          this.updateAddressInfo(this.addressObj)
        }
      },
      bindEvent () {
        if (!this.checkAll($('#editListWrap'))) { return false }
        this.showLoad(true)
        this.status = ''
        let { uid, token, mobile } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.addreceiptaddress,
          data: {
            uid: uid,
            token: token,
            mobile: mobile,
            uname: mobile,
            // mobileValidCode: this.$refs.validCodeDom.$data.valideCode, // 注册手机号码短信验证码
            consignee: this.consignee,
            consigneeMobile: this.consigneeMobile,
            addProvince: this.addProvince,
            addProvinceCode: this.addProvinceCode,  // 收货地址-省编码
            addCity: this.addCity,  // 收货地址-市
            addCityCode: this.addCityCode,  // 收货地址-市编码
            addCounty: this.addCounty, // 收货地址-县
            addCountyCode: this.addCountyCode,  // 收货地址-县编码
            addTown: this.addTown,  // 收货地址-镇 (可空)
            addTownCode: this.addTownCode, // 收货地址-镇编码 (可空)
            addDetail: this.addDetail, // 收货详细地址
            addDefault: this.addressInfo.addDefault || 2, // 默认收货地址
            addressNo: this.addressInfo.addressNo || "", // 收货地址ID (修改必传,新增为空)
            addresslabel: this.addresslabel // 收货人关系标签 (可空)
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            window.history.go(-1)
          } else {
            this.status = res.status
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      qualityParameterShow () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.ParameterShow,
          data: {
            uid: uid,
            token: token,
            parameterType: 'addressLabel'
          }
        }).then(data => {
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'qualityParameterJson', res.data)
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
<style>
  .stick_main .inp{
    margin: 0;
    padding: 0.13333rem 0.4rem 0.13333rem 0.4rem;
  }
  .stick_main .inp:first-child{
    border-bottom: 1px solid #e2e2e2;
  }
  .stick_main .inp label{
    width: 1.53333rem;
    text-align: left;
  }
  .stick_main .inp p{
    border: none;
  }
  .stick_main .getYzm{
    margin-top: 0.18rem;
  }
  .qb_wrap{
    padding-bottom: 5rem;
  }
</style>
