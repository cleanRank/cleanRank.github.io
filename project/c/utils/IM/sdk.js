// var httpUrl = 'http://192.168.131.33:8082';  //wujin
// var socketUrl = 'http://192.168.131.33:8081/weim';//wujin
//
const  stomp = require('stomp.js')
const Stomp = require('stomp.js').Stomp
Stomp.setInterval =  (interval, f)=> {
    return setInterval(f, interval);
};
Stomp.clearInterval =  (id)=> {
    return clearInterval(id);
};
console.log(Stomp.__proto__)
// Stomp.__proto__.debug = function(message) {
//     var _ref;
//     return typeof window !== "undefined" && window !== null ? (_ref = window.console) != null ? _ref.log(message) : console? console.log(message):void 0 :  console? console.log(message):void 0 ;
// };
// 测试环境
// var httpUrl = 'http://106.14.99.84:8080';
// var socketUrl = 'ws://106.14.99.84:8081/weim/websocket';
// 生产环境
var httpUrl = 'https://imus.sxfq.com';
var socketUrl = 'wss://imms.sxfq.com/weim/websocket';

// 预发环境
// var socketUrl = 'ws://47.101.77.167:80/weim/websocket';
// var httpUrl = 'http://47.101.4.191:80';

// var httpUrl = 'http://192.168.131.249:8082';
// var socketUrl = 'http://192.168.131.249:8081/weim';

// 部署开发环境
// var httpUrl = 'http://localhost:8082';
// var socketUrl = 'http://localhost:8081/weim';
// 开发环境
// var httpUrl = `http://192.168.131.249:8082`;
// var socketUrl = `ws://192.168.131.249:8081/weim`;

// var httpUrl = `http://192.168.131.51:8082`;
// var socketUrl = `ws://192.168.131.51:8081/weim`;
// 发送消息

