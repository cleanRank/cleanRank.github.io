<template>
  <section class="confirm_order logistics_boxs">
    <p class="info_p order_num fir_info">
      {{$store.state.route.query.type==4?'售后单号：':'订单编号：'}}<b class="l_b orderid_span">{{orderId}}</b>
    </p>
    <div v-if="express!=''||logisticCode!=''">
      <p class="info_p">
        物流公司：<b class="l_b express_span">{{express}}</b>
      </p>
      <p class="info_p order_num" :class="{'last_info': !expressPhone}" style="border: none">
        快递单号：<b class="l_b logisticCode_span">{{logisticCode}}</b>
      </p>
      <p class="info_p last_info" v-if="expressPhone">
        快递电话：<span v-if="($store.state.config.fromChannel == 'sxypApp' && isIos && +($store.state.config.ver.replace(/\./g, '')) < 240)" class="logistics_tel bgNone">{{expressPhone}}</span><a v-else :href="'tel:'+expressPhone" class="logistics_tel">{{expressPhone}}</a>
      </p>
    </div>
    <p v-else style="padding-top: 0.26667rem; background: #fff"></p>
    <div id="logisticsContainer">
      <ul class="logistics_box" v-if="hasInfo && hasLoading">
        <li class="logistics_list flex" v-for="(item, index) in logisticData" :key="index">
          <p class="circular_b cell_0">
            <b v-if="index==0" class="yuan_b current_new">&nbsp;</b>
            <b v-else class="yuan_b">&nbsp;</b>
          </p>
          <p class="logistics_inform cell_0">
            <span class="address_span">{{item.content}}</span>
            <b class="time_b">{{item.msgTime}}</b>
          </p>
        </li>
      </ul>
    </div>
  </section>

</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { is_android } from 'lib/until'
  export default {
    data () {
      return {
        orderId: this.$store.state.route.query.orderId,
        fansId: this.$store.state.route.query.fansId || '',
        express: '',
        logisticCode: '',
        logisticData: [],
        hasInfo: true,
        hasLoading: false,
        expressPhone: '' // 物流电话
      }
    },
    created () {
      this.showList()
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      }),
      isIos () {
        if (is_android()) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      ...mapActions([
        "updateUserInfo"
      ]),
      showList () {
        let url = this.fansId ? this.$store.state.api.OrderTrack4fans:this.$store.state.api.OrderTrack
        this.$post({
          url,
          data: {
            uid: this.userInfo.uid,
            token: this.$store.state.userInfo.token,
            orderId: this.$store.state.route.query.orderId,
            fansId: this.$store.state.route.query.fansId || '',
            type: this.$store.state.route.query.type ||''
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status === "1") {
            this.$set(this.$data, 'express', res.express)
            this.$set(this.$data, 'logisticCode', res.logisticCode)
            this.$set(this.$data, 'logisticData', res.data)
            this.$set(this.$data, 'hasLoading', true)
            this.$set(this.$data, 'expressPhone', res.expressPhone)
          } else {
            this.showToast({msg: res.statusDetail})
            this.$set(this.$data, 'hasInfo', false)
            this.$set(this.$data, 'hasLoading', true)
          }
        })
      }
    }
  }
</script>
