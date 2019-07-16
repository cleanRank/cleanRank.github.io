<template>
  <div class="im-user">
    <slot></slot>
    <div class='im-content' id="im-content">
      <div class="im-message" >
        <p class="message-time">下午19:47</p>

        <div class="message-content " v-for="(item,idx) in messageList" :key="idx" :class="{'message-right' : item.from == myUserId,'message-left':item.from != myUserId}">
          <div class="message-content-avtal">
            <img src="../../assets/icon/logo.png" alt="">
          </div>
          <div class="message-content-main">
            <div class="main-type-normal" v-html="item.data" v-if="item.messageType=='txt'">{{item.data}}</div>
            <div class="main-type-normal" v-if="item.messageType=='image'">
              <img :src="item.url" alt="">
            </div>
            <div class="read-status" v-if="item.from == myUserId">未读</div>
          </div>
        </div>
        <div class="message-content message-left" v-if="false">
          <div class="message-content-avtal">
            <img src="../../assets/icon/logo.png" alt="">
          </div>
          <div class="message-content-main packet">
            <div class="red-packet">
              <table class="mask" v-if="false"></table>
              <table></table>
              <div class="info">
                <img src="../../assets/img/gold-packet.png" alt="">
                <div>
                  <p class="title">恭喜发财，大吉大利</p>
                  <p class="open">查看红包</p>
                </div>
              </div>
              <div class="name">红包</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="im-send-content">
      <div class="send-img">
        <div class="bg-btn emoj" @click="emjoiPannel = !emjoiPannel">
        </div>
        <ul class="emoj-pannel" v-if="emjoiPannel">
          <li v-for="(item,idx) in emjoi" :key="idx" @click="selectEmjoi($event,item.value)">{{item.value}}</li>
        </ul>
        <label class="bg-btn img" for="image">
          <input type="file" class="file" accept="image/*" id="image" style="width:0;height:0;font-size:0;" @change="change">
        </label>
        <div class="bg-btn record" @click="audioCall"></div>
        <div class="bg-btn delete"></div>
      </div>
      <pre class="send-content" id="send-content" contenteditable="true">{{inputContent}}</pre>
      <div class="send-btn">
        <span @click="send">发送</span>
        <!--<span @click="register">注册</span>-->
      </div>
    </div>
  </div>
</template>
<script>
import emjoi from 'lib/emjoi'
// import WebIM  from '../../lib/im_test/WebIM'
import { Message } from 'element-ui'

