<template>
  <header class="position flex new-index-header">
    <div class="cell_0 return" @click="backWk()" v-if="$store.state.config.fromChannel=='syApp' && !$store.state.config.terminalType"></div>
    <div class="new-index-search" :class="{'margin-left-0': $store.state.config.fromChannel=='syApp' && !$store.state.config.terminalType}">
      <span class="new-index-search-icon"></span>
      <input type="text" :placeholder="indexHotWord" class="new-index-search-key" autocomplete="off" @click="onFocusHandler">
    </div>
    <router-link tag="div" to="/notificationMessage" class="message-status">
      <span class="msg_num " v-if="getMsgNum" :class="{'msgNumTwo': getMsgNum > 9}">{{getMsgNum}}</span>
    </router-link>
  </header>
</template>
<script type="text/javascript">
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        searchPlaceholder: "",
        defaultPlaceholder: "请输入搜索内容",
        msgNum: 0
      }
    },
    props: {
      indexHotWord: {
        required: true,
        type: String
      }
    },
    methods: {
      ...mapActions([
        "queryMessageNum"
      ]),
      onFocusHandler: function (e) {
        this.$router.push('/search')
        window.sessionStorage.removeItem('productName')
      },
      backWk () {
        let {fromChannel, terminalType} = this.$store.state.config
        if (fromChannel == 'syApp' && !terminalType) {
          window.location.href = process.env.SXFQURL['INDEX']
        }
      },
      // 获取未读消息数量
      getMessageNum () {
        if (this.$store.state.userInfo.token && this.$store.state.userInfo.uid) {
          return this.queryMessageNum()
            .then(({data: res}) => {
              if (res.status === "1") {
                this.msgNum = parseFloat(res.data)
              } else {
                this.showToast({
                  msg: res.statusDetail
                })
              }
            })
        }
      }
    },
    computed: {
      placeholder () {
        return this.searchPlaceholder?this.searchPlaceholder:this.defaultPlaceholder
      },
      getMsgNum () {
        if (this.msgNum >= 99) {
          return 99
        } else {
          return this.msgNum
        }
      }
    },
    created () {
      if (this.$store.state.userInfo.loginTokenWanKaState === 2) {
        this.getMessageNum()
      } else {
        this.$store.watch(state => {
          return state.userInfo.loginTokenWanKaState
        }, (loginState) => {
          loginState === 2 && this.getMessageNum()
        })
      }
    }
  }
</script>
