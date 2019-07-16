<template>
  <div class="page-private-letter">
    <el-row class="top-content">
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="left-box">
          <span>陪聊管理</span>
          <span>私信管理</span>
        </div>
      </el-col>
    </el-row>
    <div class="letter">
      <div class="letter-recentUserList">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline inherlint">
          <el-form-item label="当前账号">
            <el-select v-model="searchForm.subAccountId" placeholder="当前账号" size="mini" @change="selectAccount">
              <el-option v-for="list in accountList" :key="list.id" :label="list.account" :value="list.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="user-list">
          <div class="user-mod" v-for="(item,idx) in contactList" :key="idx" @click="selectUserToChat">
            <div class="img">
              <img src="../../assets/icon/logo.png" alt="">
            </div>
            <div class="info">
              <div class="top">
                <span>{{item.name || 白云黑土}}</span>
                <span>20:53</span>
              </div>
              <div class="bottom">
                <span>可以认识一下吗，可以认识一…</span>
                <span><em>99+</em></span>
              </div>
            </div>
          </div>
          <!--<div class="user-mod">-->
            <!--<div class="img">-->
              <!--<img src="../../assets/icon/logo.png" alt="">-->
            <!--</div>-->
            <!--<div class="info">-->
              <!--<div class="top">-->
                <!--<span>白云黑土</span>-->
                <!--<span>20:53</span>-->
              <!--</div>-->
              <!--<div class="bottom">-->
                <!--<span>可以认识一下吗，可以认识一…</span>-->
                <!--<span><em>99+</em></span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="user-mod">-->
            <!--<div class="img">-->
              <!--<img src="../../assets/icon/logo.png" alt="">-->
            <!--</div>-->
            <!--<div class="info">-->
              <!--<div class="top">-->
                <!--<span>白云黑土</span>-->
                <!--<span>20:53</span>-->
              <!--</div>-->
              <!--<div class="bottom">-->
                <!--<span>可以认识一下吗，可以认识一…</span>-->
                <!--<span><em>99+</em></span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="user-mod">-->
            <!--<div class="img">-->
              <!--<img src="../../assets/icon/logo.png" alt="">-->
            <!--</div>-->
            <!--<div class="info">-->
              <!--<div class="top">-->
                <!--<span>白云黑土</span>-->
                <!--<span>20:53</span>-->
              <!--</div>-->
              <!--<div class="bottom">-->
                <!--<span>可以认识一下吗，可以认识一…</span>-->
                <!--<span><em>99+</em></span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </div>
      </div>
      <div class="letter-currentUser">
        <im-component :account-info="currentHxAccountInfo" :user-info="chatUser" :bindMessageCallback='bindMessageCallback'>
          <div class="im-header-name"></div>
        </im-component>
      </div>
      <div class="letter-userInfo">
        <div class="header"></div>
        <user-info :datas="userData"></user-info>
      </div>
    </div>
    <div class="packet-box" v-show="isShowPacketDetail">
      <div class="packet-content">
        <div>
          <img src="https://rescdn.qqmail.com/zh_CN/htmledition/images/webp/tg-chang1ea8a2.png" alt="">
          <div class="name">白云黑土的钱包</div>
          <div class="remark">恭喜发财，大吉大利</div>
          <div class="packet-num"><span>99.20</span>元</div>
        </div>
        <img src="../../assets/img/chat_redpaper_ch@2x.png" alt="">
      </div>
    </div>
    <div class="video-call" v-if="false">
      <img src="data:image/jpeg;base64,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" alt="">
      <div class="name">哇哈哈哈哈</div>
      <div class="remark">等待对方接受邀请…</div>
      <div class="button">
        <button>拒绝</button>
        <button>接听</button>
      </div>
    </div>
  </div>
