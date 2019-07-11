<template>
  <section class="confirm_order progress_boxs">
    <p class="as_title_box progress_title bg mar16">进度详情</p>
    <div id="logisticsContainer">
      <ul class="logistics_box">
        <li class="logistics_list flex" :class="[index==0&&progressLogList.status==3?'red_boxs':'', index==0&&progressLogList.status!=3?'lv_boxs':'']" v-for="(item, index) in progressLogList" :key="index">
          <p class="circular_b cell_0">
            <b v-if="index==0" class="yuan_b current_new">&nbsp;</b>
            <b v-else class="yuan_b">&nbsp;</b>
          </p>
          <p class="logistics_inform cell_0">
            <span class="address_span" >{{item.statusDesc}}</span>
            <b class="time_b">{{item.createDate}}</b>
          </p>
        </li>
      </ul>
    </div>
  </section>

</template>
<script>
  export default {
    data () {
      return {
        progressLogList: []
      }
    },
    created () {
      this.showList()
    },
    methods: {
      showList () {
        // 查询进度列表
        let {uid, token} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.progressDetail,
          data: {
            uid,
            token,
            serviceOrderId: this.$route.query.serviceOrderId || ''
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'progressLogList', res.data.progressLogList)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      }
    }
  }
</script>