var h5Im = function () {
  this.url = httpUrl;
  this.sockUrl = socketUrl;
  this.token = ''; // 请求头
  this.stompClient = ''
  this.sock=''
  this.API = {
    login: `${this.url}/user/login/auth`,
    createBandUser: `${this.url}/user/group/createBandUser`,
    addUsersToGroup: `${this.url}/user/userGroup/addUsersToGroup`, // 向群祖添加成员
    exitGroupChat: `${this.url}/user/group/deleteBandUserGroup`, // 退出群聊
    getRecentContact: `${this.url}/user/group/getLeftListDisplay`, // 获取最近联系人信息
    getUserIdByGroupId: `${this.url}/user/group/getUserIdByGroupId`, // 根据群ID获取群用户ID
    deleteUserFromGroup: `${this.url}/user/userGroup/deleteUsersFromGroup`, // 将用户剔出群
    getUserInfoByGroup: `${this.url}/user/userGroup/findAllUsersInfoByGroup`, // 查看用户在群中信息
    getAllGroupIdByLoginUser: `${this.url}/user/userGroup/getAllGroupIdByLoginUser`, // 获取当前用户所有群组ID
    modifyUserInfoInGroup: `${this.url}/user/userGroup/modifyUserInfoInGroup`, // 修改用户群信息
    getUserIdByToken: `${this.url}/user/login/getUserIdByToken`, // 根据token获取用户id
    getUserInfoById: `${this.url}/user/userGroup/getUserInfoById`, // 根据用户ID获取用户信息
    getAllUsersInfoByList: `${this.url}/user/message/getAllUsersInfoByList`, // 根据用户ID数组获取用户信息
    getHistoryMessage: `${this.url}/user/message/query`, // 获取历史消息
    cleanHistoryMessage: `${this.url}/user/message/clean`, // 清空历史消息
    updateAllContent: `${this.url}/user/group/updateAllContent`, // 修改群组信息
    chatWithCustomerService: `${this.url}/user/userGroup/clientChatWithCusSer`, // 建立客服会话
    dissolutionGroup: `${this.url}/user/chatManage/dissolutionGroup`, // 解散群聊
    testPhoneLogin: `${this.url}/user/login/testPhoneLogin`, // 手机号注册
    modifyUserInfo: `${this.url}/user/userGroup/modifyUserInfo`, // 修改用户个人信息
    getAllUsers: `${this.url}/user/message/queryUsers`, // 获取所有用户
    outLine: `${this.url}/user/login/outLine`, // 退出客服会话
    removeRecent: `${this.url}/user/userGroup/deleteGroupFromLeftListByGroupId`, // 从左侧列表移除某一个群聊
    getUserIdByGroupIds: `${this.url}/user/group/getUserIdByGroupIds`, // 2019.5.24 根据群组获取群中所有用户id(包含被踢出的用户id和退群的用户id
    findNearUsers:  `${this.url}/user/location/findNearUsers`, // 查找附近的人
    updateUserLocation: `${this.url}/user/location/save`, // 保存位置信息（添加|更新）
    getAddRequest: `${this.url}/user/friend/addRequest`, // 添加好友请求
    setAddResponse: `${this.url}/user/friend/addResponse`, //处理添加好友请求（同意、拒绝添加）
    getFriendList: `${this.url}/user/friend/list`, // 查询好友列表
    updateRemake: `${this.url}/user/friend/updateRemake`,  // 修改好友备注
    getRequestList: `${this.url}/user/friend/requestList`, // 查询好友请求消息列表
    requestCount: `${this.url}/user/friend/request/count`, // 未处理的好友请求数量
    setFriendsStatus: `${this.url}/user/friend/user/friend/delete`,  // 删除/拉黑/恢复（仅限拉黑、已删除的不能）好友
    addUserToBlack: `${this.url}/user/black/add`, //添加好友到我的黑名单
    removeUserFromBlack: `${this.url}/user/black/remove`, //将好友移除黑名单)
    getBlackList: `${this.url}/user/black/user/friend/list`, //查询我的黑名单
    findUnreadCount: `${this.url}/user/message/findUnreadCount`, // 查询用户未读消息数量
    findAllUnreadCount: `${this.url}/user/message/findAllUnreadCount`, // 查询未读消息总数量
  }
  this.DataConst = {
    NOTIFY_ONOPEN: 1, // 连接sock成功标识
    NOTIFY_RECEIVE_CHAT_MESSAGE: 10001, // 接收到消息的标识
    NOTIFY_RECEIVE_SERVICE_MESSAGE: 10002 // 接收到客服消息的标识
  }
}
var _h5Im = null
var _socket = null
var socket = function () {}
socket.getInstance = function() {
  // if(!_socket) {
  //   _socket = new SockJS(socketUrl)
  // }
  return  new SockJS(socketUrl);
}
h5Im.getInstance = function () {
  if(!_h5Im) {
    _h5Im = new h5Im();
  }
  return _h5Im;
}
h5Im.prototype.disConnect = function (callback) {
  console.log("disCnonect",this.stompClient)
  this.stompClient&&this.stompClient.disconnect(()=>{
    callback()
  })
}
// websocket连接
h5Im.prototype.connect = function (glob) {
  this.glob = glob
  if (glob['token']) {
    this.token = glob['token'];
    console.log(this.token,'h5Im.prototype.connect ' )
  } else {
    throw new Error('token must be not null')
  }
  return new Promise((resolve, reject) => {
    if (!(glob instanceof Array) && glob instanceof Object) {
      var socketOpen = false
      var socketMsgQueue = []

      function sendSocketMessage(msg) {
        if (socketOpen) {
          wx.sendSocketMessage({
            data: msg
          })
        } else {
          socketMsgQueue.push(msg)
        }
      }
      this.stompClient && this.stompClient.disconnect()

      this.socketTask = wx.connectSocket({
        url: socketUrl,
        header: {
          'content-type': 'application/json'
        },
        success:function(res){
          console.log(res,'ssssssssssssss')
        },
        fail:function(res){
          console.log(res,'fffffffff')

        }
      });
        this.socketTask.onClose( (res) => {
          console.log(res)
        this.stompClient.connected = false
      })
        this.socketTask.onError( (res) => {
          console.log(res)
        this.stompClient.connected = false
      })
      this.readyState = this.socketTask.readyState
      var ws = {
        send: sendSocketMessage,
        onopen: wx.onSocketOpen,
        onmessage: wx.onSocketMessage,
        close:wx.closeSocket
      }
      wx.onSocketOpen(function (res) {
        socketOpen = true
        for (var i = 0; i < socketMsgQueue.length; i++) {
          sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = []
        ws.onopen && ws.onopen()
      })

      wx.onSocketMessage(function (res) {
        ws.onmessage && ws.onmessage(res)
      })
      wx.onSocketClose( (res)=> {
        console.log(res,"close")
        this.stompClient.connected = false
      })
      wx.onSocketError((error) => {
        this.stompClient.connected = false
        console.log(error,'onsocketerror')
        // this.connect(this.glob)
      });


        this.stompClient = Stomp.over(ws);
        this.stompClient.__proto__.debug=function(message){
            var _ref;
                return typeof window !== "undefined" && window !== null ? (_ref = window.console) != null ? _ref.log(message) : console? console.log(message):void 0 :  console? console.log(message):void 0 ;

        }
        console.log(this.stompClient)
      this.stompClient.connect({
            "Access-token":  this.token}, (frame) => {
        if(frame.command == "CONNECTED"){
            let subscribeUrl = "/user/exchange/topic.chat/message",
            serviceSubscribeUrl = "/user/exchange/topic.chat/service"
          this.stompClient.subscribe(subscribeUrl, glob['receiveMessage']); // 接收消息回调函数
          this.stompClient.subscribe(serviceSubscribeUrl, glob['receiveServiceMessage']);// 客服消息回调函数
            // setTimeout(()=>{
            //     this.stompClient.disconnect(()=>{
            //         this.connect(glob)
            //     })
            // },1000)


          resolve()
        }
      },(res)=>{
          // this.connect(glob)
        console.log(res,"err callback")
      })
    } else {
      throw new Error('params is not visible')
    }
  })
}
// 发送消息
h5Im.prototype.sendMessage = function (params = {}) {
  console.log(this.stompClient.connected,this.glob,'this.stompClient.connected')
    if(!this.stompClient.connected){
        this.connect(this.glob)
        return ;
    }
    return new Promise( (resolve, reject) => {
        if (!(params instanceof Array) && params instanceof Object) {
          var payload = JSON.stringify(params);
          this.stompClient.send("/exchange/topic.chat", {"Access-token": this.token}, payload);
          console.log('success')
          resolve(params)
        } else {
          throw new Error("params must be object");
          reject()
        }

    })

}
// 发送消息给客服
h5Im.prototype.sendMessageToService = function (params = {}) {
  return new Promise( (resolve, reject) => {
    if (!(params instanceof Array) && params instanceof Object) {
      var payload = JSON.stringify(params);
      this.stompClient.send("/message/cservice", {"Access-token": this.token}, payload);
      resolve(params)
    } else {
      throw new Error("params must be object");
      reject()
    }
  })
}
// 告知服务端消息已读
h5Im.prototype.sendMessageAck = function (params = {}) {
    return new Promise( (resolve, reject) => {
        if (!(params instanceof Array) && params instanceof Object) {
            var payload = JSON.stringify(params);
            // var stompClient = Stomp.over(socket.getInstance());
          this.stompClient.send("/message/ack", {}, payload);
            resolve(params)
        } else {
            throw new Error("params must be object");
            reject()
        }
    })
}
h5Im.prototype.receiveMessage = function(data) {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(data.body));
  })
}
// http 请求
h5Im.prototype.$ajax = function (url, data, method, postType) {

  return new Promise((resolve, reject) => {
    if(postType && method == 'post'){
      if (data){
        if(typeof data === 'string'){
          data = JSON.parse(data)
        }
        let keys = Object.keys(data)
        url += '?'
        let keyIsLast = false,arrIsLast=false
        keys.forEach((key,keyidx)=>{
          (keyidx == (keys.length-1)) && (keyIsLast = true)
          if(Array.isArray(data[key])){

            data[key].forEach((val,arridx)=>{
              (arridx == (data[key].length - 1)) && (arrIsLast = true)
              url += (key + '=' + val + (keyIsLast && arrIsLast ? '' : '&'))
            })
          }else {
            console.log(keyIsLast,keyidx,keys.length-1, 'keyIsLast')
            url+= (key + '=' + data[key] + (keyIsLast ? '' : '&'))
          }
        })
      }
    } else if (method == 'get' && postType) {
      let arr = Object.keys(data)
      let keyIsLast = false
      url += '?'
      arr.forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            if (index == data[key].length-1) {
              keyIsLast = true
            }
            url += (key + '=' + item + (keyIsLast ? '' : '&'))
          })
        }
      })
      data = null
      console.log(url)
    }
    wx.request({
      url: url, //api地址
      method: method, // 请求方法
      data: data, // 参数
      header: {
        'content-type': 'application/json',
        'token': this.token
      },
      success: function (res) {
        let data = res.data
        resolve(data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}
// 根据用户id获取未读消息总数量
h5Im.prototype.findAllUnreadCount = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.findAllUnreadCount, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 查询用户未读消息数量
h5Im.prototype.findUnreadCount = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.findUnreadCount, params, 'get', 1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 查找附近的人
h5Im.prototype.findNearUsers = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.findNearUsers, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 保存位置信息（添加|更新）
h5Im.prototype.updateUserLocation = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.updateUserLocation, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 添加好友请求
h5Im.prototype.getAddRequest = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getAddRequest, params, 'post', 1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 处理添加好友请求（同意、拒绝添加）
h5Im.prototype.setAddResponse = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.setAddResponse, params, 'post', 1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 查询好友请求消息列表
h5Im.prototype.getRequestList = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getRequestList, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 未处理的好友请求数量
h5Im.prototype.requestCount = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.requestCount, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
//修改好友备注
h5Im.prototype.updateRemake = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.updateRemake, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 删除/拉黑/恢复（仅限拉黑、已删除的不能）好友
h5Im.prototype.setFriendsStatus = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.setFriendsStatus, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 添加好友到我的黑名单
h5Im.prototype.addUserToBlack = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.addUserToBlack, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 将好友移除黑名单
h5Im.prototype.removeUserFromBlack = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.removeUserFromBlack, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 查询我的黑名单
h5Im.prototype.getBlackList = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getBlackList, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据群组获取群中所有用户id(包含被踢出的用户id和退群的用户id
h5Im.prototype.getUserIdByGroupIds = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getUserIdByGroupIds, params, 'get', 1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 从左侧列表中移除某一个群聊
h5Im.prototype.removeRecent = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.removeRecent, JSON.stringify(params), 'post',1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 创建群组
h5Im.prototype.createBandUser = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.createBandUser, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 客服回话
h5Im.prototype.chatWithCustomerService = function(params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.chatWithCustomerService, params, 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 获取好友列表
h5Im.prototype.getFriendList = function (param) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getFriendList, param, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 退出客服回话
h5Im.prototype.outLine = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.outLine, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 修改群信息
h5Im.prototype.updateAllContent = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.updateAllContent, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 清空历史消息
h5Im.prototype.cleanHistoryMessage = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.cleanHistoryMessage, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 获取最近联系人信息
h5Im.prototype.getRecentContact = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getRecentContact, '', 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 向群组添加成员
h5Im.prototype.addUsersToGroup = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.addUsersToGroup, JSON.stringify(params), 'post', ).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 退出群聊
h5Im.prototype.exitGroupChat = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.exitGroupChat, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 解散群聊
h5Im.prototype.dissolutionGroup = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.dissolutionGroup, JSON.stringify(params), 'post',1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据token获取用户id
h5Im.prototype.getUserIdByToken = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getUserIdByToken, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据群ID获取群用户ID
h5Im.prototype.getUserIdByGroupId = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getUserIdByGroupId, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 踢出群聊
h5Im.prototype.deleteUserFromGroup = function (params) {

  return new Promise((resolve, reject) => {
    this.$ajax(this.API.deleteUserFromGroup, JSON.stringify(params), 'post',).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据群ID获取群用户信息
h5Im.prototype.getUserInfoByGroup = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getUserInfoByGroup, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 修改用户群信息
h5Im.prototype.modifyUserInfoInGroup = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.modifyUserInfoInGroup, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(JSON.parse(res))
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 获取当前登录用户所有群ID
h5Im.prototype.getAllGroupIdByLoginUser = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getAllGroupIdByLoginUser, JSON.stringify(params), 'get').then(res => {
      if (res) {
        resolve(JSON.parse(res))
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 获取历史消息
h5Im.prototype.getHistoryMessage = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getHistoryMessage, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据用户id获取用户信息
h5Im.prototype.getUserInfoById = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getUserInfoById, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 根据多个用户id获取用户信息
h5Im.prototype.getAllUsersInfoByList = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getAllUsersInfoByList, params, 'get', 1).then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 手机号注册
h5Im.prototype.testPhoneLogin = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.testPhoneLogin, params, 'get').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 修改个人信息
h5Im.prototype.modifyUserInfo = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.modifyUserInfo, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}
// 获取所有用户
h5Im.prototype.getAllUsers = function (params) {
  return new Promise((resolve, reject) => {
    this.$ajax(this.API.getAllUsers, JSON.stringify(params), 'post').then(res => {
      if (res) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(res => {
      reject(res)
    })
  })
}


// 发布订阅模式用于订阅通知事件
var DataObserver = function () {
    this.notify_observers = new Array();
};
var _data_observer_p_instance = null;

DataObserver.getInstance = function () {
    if (!_data_observer_p_instance) {
        _data_observer_p_instance = new DataObserver();
    }
    return _data_observer_p_instance;
};
DataObserver.prototype.Register = function (observer_func) {
    if (this.notify_observers.length == null) {
        return;
    }
    for (var index = 0; index < this.notify_observers.length; index++) {
        if (this.notify_observers[index].name == observer_func.name) {
            return false;
        }
    }
    this.notify_observers.push(observer_func);
    return true;
};
DataObserver.prototype.Cannel = function (observer_func) {
    if (this.notify_observers.length == null ||
        this.notify_observers.length <= 0) {
        return;
    }
    for (var index = 0; index < this.notify_observers.length; index++) {
        if (this.notify_observers[index].name == observer_func) {
            this.notify_observers.splice(index, 1);
        }
    }
    return false;
};
DataObserver.prototype.Emit = function (param1, param2, param3) {
    if (this.notify_observers.length == null ||
        this.notify_observers.length <= 0) {
        return;
    }
    this.notify_observers.forEach((v, i) => {
        var observer_func = this.notify_observers[i];
        observer_func.call(null, param1, param2, param3);
    })
};

h5Im.prototype.DataObserver = DataObserver
var webIM = h5Im.getInstance();
module.exports = webIM

// export default DataObserver
