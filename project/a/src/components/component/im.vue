<template>
<div class="im-user">
  <slot></slot>
  <div class='im-content'>
    <div class="im-message">
      <p class="message-time">下午19:47</p>
      <div class="message-content message-left">
        <div class="message-content-avtal">
          <img src="../../assets/icon/logo.png" alt="">
        </div>
        <div class="message-content-main">
          <div class="main-type-normal">ssssss</div>
        </div>
      </div>
      <div class="message-content message-right">
        <div class="message-content-avtal">
          <img src="../../assets/icon/logo.png" alt="">
        </div>
        <div class="message-content-main">
          <div class="main-type-normal">ssssss</div>
        </div>
      </div>
    </div>
  </div>
  <div class="im-send-content">
    <div class="send-img">
      <div class="bg-btn emoj"></div>
      <div class="bg-btn img"></div>
      <div class="bg-btn record"></div>
      <div class="bg-btn delete"></div>
    </div>
    <pre class="send-content" contenteditable="true"></pre>
    <div class="send-btn">
      <span>发送</span>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    accountInfo: {}, // 账户信息
    userInfo: {}, // 当前会话用户信息
    hisMessageInfo: []
  },
  watch: {
    // 监听账户切换
    accountInfo: {
      handler (val) {
        this.onConnect()
      },
      deep: true
    },
    // 监听聊天对象切换
    userInfo: {
      handler (val) {
        this.getHisMessageByUser() // 切换聊天对象进行拉取历史消息
      },
      deep: true
    }
  },
  methods: {
    // 环信登录以及连接
    onConnect () {
      let _this = this
      this.$imconn.open(this.$imoption)
      this.$imconn.listen({
        onOpened: function (res) {
          console.log('用户已上线')
          _this.createMessageBody()
        },
        onTextMessage (res) {
          console.log('收到文本消息', res)
        },
        onClosed: function (message) {}, // 连接关闭回调
        onEmojiMessage: function (message) {}, // 收到表情消息
        onPictureMessage: function (message) {}, // 收到图片消息
        onAudioMessage: function (message) {}, // 收到音频消息
        onLocationMessage: function (message) {}, // 收到位置消息
        onFileMessage: function (message) {}, // 收到文件消息
        onVideoMessage: function (message) {
          // var node = document.querySelector('.privateVideo')
          // var option = {
          //   url: message.url,
          //   headers: {
          //     'Accept': 'audio/mp4'
          //   },
          //   onFileDownloadComplete: function (response) {
          //     // let objectURL = WebIM.utils.parseDownloadResponse.call(conn, response)
          //     // node.src = objectURL
          //   },
          //   onFileDownloadError: function () {
          //     console.log('File down load error.')
          //   }
          // }
          // WebIM.utils.download.call(conn, option)
        }, // 收到视频消息
        onOnline: function () {}, // 本机网络连接成功
        onOffline: function () {}, // 本机网络掉线
        onError: function (message) {}, // 失败回调
        onReceivedMessage: function (message) {}, // 收到消息送达服务器回执
        onDeliveredMessage: function (message) {}, // 收到消息送达客户端回执
        onReadMessage: function (message) {} // 收到消息已读回执
      })
    },
    // 创建消息体
    createMessageBody (messageType, toId = 'wetest005', content = 'sdaasda', expand = {}) {
      let msgId = this.$imconn.getUniqueId() // 创建消息id
      let deliverMessage = new WebIM.message(messageType, msgId)
      deliverMessage.set(Object.assign({
        id: msgId, // 消息id
        to: toId, // to对方id
        msg: content, // 消息内容
        success (res) {
          console.log('发送成功')
          this.$emit('bindMessageCallback', res) // 收发消息告知父组件，父组件需要去处理会话框。可添加type消息类型进行拓展
        }
      }, expand))
      deliverMessage.body.chatType = 'singleChat'
      this.$imconn.send(deliverMessage.body)
    },
    // 根据聊天对象拉取历史消息
    getHisMessageByUser () {
      this.$imconn.fetchHistoryMessages({
        queue: '对方用户名id',
        isGroup: false, // 是否为群组
        success (res) {
          this.$emit('bindMessageCallback', res) //
        },
        fail (res) {
        }
      })
    }
  },
  created () {
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/_flex.scss';
$color: #5584FF;
 .im-user{
  .im-content{
    height: 606px;
    padding: 20px;
    border-bottom: 1px solid #F0F0F0;
    border-left: 1px solid #F0F0F0;
    border-right: 1px solid #F0F0F0;
    .im-message{
      .message-time{
        color: #999;
        font-size: 12px;
        text-align: center;
        margin-top: 15px;
      }
      .message-content{
        @include display-flex();
        .message-content-avtal{
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .message-content-main{
          position: relative;
          max-width: 300px;
          padding: 10px 12px;
          border-radius: 5px;
          .main-type-normal{
            color: #333;
            font-size: 14px;
          }
        }
        &.message-left{
          @include flex-direction();
          .message-content-main{
            margin-left: 20px;
            border: 1px solid #E5E5E5;
            &:before{
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              left: -9px;
              top: 5px;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-right:8px solid #E5E5E5;
            }
            &:after{
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              left: -8px;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-right:8px solid #fff;
              top: 5px;
            }
          }
        }
        &.message-right{
          @include flex-direction(row-reverse);
          .message-content-main{
            background: #FFF1D9;
            border: 1px solid #FFF1D9;
            margin-right: 20px;
            &:before{
              width: 0;
              height: 0;
              content: '';
              position: absolute;
              right: -9px;
              top: 5px;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-left:8px solid #FFF1D9;
            }
          }
        }
      }
    }
  }
  .im-send-content{
    height: 180px;
    border-left: 1px solid #F0F0F0;
    border-right: 1px solid #F0F0F0;
    .send-img{
      padding-left: 20px;
      padding-top: 20px;
      height: 30px;
      @include display-flex();
      @include align-items(center);
      .bg-btn{
        margin-right: 18px;
        cursor: pointer;
      }
      .emoj{
        width: 20px;
        height: 20px;
        background: url('../../assets/icon/expression_icon.png') no-repeat;
        background-size: 20px auto;
      }
      .img{
        width: 19px;
        height: 17px;
        background: url('../../assets/icon/pic_icon.png') no-repeat;
        background-size: 19px auto;
      }
      .record{
        width: 14px;
        height: 18px;
        background: url('../../assets/icon/yy_icon.png') no-repeat;
        background-size: 14px auto;
      }
      .delete{
        width: 16px;
        height: 16px;
        background: url('../../assets/icon/sc_icon.png') no-repeat;
        background-size: 16px auto;
      }
    }
    .send-content{
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-top: 8px;
      width: 100%;
      height: 56px;
      padding: 0px 19px 0px 19px;
      background-color: #fff;
      color: #252525;
      font-size: 13px;
      font-family: inherit;
      word-break: break-all;
      white-space: normal;
      overflow-y: auto;
    }
    .send-btn{
      margin-top: 10px;
      text-align: right;
      padding-right: 20px;
      span{
        width:60px;
        height:25px;
        background:linear-gradient(302deg,rgba(255,165,45,1) 0%,rgba(252,198,25,1) 100%);
        border-radius:4px;
        line-height: 25px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>
