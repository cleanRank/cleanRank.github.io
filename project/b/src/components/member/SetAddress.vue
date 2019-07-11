<template>
  <section>
    <ul class="address_list">
      <li class="js_addr_item" v-for="item in saveressList" :key="item.id" @click="getAddress(item)">{{item.areaName}}</li>
    </ul>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        saveressList: '',
        selectObj: [],
        superareaid: '',
        receivFlag: 0
      }
    },
    created () {
      this.showLoad(false)
      this.saveAddrSelect()
    },
    computed: {
      ...mapGetters({
        addressInfo: "getAddressInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateAddressInfo"
      ]),
      saveAddrSelect () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.setreceivingaddress,
          data: {
            uid: uid,
            token: token,
            superareaId: this.superareaid || 0
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'saveressList', res.data)
          } else if (res.status == '11') {
            window.history.go(-1)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      getAddress (items) {
        this.showLoad(true)
        this.superareaid = items.areaId
        this.receivFlag++
        switch (this.receivFlag) {
          case 1:
            this.selectObj.addProvince = items.areaName
            this.selectObj.addProvinceCode = items.areaId
            this.selectObj.addCity = ""
            this.selectObj.addCityCode = ""
            this.selectObj.addCounty = ""
            this.selectObj.addCountyCode = ""
            this.selectObj.addTown = ""
            this.selectObj.addTownCode = ""
            break
          case 2:
            this.selectObj.addCity = items.areaName
            this.selectObj.addCityCode = items.areaId
            this.selectObj.addCounty = ""
            this.selectObj.addCountyCode = ""
            this.selectObj.addTown = ""
            this.selectObj.addTownCode = ""
            break
          case 3:
            this.selectObj.addCounty = items.areaName
            this.selectObj.addCountyCode = items.areaId
            this.selectObj.addTown =""
            this.selectObj.addTownCode = ""
            break
          case 4:
            this.selectObj.addTown = items.areaName
            this.selectObj.addTownCode = items.areaId
            break
          case 5:
            break
        }
        this.updateAddressInfo(this.selectObj)
        this.saveAddrSelect()
      }
    }
  }
</script>