export default {
  props: {
    accountInfo: {}, // 账户信息
    userInfo: {}, // 当前会话用户信息
    hisMessageInfo: []
  },
  data () {
    return {
      emjoiPannel: false,
      inputContent: '',
      emjoi,
      messageList: [],
      myUserId: '',
      imageFile: ''
    }
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
  created () {
    // this.getHisMessageByUser()
    var me = this
  },
  mounted () {
    // this.initCall()
  },
  beforeDestroy () {
    WebIM.conn.close()
  },
  methods: {
    audioCall() {
      console.log("sendWrapper::callVoice", WebIM.conn.context.userId/*当前登录用户*/, this.userInfo/*聊天对象*/, WebIM/*当前标签*/,WebIM.call)
      console.log(WebIM.call.makeVoiceCall)

      WebIM.call.caller = WebIM.conn.context.userId + ''

      WebIM.call.makeVoiceCall(this.userInfo + '',WebIM.conn)
    },
    initCall() {

    },
    selectEmjoi (e, val) {
      e.stopPropagation()
      this.inputContent += val
    },
    change (e) {
      // let blob = e.target.files[0]
      // let url = window.URL.createObjectURL(blob)
      // let obj = {
      //   file: { data: blob, url },
      //   apiUrl: WebIM.config.apiURL
      // }
      var input = document.getElementById('image') // 选择图片的input
      var file = WebIM.utils.getFileUrl(input) // 将图片转化为二进制文件
      var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true
      }
      if (file.filetype.toLowerCase() in allowType) {
        let extOption = {
          apiUrl: WebIM.config.apiURL,
          file,
          flashUpload: WebIM.flashUpload
        }
        this.sendMessage('img', '', extOption)
      }
    },
    sendMessage (type = 'txt', msg = '', extOption = {}) {
      let _this = this
      let msgId = WebIM.conn.getUniqueId()
      let deliverMessage = new WebIM.message(type, msgId)
      let message = {
        id: msgId,
        to:_this.userInfo,
        msg,
        roomType: true,
        ext: {
          avatar: '',
          nickName: ''
        },
        ...extOption
      }
      deliverMessage.set({
        ...message,
        success (res) {
          console.log('发送成功', res)
          document.getElementById('send-content').innerHTML = ''
          document.getElementById('image').value = ''
          // 测试
          message.data = message.msg
          message.from = localStorage.getItem('userId')
          message.messageType = type
          _this.pushMessage(type, message)
          // 测试
          console.log(message)
          _this.getHisMessageByUser()
        },
        fail (res) {
          console.log(res)
        }
      })
      // deliverMessage.body.chatType = 'singleChat'
      WebIM.conn.send(deliverMessage.body)
    },
    send () {
      let ele = document.getElementById('send-content').innerHTML
      if (this.userInfo) {
        this.sendMessage('txt', ele)

      } else {
        Message.error('未选择聊天对象')

      }
    },
    register () {
      // var options = {
      //   username: 'username',
      //   password: 'password',
      //   nickname: 'nickname',
      //   appKey: WebIM.config.appkey,
      //   // accessToken:'1',
      //   success: function (res) {
      //     console.log(res)
      //   },
      //   error: function (err) {
      //     console.log(err)
      //   },
      //   apiUrl: WebIM.config.apiURL
      // };
      // console.log('reg')
      //   this.$imconn.registerUser(options);
    },
    pushMessage (type='ext', message) {
      message.messageType = type
      this.messageList.push(message)
      var bodyId = message.id // 需要发送已读回执的消息id
      var msg = new WebIM.message('read', bodyId)
      msg.set({
        id: bodyId,
        to: message.from
      })
      this.$imconn.send(msg.body)
      this.$nextTick(() => {
        let ele = document.getElementById('im-content')
        ele.scrollTop = ele.scrollHeight
      })
    },
    // 环信登录以及连接
    reconnect () {
      let _this = this
      console.log(this.$imoption)
      WebIM.conn.open(this.$imoption)
      WebIM.conn.listen({
        onOpened: function (res) {
          console.log('用户已上线==>', res)
          _this.initCall()
          _this.myUserId = localStorage.getItem('userId')
          _this.getHisMessageByUser()
          // _this.createMessageBody()
        },
        onTextMessage (res) {
          console.log('收到文本消息==>', res)
          // _this.pushMessage('txt',res)
          _this.pushMessage('txt', res)
          console.log(_this.messageList, '123123')
        },
        onClosed: function (res) {
          console.log('连接已关闭==>', res)
        }, // 连接关闭回调
        onEmojiMessage: function (message) {
          console.log('收到表情消息==>', message)
        }, // 收到表情消息
        onPictureMessage: function (message) {
          console.log('收到图片消息==>', message)
          _this.pushMessage('image', message)
        }, // 收到图片消息
        onAudioMessage: function (message) {
          console.log('收到音频消息==>', message)
        }, // 收到音频消息
        onLocationMessage: function (message) {
          console.log('收到位置消息==>', message)
        }, // 收到位置消息
        onFileMessage: function (message) {
          console.log('收到文件消息==>', message)
        }, // 收到文件消息
        onVideoMessage: function (message) {
          console.log('收到视频消息==>', message)
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
        onOnline: function () {
        }, // 本机网络连接成功
        onOffline: function () {
        }, // 本机网络掉线
        onError: function (message) {
        }, // 失败回调
        onReceivedMessage: function (message) {
          console.log('收到消息送达服务器回执==>', message)
        }, // 收到消息送达服务器回执
        onDeliveredMessage: function (message) {
          console.log('收到消息送达客户端回执==>', message)
        }, // 收到消息送达客户端回执
        onReadMessage: function (message) {
          console.log('收到消息已读回执==>', message)
        } // 收到消息已读回执
      })
    },
    onConnect () {
      // WebIM.conn &&WebIM.conn.close&& WebIM.conn.close()
      setTimeout(() => {
        this.reconnect()
        // this.testConnect()
      }, 1000)
    },
    testConnect() {
      console.log(this.$imoption)

      let _this = this
      WebIM.conn.listen({
        onOpened: function (res) {
          console.log('用户已上线==>', res)
          // _this.initCall()
          _this.myUserId = localStorage.getItem('userId')
          _this.getHisMessageByUser()
          // _this.createMessageBody()
        },
        onTextMessage (res) {
          console.log('收到文本消息==>', res)
          // _this.pushMessage('txt',res)
          _this.pushMessage('txt', res)
          console.log(_this.messageList, '123123')
        },
      })
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: this.$imoption.user.trim().toLowerCase(),
        pwd: this.$imoption.pwd,
        //  accessToken: password,
        appKey: WebIM.config.appkey,
        success(res) {
          console.log(res)
          // let I18N = store.getState().i18n.translations[store.getState().i18n.locale]
          // message.success(I18N.loginSuccessfully, 1)
          //
          // dispatch(Creators.setLoginToken(username, token.access_token))
          // dispatch(Creators.setLoginSuccess(username))

        },
        error: e => {
        }
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
      // this.$imconn.fetchHistoryMessages({
      //   queue: '49',
      //   count: 20,
      //   // isGroup: false, // 是否为群组
      //   success (res) {
      //     console.log(res, '历史消息==>')
      //     this.$emit('bindMessageCallback', res) //
      //   },
      //   fail (res) {
      //   }
      // })
    }
  }

}
</script>
<style lang="scss">
  @import '../../assets/scss/_flex.scss';

  $color: #5584FF;
  .im-user {
    .im-content {
      height: 606px;
      padding: 20px;
      border-bottom: 1px solid #F0F0F0;
      border-left: 1px solid #F0F0F0;
      border-right: 1px solid #F0F0F0;
      overflow-y: scroll;
      .im-message {
        .message-time {
          color: #999;
          font-size: 12px;
          text-align: center;
          margin-top: 15px;
        }

        .message-content {
          margin-top: 20px;
          @include display-flex();

          .message-content-avtal {
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }

          .message-content-main {
            position: relative;
            max-width: 300px;
            padding: 10px 12px;
            border-radius: 5px;
            &.packet{
              position: relative;
              .mask{
                position: absolute;
                width:105%;
                height:100%;
                background: #fff;
                opacity: .5;
                top:0;
                left:-10px;
                z-index: 99;
              }
              .info{
                height:36px;
                margin-top: 12px;
                margin-bottom: 12px;
                display: flex;
                >img{
                  height:36px;
                  width:30px;
                  margin-left: 15px;
                  margin-right: 15px;
                }
                .title{
                  font-size:14px;
                  color:#fff;
                }
                .open{
                  font-size:12px;
                  color:#f0f0f0;

                }
              }
              .name{
                height:20px;
                background: #fff;
                font-size:12px;
                line-height: 20px;
                padding-left: 15px;
                color:#999;
              }
            }
            .main-type-normal {
              color: #333;
              font-size: 14px;
              >img{
                width:200px;
                height:200px;
              }
            }
            .red-packet{
              width:235px;
              height:80px;
            }
          }

          &.message-left {
            @include flex-direction();

            .message-content-main {
              margin-left: 20px;
              border: 1px solid #E5E5E5;
              position: relative;
              &.packet{
                padding:0;
                background: #E6494F!important;
                &:before{
                  border-right: 8px solid #E6494F;
                }
                &:after{
                  border-right: 8px solid #E6494F;
                }
              }
              &:before {
                content: '';
                width: 0;
                height: 0;
                position: absolute;
                left: -8px;
                top: 5px;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 8px solid #E5E5E5;
              }

              &:after {
                content: '';
                width: 0;
                height: 0;
                position: absolute;
                left: -8px;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 8px solid #fff;
                top: 5px;
              }
            }
          }

          &.message-right {
            @include flex-direction(row-reverse);

            .message-content-main {
              background: #FFF1D9;
              border: 1px solid #FFF1D9;
              margin-right: 20px;
              .read-status{
               position: absolute;bottom:-20px;right:10px;font-size:12px;color:#FEAF27
              }
              &.packet{
                padding:0;
                background: #E6494F!important;
                &:before{
                  border-left: 8px solid #E6494F;
                }
                &:after{
                  border-left: 8px solid #E6494F;
                }
              }
              &:before {
                width: 0;
                height: 0;
                content: '';
                position: absolute;
                right: -8px;
                top: 5px;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 8px solid #FFF1D9;
              }
            }
          }
        }
      }
    }

    .im-send-content {
      height: 180px;
      border-left: 1px solid #F0F0F0;
      border-right: 1px solid #F0F0F0;

      .send-img {
        padding-left: 20px;
        padding-top: 20px;
        height: 30px;
        @include display-flex();
        @include align-items(center);
        position: relative;

        .bg-btn {
          margin-right: 18px;
          cursor: pointer;
        }

        .emoj {
          width: 20px;
          height: 20px;
          background: url('../../assets/icon/expression_icon.png') no-repeat;
          background-size: 20px auto;

        }
        ul.emoj-pannel{
            position: absolute;
            display: flex;
            width:500px;
            height:200px;
            /*border:1px solid black;*/
            top:-230px;
            flex-wrap: wrap;
            li{
              width:30px;
            }
          }
        .img {
          width: 19px;
          height: 17px;
          background: url('../../assets/icon/pic_icon.png') no-repeat;
          background-size: 19px auto;
        }

        .record {
          width: 14px;
          height: 18px;
          background: url('../../assets/icon/yy_icon.png') no-repeat;
          background-size: 14px auto;
        }

        .delete {
          width: 16px;
          height: 16px;
          background: url('../../assets/icon/sc_icon.png') no-repeat;
          background-size: 16px auto;
        }
      }

      .send-content {
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

      .send-btn {
        margin-top: 10px;
        text-align: right;
        padding-right: 20px;

        span {
          width: 60px;
          height: 25px;
          background: linear-gradient(302deg, rgba(255, 165, 45, 1) 0%, rgba(252, 198, 25, 1) 100%);
          border-radius: 4px;
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
