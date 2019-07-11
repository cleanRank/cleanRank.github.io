<template>
<section>
    <ModelTwentyTwo :productFloor="list"></ModelTwentyTwo>
</section>
</template>
<script>
import ModelTwentyTwo from 'components/common/floorLayOut/ModelTwentyTwo' // 22楼
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      list: {}
    }
  },
  created () {
    this.getFloor()
  },
  components: {
    ModelTwentyTwo
  },
  methods: {
    getFloor () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.ActiveTemplateNew,
        data: {
          uid,
          token,
          versionId: this.$store.state.route.query.versionId
        }
      }).then(data => {
        let res = data.data
        if (res.status === "1") {
          console.log(2)
          for (let i in res.data.listFloor) {
            if (res.data.listFloor[i].floorType=='22') {
              this.list = res.data.listFloor[i].listFloorDetail
            }
          }
        }
        setTimeout(() => {
          this.isLoding = true
          this.showLoad(false)
        }, 1000)
      })
    }
  }
}
</script>
