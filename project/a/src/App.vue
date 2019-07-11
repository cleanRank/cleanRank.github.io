<template>
  <section class="maxHeight" >
    <el-row class="app-row"  v-if="noUseCommonHeader">
      <div class="left-content" :class="{'isCollapse': isCollapse}">
        <leftMenu />
      </div>
      <div class="right-content" :class="{'isCollapse': isCollapse}" v-loading="isLoading">
        <headBar/>
        <router-view class="main-content" />
      </div>
    </el-row>
    <el-row class="app-row"  v-else v-loading="isLoading">
      <div class="unCommon">
        <router-view/>
      </div>
    </el-row>
  </section>
</template>

<script>
import leftMenu from '@/components/component/leftMenu'
import headBar from '@/components/component/headBar'
import { mapState, mapActions } from 'vuex'
import {
  tracker
} from 'lib/analytics'
export default {
  name: 'App',
  data () {
    return {
      supplierInfo: {}
      // isdisabled: false
    }
  },
  computed: {
    ...mapState({
      leftMenuIsShow: state => state.globelData.leftMenuIsShow,
      topBarIsShow: state => state.globelData.topBarIsShow,
      isCollapse: state => state.config.isCollapse,
      isLoading: state => state.config.isLoading
    }),
    noUseCommonHeader () {
      return this.$route.meta.unCommon
    }
  },
  components: {
    leftMenu,
    headBar
  },
  methods: {
    ...mapActions([
      'updateCollapse',
      'updateIsLoading',
      'updateClientWidth'
    ]),
    checkClientWidth () {
      let width = document.documentElement.clientWidth
      let isCollapse = width < 1000
      this.updateCollapse(isCollapse)
      this.updateClientWidth(width)
    }
  },
  created () {
    console.log(11)
    if (tracker.getToken()) {
    }
    this.checkClientWidth()
    window.onresize = () => {
      this.checkClientWidth()
    }
  }
}

</script>
<style lang="scss">
 @import './assets/scss/aggregate';
  .maxHeight {
    height: 100%;
    background: #F6F6F6;

    .el-row.app-row {
      height: 100%;
    }
    .unCommon{
      height: 100%;
    }

    .left-content {
      height: 100%;
      background: #fff;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      transition: width .3s ease-in-out;
      -webkit-transition: width .3s ease-in-out;
      -moz-transition: width .3s ease-in-out;
      width: 240px;
      &.isCollapse{
        width: 64px;
      }
    }

    .right-content {
      height: 100%;
      transition: margin-left .3s ease-in-out;
      -webkit-transition: margin-left .3s ease-in-out;
      -moz-transition: margin-left .3s ease-in-out;
      margin-left: 240px;
      &.isCollapse{
        margin-left: 64px;
      }
      .main-content{
        padding-left: 20px;
        padding-bottom: 20px;
      }
    }
    .ml-0{
      margin-left: 0;
    }
    .clearfix {
      zoom:1;
      overflow: hidden;
    }
    .clearfix:after {
      clear:both;
      content:"";
      display:block;
      height:0;
    }
  }
</style>