</template>
<script>
import imComponent from 'components/component/im.vue'
import userInfo from 'components/component/user.vue'
export default {
  name: 'standapply',
  data () {
    return {
      isShowPacketDetail: false,
      chatUser: '',
      currentHxAccountInfo: {
        user: '',
        pwd: ''
      }, // 当前账户环信账号密码
      searchForm: {
        subAccountId: ''
      },
      accountList: [], // 账号列表
      contactList: [], // 最近联系人列表
      userData: ''
    }
  },
  components: {
    imComponent,
    userInfo
  },
  mounted () {
    this.chatUser = this.$route.query.chatUserId
    console.log(this.$route)
    this.chatUser && this.$http.getProfile({friendId:this.chatUser}).then(res=>{
      this.userData = res.result
    })
    this.getAccountList()
    // Object.assign(this.$imoption, { user: '87', pwd: "e10adc3949ba59abbe56e057f20f883e" })
    // Object.assign(this.currentHxAccountInfo, { user: '87', pwd: "e10adc3949ba59abbe56e057f20f883e" })
  },
  created () {

  },
  methods: {
    // 选择聊天对象
    selectUserToChat (e) {
      this.chatUser = e
    },
    // 选择当前账号
    selectAccount (e) {
      this.searchForm.subAccountId = e
      // this.$imconn.close() // 断开前账号连接，准备重新连接新账号通讯
      setTimeout(() => {
        this.findByUserId(e)
      }, 1000)
    },
    async getAccountList () { // 获取陪聊账号列表
      let accountList = await this.$http.getAccountList() || []
      if (accountList && accountList.result && accountList.result && accountList.result.length) {
        this.accountList = accountList.result
        this.searchForm.subAccountId = this.accountList[0].id
      }
      // Object.assign(this.currentHxAccountInfo, { user: 'test', pwd: 123 })
      this.findByUserId()
    },
    findByUserId () { // 获取当前账号环信账号密码
      if (this.searchForm.subAccountId) {
        this.$http.findByUserId({ userId: this.searchForm.subAccountId }).then(res => {
          if (res.result) {
            Object.assign(this.currentHxAccountInfo, { user: res.result.username, pwd: res.result.password })
            Object.assign(this.$imoption, { user: res.result.username, pwd: res.result.password })
          }
        }).catch(e => {
        })
      }
    },
    // 收发消息回调处理
    bindMessageCallback (info) {
      console.log(info)
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/scss/_flex.scss';

  $color: #5584FF;
  .page-private-letter {
    .packet-box{
      position: fixed;
      width:100%;
      height:100%;
      background: rgba(0,0,0,.5);
      top:0;
      left:0;
      .packet-content{
        width:320px;
        height:446px;
        position: absolute;
        top:0;left:0;right:0;bottom:0;margin:auto;
        >div{
          height:400px;
          width:320px;
          background: #CF3A3F;
          z-index: 999;
          border-radius:5px;
          text-align: center;
          >img{
            width:70px;
            height:70px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            margin-top: 75px;
          }
          .name{
            font-size:14px;
            color:#fff;
            margin: 16px auto 10px;
          }
          .remark{
            color:#fff;

            font-size: 12px;
          }
          .packet-num{
            color:#fff;

            font-size: 12px;
            margin-top: 30px;
            span{
              font-size: 36px;
              line-height: 56px;
            }
          }
        }
        >img{
          width:36px;
          height:36px;
          display: block;
          margin:30px auto;
        }
      }
    }
    .video-call{
      position: fixed;
      width:480px;
      height:244px;
      background:rgba(0,0,0,.7);
      border-radius:5px;
      top:0;right:0;bottom:0;margin:auto 0;
      left:25%;
      text-align: center;
      >img{
        width:75px;
        height:75px;
        margin-top: 30px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }
      >div{
        color:#fff;
      }
      .name{
        margin-top: 15px;
        font-size: 15px;
      }
      .remark{
        margin-top: 10px;
        font-size: 13px;
        margin-bottom: 20px;
      }
      .button{
        button{
          width:128px;
          height:35px;
          color:#fff;
          border-radius:6px;
        }
        button:first-child{
          margin-right: 30px;
          background: #FF3D30;
        }
        button:last-child{
          background: #03C300;
        }
      }
    }
    .top-content {
      width: 100%;
      height: 75px;
      box-sizing: border-box;
      padding: 20px 20px 0 0px;
      font-size: 14px;
      color: #333;

      .left-box {
        float: left;

        span {
          position: relative;
          margin-right: 15px;

          &:not(:last-child) {
            color: #666;

            &::after {
              content: '>';
              display: inline-block;
              position: absolute;
              right: -13px;
              top: 0;
            }
          }
        }
      }
    }

    .letter {
      @include display-flex();
      height: 880px;
      border: 1px solid #F0F0F0;
      background: #fff;

      .letter-recentUserList {
        width: 280px;

        .inherlint {
          height: 53px;
          @include display-flex();
          @include align-items(center);
          background: #F0F0F0;

          .el-form-item {
            margin-bottom: inherit;
          }
        }

        .user-list {
          background: #fff;

          .user-mod {
            @include display-flex();
            height: 75px;
            padding-right: 10px;
            @include align-items(center);
            border-bottom: 1px solid #F0F0F0;

            &.active {
              background: #FAFAFA;
            }

            .img {
              flex: 70px 0;
              @include display-flex();
              @include align-items(center);
              @include justify-content(center);

              img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }

            .info {
              flex: 1;

              .top {
                @include display-flex();
                @include justify-content(space-between);

                span:first-child {
                  font-size: 14px;
                  color: #333;
                  font-weight: 500;
                }

                span:first-child + span {
                  font-size: 12px;
                  color: #999;
                }
              }

              .bottom {
                @include display-flex();
                @include justify-content(space-between);
                margin-top: 5px;

                span:first-child {
                  font-size: 12px;
                  color: #666;
                  flex: 1;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                span:first-child + span {
                  width: 30px;

                  em {
                    height: 16px;
                    display: inline-block;
                    text-align: center;
                    line-height: 16px;
                    border-radius: 8px;
                    background: #FF5E4B;
                    color: #fff;
                    font-size: 12px;
                    padding: 0 2px;
                  }
                }
              }
            }
          }
        }
      }

      .letter-currentUser {
        width: 580px;

        .im-header-name {
          height: 53px;
          background: #F0F0F0;
          line-height: 53px;
          text-align: center;
        }
      }

      .letter-userInfo {
        width: 225px;

        .header {
          height: 53px;
          background: #F0F0F0;
          line-height: 53px;
          text-align: center;
        }
      }
    }
  }
</style>
