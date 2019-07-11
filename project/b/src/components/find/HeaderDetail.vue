<template>
  <header class="head-cont flex position">
    <a class="findReturn cell_0" @click="backUrl"></a>
    <dl class="findUser cell_1 flex">
      <dt class="findUserImg cell_0">
        <img :src="findUser.avatar" alt="">
      </dt>
      <dd class="findUserInfo cell_1">
        <p class="findUserName">{{findUser.userName}}</p>
        <span class="findUserTime">{{findUser.releaseTime}}</span>
      </dd>
    </dl>
    <span class="findShare"  v-if="$store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 230"></span>
  </header>
</template>
<script type="text/javascript">
  export default {
    props: {
      findUser: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      backUrl () {
        // 分享出去的链接,返回首页
        if (!this.$store.state.route.from.name) {
          this.$router.push('/')
          return false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.head-cont{
  padding-left: 0;
  padding-right: .32rem;
  border: none;
  justify-content: space-between;
}
.head-cont .findReturn{
  width: 1.22667rem;
}
.right-icon{
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
  &>a{
    float: right;
    margin-right: .4rem;
  }
}
.findUser{
  display: flex;
  align-items: center;
}
.findUserImg{
  width: .85333rem;
  height: .85333rem;
  border-radius: .85333rem;
  margin-right: .26667rem;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
  }
}
.findUserName{
  color: #444;
  line-height: .53333rem;
  height: .53333rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.findUserTime{
  color: #999;
  line-height: .44rem;
  display: block;
}
.findReturn{
  background: url(//sxyp.sxfqsc.com/static/img/new-return.f088a25.png) .49333rem no-repeat;
  background-size: .24rem
}
.findShare{
  width: .58667rem;
  height: 100%;
  padding-right: .32rem;
  background: url(../../assets/icon/icon/find_share.png) left no-repeat;
  background-size: .58667rem .58667rem;
  display: block;
}
.findUser{
  overflow: hidden;
}
.findUserInfo{

}
</style>
