<template>
<ModelSeven :productFloor="productFloor"></ModelSeven>
</template>
<script>
  export default {
    name: 'findIndex',
    data () {
      return {
        productFloor: []
      }
    },
    created () {
      this.showLoad(false)
      this.findlistshow().then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, 1)
          window.scrollTo(0, 0)
        })
      })
    },
    beforeRouteEnter (to, from, next) {
      document.querySelector('body').style.background = '$bgColor'
      document.querySelector('html').style.background = '$bgColor'
      next()
    },
    methods: {
      findlistshow () {
        let { uid, token, mobile } = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.QueryDiscoveryBanner,
          data: {
            uid,
            token,
            mobile
          }
        }).then(data => {
          let res = data.data
          if (res.status === "1") {
            this.$set(this.$data, 'productFloor', res.data)
          } else {
//            this.showToast({msg: res.statusDetail})
          }
        })
      }
    },
    components: {
      'ModelSeven': resolve => { require(['components/common/floorLayOut/ModelSeven'], resolve) }
    }
  }
</script>
