<template>
  <div class="im-user">
    <slot></slot>
    <div class='im-content' id="im-content">
      <div class="im-message">
        <p class="message-time">{{new Date().getTime() | dataToTime }}</p>

        <div class="message-content " v-for="(item,idx) in messageList" :key="idx"
             :class="{'message-right' : item.from == myUserId,'message-left':item.from != myUserId}">
          <div class="message-content-avtal">
            <img :src="item.ext.avatar||head" alt="">
          </div>
          <div class="message-content-main" :class="{'packet':item.messageType=='packet'}">
            <!--文字-->
            <div class="main-type-normal"
                 v-html="item.data.replace(/\[[^\[]+\]/g,getIconUrl)"
                 v-if="item.messageType=='txt'"></div>
            <!--位置-->
            <div class="msg-position" style="width:200px;height:100px;" v-if="item.messageType == 'pos'">
              <div :id="item.id" style="width:200px;height:100px;"></div>
            </div>
            <!--图片-->
            <div class="main-type-normal" v-if="item.messageType=='img'">
              <img :src="item.url" alt="">
            </div>
            <!--红包-->
            <div class="red-packet" v-if="item.messageType=='packet'" @click="openPacket(item)">
              <table class="mask" v-if="item.openStatus"></table>
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
            <!--音频-->

            <div class="audio" style="width:100px;height:100%;position: relative" v-if="item.messageType=='audio'"
                 @click="playAudio(item.id)">
              <img src="../../assets/img/audio.svg" style="width:20px;position: absolute;">
              <label :for="item.id" style="height:100%;display:inline-block;width:100px;"></label>
              <audio :src="item.url" :id="item.id"></audio>
              <span style="display: inline-block;right:10px;position: absolute;line-height: 22px;">{{(item.length+ '').split('.')[0]}}s</span>
            </div>
            <!--视频-->
            <div class="audio" style="height:100%;position: relative" v-if="item.messageType=='video'"
                 @click="playAudio(item.id)">
              <!--<img src="../../assets/img/audio.svg" style="width:20px;position: absolute;">-->
              <!--<label :for="item.id" style="height:100%;display:inline-block;width:100px;"></label>-->
              <img :src="playimg" v-show="playFlag != item.id"
                   style="position: absolute;width:70px;top:0;bottom:0;left:0;right:0;margin:auto;"
                   @click="playAudio(item.id)">
              <video :src="item.url" :id="item.id" style="width:200px;"></video>
            </div>
            <div class="read-status" v-if="item.from == myUserId" style="width:25px;"><span
                    style="height:0;width:0;font-size:0;">{{item.readStatus}}</span>{{item.readStatus ? '已读' : '未读'}}
            </div>
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
          <li v-for="(value, name) in emjoi.map" :key="value" @click="selectEmjoi($event,name)">
            <img :src="'/faces/' + value" alt="" style="width:20px;height:20px;">
          </li>
        </ul>
        <label class="bg-btn img" for="image">
          <input type="file" class="file" accept="image/*" id="image"
                 style="width:0;height:0;font-size:0;"
                 @change="change">
        </label>
        <div class="bg-btn record" @click="audioCall"></div>
        <div class="bg-btn delete" @click="messageList = []"></div>
      </div>
      <textarea class="send-content" id="send-content" @keydown.enter="keyDown" style="border:none;" v-model="inputContent" @input="input">{{inputContent}}</textarea>
      <div class="send-btn">
        <span @click="send">发送</span>
        <!--<span @click="register">注册</span>-->
      </div>
    </div>
    <div class="voice-call" v-if="mediaCallStatus == 'connect'" style="">
      <!--<div class="voice-call"  style="">-->
      <div style="width:100%;height:100%;display: flex;">
        <!--<img src="../../assets/img/icon_voice@2x.png" style="width:72px;height:72px;margin-top:100px;margin-left:30px;"-->
        <!--alt="">-->
        <div style="flex: 1;">
          <p style="color:#fff;">{{chatUserInfo.nickname}}</p>
          <p style="color:#fff;padding-top: 20px;">{{voiceTime}}</p>
        </div>
        <img @click="endCall" src="../../assets/img/icon_gd@2x.png"
             style="width:40px;height:40px;margin-right:30px;">
      </div>
    </div>
    <div class="video-call" v-if="mediaCallStatus == 'deal'">
      <img :src="chatUserInfo.avatar?chatUserInfo.avatar:'data:image/jpeg;base64,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'"
           alt="">
      <div class="name">{{chatUserInfo.nickname}}</div>
      <div class="remark" v-if="iscalling">连麦中...</div>
      <div v-else>
        <div class="remark">是否接受邀请…</div>
        <div class="button">
          <button @click="endCall">拒绝</button>
          <button @click="acceptCall">接听</button>
        </div>
      </div>
    </div>
    <audio :src="testAudio" id="testAudio" @loadedmetadata="testAudioLoad"></audio>
    <video id="testVideo" autoplay></video>
    <video id="localVideo" muted=true autoplay></video>
  </div>
