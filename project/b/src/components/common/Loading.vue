<template>
   <transition name="loading">
     <div class="loading" v-show="$store.state.loading.isShowLoadFlag">
        <!-- <div class="loadProcess"></div> -->
        <div class="loading-box">
          <span class="loading-icon"></span>
            <!-- <p class="circle-list">
              <span class="circle cirlce1"></span>
              <span class="circle cirlce2"></span>
              <span class="circle cirlce3"></span>
            </p> -->
        </div>
     </div>
   </transition>
</template>
<script type="text/javascript">
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        loadInfo: "getLoadInfo"
      })
    }
  }
</script>
<style media="screen" scoped>
  .loading{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    transition: all .2s cubic-bezier(0.18, 0.65, 1, 1);
    -webkit-transition: all .2s cubic-bezier(0.18, 0.65, 1, 1);
  }
  /* .loadProcess{
    width: 3.335rem;
    height: 3.335rem;
    background: url('../../assets/icon/icon/loading.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 15px;
    transform: translate3d(-50%, -50%, 0);
    -webkit-transform: translate3d(-50%, -50%, 0);
  }
  .loading-enter-active, .loading-leave-active {

   }
   .loading-enter, .loading-leave-active {
    opacity: 0;
  } */
  .loading .loading-box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1.33333rem;
    height: 1.33333rem;
    border-radius: 10px;
    /* background-color: rgb(0,0,0); */
    transform: translate3d(-50%, -50%, 0);
    -webkit-transform: translate3d(-50%, -50%, 0);
    opacity: 0.7;
}
.loading .loading-box .loading-icon {
    display: block;
    width: 1.33333rem;
    height: 1.33333rem;
    background: url('../../assets/icon/icon/loading.gif') center center no-repeat;
    background-size: 100% 100%;
    /* margin: .96rem auto 0 */
}
.loading .loading-box .circle-list {
    text-align: center;
    margin-top: -0.4rem;
}
.loading .loading-box .circle-list span {
    display: inline-block;
    width: .146rem;
    height: .146rem;
    background-color: #828282;
    border-radius: 50%;
    margin-left: .13rem
}
.cirlce1 {
  margin-left: 0;
  -webkit-animation: 1s animate-cirlce ease-in-out infinite;
  animation: 1s animate-cirlce ease-in-out infinite
}
.cirlce2 {
    -webkit-animation: 1s animate-cirlce ease-in-out infinite;
    animation: 1s animate-cirlce ease-in-out infinite;
    animation-delay: .5s;
    -webkit-animation-delay: .5s
}
.cirlce3 {
    -webkit-animation: 1s animate-cirlce ease-in-out infinite;
    animation: 1s animate-cirlce ease-in-out infinite;
    animation-delay: 1s;
    -webkit-animation-delay: 1s
}
@-webkit-keyframes animate-cirlce {
    0% {
        background-color: #fff
    }
    to {
        background: #828282
    }
}

@keyframes animate-cirlce {
    0% {
        background-color: #fff
    }
    to {
        background: #828282
    }
}
</style>