</template>
<script>
  import emjoi from '../../lib/config/emoji'
  import WebIM from '../../lib/config/WebIM'
  import {Message} from 'element-ui'
  import head from '../../assets/icon/logo.png'
  import playimg from '../../assets/img/play.png'

  export default {
    props: {
      accountInfo: {}, // 账户信息
      chatUserInfo: {}, // 当前会话用户信息
      hisMessageInfo: [],
      avatar: {},
      nickname: {},
      message: {},
      currAcount: {}
    },
    filters: {
      dataToTime(value) {
        if (!value) {
          return ''
        }
        if (/^[0-9]*$/.test(value)) {
          value = +value
        }
        if (isNaN(new Date(value).getFullYear())) {
          value = value.replace(/-/g, "/").split('+')[0].split('.')[0]
          value = value.replace(/T/g, " ")
        }
        let time = new Date(value)
        let y = time.getFullYear()
        let mou = time.getMonth() + 1
        let d = time.getDate()
        let m = time.getHours()
        let s = time.getMinutes()
        mou = mou < 10 ? '0' + mou : mou
        d = d < 10 ? '0' + d : d
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        let tDate = new Date()
        let ty = tDate.getFullYear()
        let tMou = tDate.getMonth() + 1
        let tday = tDate.getDate()
        tMou = tMou < 10 ? '0' + tMou : tMou
        tday = tday < 10 ? '0' + tday : tday
        let mTime = '' + y + mou + d
        let tTime = '' + ty + tMou + tday
        let befor = ''
        if (tTime - mTime > 1) {
          befor = y + '/' + mou + '/' + d + ' '
        }
        if (tTime - mTime == 1) {
          befor = '昨天 '
        }
        return befor + m + ":" + s
      }
    },
    data() {
      return {
        iscalling: false,
        testAudio: '',
        playFlag: '',
        playimg,
        head,
        voiceUser: '',
        mediaCallStatus: '',
        emjoiPannel: false,
        inputContent: '',
        emjoi,
        messageList: [],
        myUserId: localStorage.getItem('userId'),
        imageFile: '',
        sendCacheMessage: [],
        voiceTime: "0:0:0"
      }
    },
    watch: {
      // 监听账户切换
      accountInfo: {
        handler(val) {
          this.connect()
        },
        deep: true
      },
      // 监听聊天对象切换
      chatUserInfo: {
        handler(val) {
          console.log(this.messageList, this.message)
          this.messageList = this.message
          // this.getHisMessageByUser() // 切换聊天对象进行拉取历史消息
        },
        deep: true
      }
    },
    created() {
      let _this = this
      WebIM.call = new WebIM.WebRTC.Call({
        connection: WebIM.conn,
        mediaStreamConstaints: {
          audio: true,
          video: true
        },
        listener: {
          onOtherUserOpenVoice: function (from, opened) {
            clearTimeout(_this.timeout)
            _this.mediaCallStatus = 'connect'
            _this.setCallTime()
            console.log("from open:", opened, " voice .", from)
          },
          onOtherUserOpenVideo: function (from, opened) {
            console.log("from open:", opened, " voideo .", from)
          },
          onAcceptCall: function (from, options, enableVoice, enableVideo) {
            console.log("onAcceptCall", from, options, enableVoice, enableVideo)
          },
          onGotRemoteStream: function (stream, streamType) {
            var video = document.getElementById('testVideo');
            video.srcObject = stream
            // video.src = window.URL.createObjectURL(stream);
            // me.channel.setRemote(stream, streamType)
          },
          onGotLocalStream: function (stream, streamType) {
            console.log("onGotLocalStream ", "Stream Type: ", streamType)
            var video = document.getElementById('localVideo');
            // video.srcObject =stream
            video.srcObject = stream
            // video.src = window.URL.createObjectURL(stream);
            // video.onloadedmetadata = function (e) {
            //   video.play();
            // };
            // me.channel.setLocal(stream, streamType)
          },
          onRinging: function (caller, streamType) {
            console.log("onRinging", caller)
            _this.mediaCallStatus = 'deal'
            _this.voiceUser = caller
            // me.channel.ringing(caller, streamType)
          },
          onTermCall: function (reason) {
            //"ok"      -> 'HANGUP'     "success" -> 'HANGUP'   "timeout"          -> 'NORESPONSE'
            //"decline" -> 'REJECT'     "busy"    -> 'BUSY'     "failed-transport" -> 'FAIL'
            // TODO reason undefine if reason is busy
            console.log("onTermCall", reason)
            if (reason && (reason == "busy" || reason == "BUSY")) {
              Message.error("对方正忙，请稍后再试")
            }
            if (reason && (reason == "timeout" || reason == "noresponse")) {
              Message.error("对方无应答，请稍后再试")
            }
            if (reason && (reason == "decline" || reason == "reject")) {

              Message.error("对方已拒绝，请稍后再试")
            }
            if (reason && (reason == "failed-transport" || reason == "fail")) {
              Message.error("连麦失败，请稍后再试")
            }
            if (reason && (reason == "ok" || reason == "success" || reason == "hangup")) {
              Message.success("对方已挂断")
            }
            clearTimeout(_this.timeout)
            _this.endCallClear()
          },
          onIceConnectionStateChange: function (iceState) {
          },
          onError: function (e) {
          },
          onInvite: function (from, rtcOption) {
          }
        }
      })
      WebIM.conn.registerConfrIQHandler && (WebIM.conn.registerConfrIQHandler())
    },
    mounted() {
      // this.initCall()
    },
    beforeDestroy() {
      // WebIM.conn.close()
    },
    methods: {
      keyDown(e) {
        e.preventDefault();
        if (e.keyCode === 13) {
          this.send()
          this.inputContent = ''
        }
      },
      testAudioLoad(e) {
        console.log(e.target.duration, 'eeeeeeeeeeee')
        if (e.target.duration > 60) {
          Message.error("音频不得超过60s")
        } else {
          this.sendAudioMessage(e.target.duration)
        }

      },
      endCall() {
        WebIM.call.endCall();
      },
      endCallClear() {
        this.mediaCallStatus = ''
        this.iscalling = false
        clearInterval(this.time)
        this.voiceTime = '0:0:0'
      },
      setCallTime() {
        clearInterval(this.time)
        this.time = setInterval(() => {
          this.voiceTime = this.voiceTime.split(":")
          this.voiceTime[0] = +this.voiceTime[0]
          this.voiceTime[1] = +this.voiceTime[1]
          this.voiceTime[2] = +this.voiceTime[2]
          this.voiceTime[2] += 1
          if (this.voiceTime[2] >= 60) {
            this.voiceTime[2] = 0
            this.voiceTime[1] += 1
          }
          if (this.voiceTime[1] >= 60) {
            this.voiceTime[1] = 0
            this.voiceTime[0] += 1
          }
          this.voiceTime = this.voiceTime.join(":")
        }, 1000)
      },
      acceptCall() {
        WebIM.call.acceptCall();
        this.mediaCallStatus = 'connect'
        this.setCallTime()

      },
      playAudio(id) {
        let audio = document.getElementById(id)
        if (audio.paused) {
          audio.play()
          this.playFlag = id
        } else {
          audio.pause()
          this.playFlag = ''
        }
      },
      getIconUrl(e, index) {
        if (emjoi.map[e]) {
          return `<img src='/faces/${emjoi.map[e]}' style="width:20px;height:20px;vertical-align: middle">`
        }
      },
      openPacket(item) {
        this.$emit('openPacket', item)
        item.openStatus = true
        // this.sendMessage('txt', '', {}, [{
        //   key: "redenvelope_received",
        //   stringValue: 1,
        //   type: 7,
        //   value: "stringValue"
        // }])
        this.sendMessage('txt', '', {}, {
          redenvelope_received:'1'
        })
        this.$http.receiveRedEnvelope({id: item.ext.redenvelope_id})
      },
      input(e) {
        if (e.target.value.length > 300) {
          this.inputContent = e.target.value.slice(0, 300)
        }
      },
      audioCall() {
        console.log("sendWrapper::callVoice", WebIM.conn.context.userId/*当前登录用户*/, this.chatUserInfo.friendId/*聊天对象*/)
        console.log(WebIM.call.makeVoiceCall)
        console.log(this.currAcount, this.chatUserInfo)
        if (this.currAcount.sex == this.chatUserInfo.sex) {
          Message.error('同性不能连麦')
          return
        }
        if (this.chatUserInfo.allowVideo != 1) {
          Message.error("该用户不允许连麦")
          return
        }
        WebIM.call.caller = WebIM.conn.context.userId + ''
        WebIM.call.makeVoiceCall(this.chatUserInfo.friendId + '')
        this.timeout = setTimeout(() => {
          Message.error('对方无响应，请稍后再试')
          this.mediaCallStatus = ''
          this.iscalling = false
          this.endCall()
        }, 10000)
        this.mediaCallStatus = 'deal'
        this.iscalling = true
      },
      initCall() {

      },
      selectEmjoi(e, val) {
        e.stopPropagation()
        this.inputContent += val
      },
      sendImageMessage(e) {
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
            url: file.url,
            flashUpload: WebIM.flashUpload,
            onFileUploadComplete: function (data) {
              console.log('Complete', data);
            },
          }
          this.sendMessage('img', '', extOption)
        }
      },
      sendVideoMessage() {
        var input = document.getElementById('image');  // 选择视频的input
        var file = WebIM.utils.getFileUrl(input);      // 将视频转化为二进制文件
        var allowType = {
          'mp4': true,
          'wmv': true,
          'avi': true,
          'rmvb': true,
          'mkv': true
        };
        if (file.filetype.toLowerCase() in allowType) {
          var option = {
            apiUrl: WebIM.config.apiURL,
            file: file,
            url: file.url,
            flashUpload: WebIM.flashUpload,
            onFileUploadComplete: function (data) {
              console.log('Complete', data);
            },
          }
          this.sendMessage('audio', '', option)
        }
      },
      change(e) {
        var input = document.getElementById('image') // 选择图片的input
        let type = e.target.files[0].type
        console.log(e.target.files[0])
        if (type.indexOf('image') !== -1) {
          this.sendImageMessage(e)
        } else if (type.indexOf('video') !== -1) {
          this.sendVideoMessage()
        } else if (type.indexOf('audio') !== -1  || type == "") {
          var input = document.getElementById('image');
          var file = WebIM.utils.getFileUrl(input);
          console.log("消息类型时语音文件==>",file)
          // this.sendAudioMessage()

          this.testAudio = file.url
          // this.sendAudioMessage()
        }
      },
      sendAudioMessage(length) {
        var input = document.getElementById('image');
        var file = WebIM.utils.getFileUrl(input);
        console.log(file)
        var allowType = {
          'mp3': true,
          'amr': true,
          'wmv': true,
          'm4a': true
        };
        if (file.filetype.toLowerCase() in allowType) {
          var option = {
            apiUrl: WebIM.config.apiURL,
            file: file,
            url: file.url,
            length: length || undefined,
            flashUpload: WebIM.flashUpload,
            onFileUploadComplete: function (data) {
              console.log('Complete', data);
            },
          }
          this.sendMessage('video', '', option)
        }
      },
      checkAudioLength(file) {
        this.testAudio = file
        let audio = document.getElementById('testAudio')
        this.$nextTick(() => {
          console.log(audio.duration, 'tttttttttttt')
        })
      },
      sendMessage(type = 'txt', msg = '', option = {}, extOption = []) {
        if (this.currAcount.sex == this.chatUserInfo.sex) {
          Message.error('同性不能发消息')
          return
        }
        let _this = this
        let msgId = WebIM.conn.getUniqueId()
        let deliverMessage = new WebIM.message(type, msgId)
        let message = {
          id: msgId,
          to: this.chatUserInfo.friendId + "",
          msg,
          ext:{
            avatar:this.avatar,
            nickName:this.nickname,
            ...extOption
          },
          // ext: [
          //   {
          //     key: "avatar",
          //     stringValue: this.avatar,
          //     type: 7,
          //     value: "stringValue"
          //   },
          //   {
          //     key: "nickName",
          //     stringValue: this.nickname,
          //     type: 7,
          //     value: "stringValue"
          //   },
          //   ...extOption
          // ],
          ...option
        }
        deliverMessage.set({
          ...message,
          success(res) {
            console.log('发送成功==>', deliverMessage)
            _this.inputContent = ''
            document.getElementById('image').value = ''
          },
          fail(res) {
            console.log(res, 'reserror')
          }
        })
        deliverMessage.body.chatType = 'singleChat'
        WebIM.conn.send(deliverMessage.body)
        this.afterSendMessage(type, message)
      },
      afterSendMessage(type, message) {
        message.data = message.msg
        message.from = localStorage.getItem('userId')
        message.messageType = type
        if (type == 'video') {
          message.messageType = 'audio'
        }
        if (type == 'audio') {
          message.messageType = 'video'
        }
        message.readStatus = false
        let flag = true

        // message.ext.forEach(item => {
        //   if (item.key == 'redenvelope_received') {
        //     flag = false
        //   }
        // })

          message.ext.redenvelope_received && (flag = false)
        flag && this.sendCacheMessage.push(message)
        this.checkMessageFrom(message)
      },
      send() {

        if (!this.chatUserInfo) {
          Message.error('未选择聊天对象')
          this.inputContent = ''
          return
        }
        if (this.inputContent === '') {
          Message.error('请输入内容')
          this.inputContent = ''
          return
        }
        this.sendMessage('txt', this.inputContent)
        // this.sendpacket()
      },
      sendpacket() {
        this.messageList.push({
          'from': 18,
          to: 110,
          messageType: 'audio',
          openStatus: false,
          ext: {
            avatar: '',
            nickname: '1233',
            redenvelope_id: 123,
            redenvelope_send: 100
          }
        })
        console.log(this.messageList)
      },
      scrollBottom() {
        this.$nextTick(() => {
          let ele = document.getElementById('im-content')
          ele.scrollTop = ele.scrollHeight
        })
      },
      sendMessageRead(message) {
        var bodyId = message.id
        var msg = new WebIM.message('read', bodyId)
        msg.set({
          id: bodyId,
          to: message.from
        })
        WebIM.conn.send(msg.body)
      },
      pushMessage(type = 'txt', message) {
        message.messageType = type
        this.sendMessageRead(message)
        if (!this.checkMessageFrom(message)) return
        this.messageList.push(message)
        this.scrollBottom()
      },
      checkMessageFrom(item) {
        let isFromChat = item.from == this.chatUserInfo.friendId
        // if (!isFromChat) {
        //   console.log("123113--------------")
        this.$emit('cacheMessage', item)
        // }
        return isFromChat
      },
      dealPosMessage(message) {
        message.messageType = 'pos'
        this.pushMessage('pos', message)
        this.$nextTick(() => {
          var map = new BMap.Map(message.id);
          var point = new BMap.Point(message.lng, message.lat);
          map.centerAndZoom(point, 12);
          var marker = new BMap.Marker(point);  // 创建标注
          map.addOverlay(marker);
          clearInterval(this.timein)
          this.timein = setInterval(() => {
            let span = document.querySelectorAll('.BMap_cpyCtrl.BMap_noprint.anchorBL')
            console.log(span)
            if (span[0]) {
              span[0].innerHTML = message.addr.split("|")[1]
              clearInterval(this.timein)
            }
          }, 10)
        })
      },
      // 环信登录以及连接
      reconnect() {
        let _this = this
        console.log(this.$imoption)
        WebIM.conn.open(this.$imoption)
        WebIM.conn.listen({
          onOpened: function (res) {
            console.log('用户已上线==>', res)
            _this.myUserId = localStorage.getItem('userId')
            // _this.getHisMessageByUser()
            // _this.createMessageBody()
          },
          onTextMessage(res) {
            console.log('收到文本消息==>', res)
            console.log('扩展消息==>', JSON.parse(JSON.stringify(res.ext)))
            // _this.pushMessage('txt',res)
            let obj = {}
            if (res.ext.avatar === undefined) {
              res.ext.forEach(item => {
                obj[item.key] = item.stringValue
              })
              res.ext = obj
            }

            if (res.ext.redenvelope_id) { // 红包
              res.openStatus = false
              _this.pushMessage('packet', res)
            } else if (res.ext.chatAudioKey) { // 连麦提示

            } else { // 文本消息
              res.readStatus = false
              _this.pushMessage('txt', res)
            }
          },
          onClosed: function (res) {
            console.log('连接已关闭==>', res)
          }, // 连接关闭回调
          onEmojiMessage: function (message) {
            console.log('收到表情消息==>', message)
          }, // 收到表情消息
          onPictureMessage: function (message) {
            console.log('收到图片消息==>', message)
            _this.pushMessage('img', message)
          }, // 收到图片消息
          onAudioMessage: function (message) {
            console.log('收到音频消息==>', message)
            var options = {url: message.url};
            options.onFileDownloadComplete = function (response) {
              //音频下载成功，需要将response转换成blob，使用objectURL作为audio标签的src即可播放。
              var objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
              message.url = objectURL
              _this.pushMessage('audio', message)
            };
            options.onFileDownloadError = function () {
              //音频下载失败
            };
            //通知服务器将音频转为mp3
            options.headers = {
              'Accept': 'audio/mp3'
            };
            WebIM.utils.download.call(WebIM.conn, options);
          }, // 收到音频消息
          onLocationMessage: function (message) {
            console.log('收到位置消息==>', message)
            _this.dealPosMessage(message)
          }, // 收到位置消息
          onFileMessage: function (message) {
            console.log('收到文件消息==>', message)
          }, // 收到文件消息
          onVideoMessage: function (message) {
            console.log('收到视频消息==>', message)
            var options = {url: message.url};

            options.onFileDownloadComplete = function (response) {
              //音频下载成功，需要将response转换成blob，使用objectURL作为audio标签的src即可播放。
              var objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
              message.url = objectURL
              _this.pushMessage('video', message)
            };
            options.onFileDownloadError = function () {
              //音频下载失败
            };
            //通知服务器将音频转为mp3
            options.headers = {
              'Accept': 'audio/mp4'
            };
            WebIM.utils.download.call(WebIM.conn, options);
          }, // 收到视频消息
          onOnline: function () {
          }, // 本机网络连接成功
          onOffline: function () {
          }, // 本机网络掉线
          onError: function (message) {
          }, // 失败回调
          onReceivedMessage: function (message) {
            console.log('收到消息送达服务器回执==>', message)
            _this.sendCacheMessage.forEach((item, idx) => {
              if (item.id == message.id) {
                item.id = message.mid
                _this.messageList.push(item)
                _this.sendCacheMessage.splice(idx, 1)
              }
            })
          }, // 收到消息送达服务器回执
          onDeliveredMessage: function (message) {
            console.log('收到消息送达客户端回执==>', message)
          }, // 收到消息送达客户端回执
          onReadMessage: function (message) {
            console.log('收到消息已读回执==>', message)
            _this.messageList.forEach(item => {
              item.id == message.mid && (item.readStatus = true)
            })
          } // 收到消息已读回执
        })
      },
      connect() {
        if (WebIM.conn.isOpened()) {
          WebIM.conn.close()
        }
        // setTimeout(() => {
        this.reconnect()
        // this.testConnect()
        // }, 1000)
      },
      testConnect() {
        console.log(this.$imoption)
        let _this = this
        WebIM.conn.listen({
          onOpened: function (res) {
            console.log('用户已上线==>', res)
            _this.myUserId = localStorage.getItem('userId')
            // _this.getHisMessageByUser()
          },
          onTextMessage(res) {
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
      createMessageBody(messageType, toId = 'wetest005', content = 'sdaasda', expand = {}) {
        let msgId = this.$imconn.getUniqueId() // 创建消息id
        let deliverMessage = new WebIM.message(messageType, msgId)
        deliverMessage.set(Object.assign({
          id: msgId, // 消息id
          to: toId, // to对方id
          msg: content, // 消息内容
          success(res) {
            console.log('发送成功')
            this.$emit('bindMessageCallback', res) // 收发消息告知父组件，父组件需要去处理会话框。可添加type消息类型进行拓展
          }
        }, expand))
        deliverMessage.body.chatType = 'singleChat'
        this.$imconn.send(deliverMessage.body)
      },
      // 根据聊天对象拉取历史消息
      getHisMessageByUser() {
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
    .video-call {
      position: fixed;
      width: 480px;
      height: 244px;
      background: rgba(0, 0, 0, .7);
      border-radius: 5px;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto 0;
      left: 25%;
      text-align: center;

      > img {
        width: 75px;
        height: 75px;
        margin-top: 30px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }

      > div {
        color: #fff;
      }

      .name {
        margin-top: 15px;
        font-size: 15px;
      }

      .remark {
        margin-top: 10px;
        font-size: 13px;
        margin-bottom: 20px;
      }

      .button {
        button {
          width: 128px;
          height: 35px;
          color: #fff;
          border-radius: 6px;
        }

        button:first-child {
          margin-right: 30px;
          background: #FF3D30;
        }

        button:last-child {
          background: #03C300;
        }
      }
    }

    .voice-call {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      position: fixed;
      width: 280px;
      height: 80px;
      border-radius: 5px;
      background: rgba(0, 0, 0, .63);
      z-index: 101;

      > div {
        align-items: center;

        > div {
          p {
            padding-left: 20px;
          }

        }
      }
    }

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

            &.packet {
              position: relative;

              .mask {
                position: absolute;
                width: 105%;
                height: 100%;
                background: #fff;
                opacity: .5;
                top: 0;
                left: -10px;
                z-index: 99;
              }

              .info {
                height: 36px;
                margin-top: 12px;
                margin-bottom: 12px;
                display: flex;

                > img {
                  height: 36px;
                  width: 30px;
                  margin-left: 15px;
                  margin-right: 15px;
                }

                .title {
                  font-size: 14px;
                  color: #fff;
                }

                .open {
                  font-size: 12px;
                  color: #f0f0f0;

                }
              }

              .name {
                height: 20px;
                background: #fff;
                font-size: 12px;
                line-height: 20px;
                padding-left: 15px;
                color: #999;
              }
            }

            .main-type-normal {
              color: #333;
              font-size: 14px;

              pre {
                width: 100% !important;
                white-space: pre-wrap;
                word-wrap: break-word;
              }

              > img {
                width: 200px;
                height: 200px;
              }
            }

            .red-packet {
              width: 235px;
              height: 80px;
            }
          }

          &.message-left {
            @include flex-direction();

            .message-content-main {
              margin-left: 20px;
              border: 1px solid #E5E5E5;
              position: relative;

              &.packet {
                padding: 0;
                background: #E6494F !important;

                &:before {
                  border-right: 8px solid #E6494F;
                }

                &:after {
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

              .read-status {
                position: absolute;
                bottom: -20px;
                right: 10px;
                font-size: 12px;
                color: #FEAF27
              }

              &.packet {
                padding: 0;
                background: #E6494F !important;

                &:before {
                  border-left: 8px solid #E6494F;
                }

                &:after {
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

        ul.emoj-pannel {
          position: absolute;
          display: flex;
          width: 100%;
          height: 200px;
          /*border:1px solid black;*/
          top: -180px;
          left: 0;
          flex-wrap: wrap;
          background: #fff;

          li {
            width: 30px;
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
