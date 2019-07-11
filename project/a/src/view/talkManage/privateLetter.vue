<template>
  <div class="page-private-letter">
    <el-row class="top-content">
      <el-col  :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
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
              <el-option v-for="list in accountList" :key="list.id" :label="list.nickname" :value="list.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="user-list">
          <div class="user-mod" @click="selectUserToChat">
            <div class="img">
              <img src="../../assets/icon/logo.png" alt="">
            </div>
            <div class="info">
              <div class="top">
                <span>白云黑土</span>
                <span>20:53</span>
              </div>
              <div class="bottom">
                <span>可以认识一下吗，可以认识一…</span>
                <span><em>99+</em></span>
              </div>
            </div>
          </div>
          <div class="user-mod">
            <div class="img">
              <img src="../../assets/icon/logo.png" alt="">
            </div>
            <div class="info">
              <div class="top">
                <span>白云黑土</span>
                <span>20:53</span>
              </div>
              <div class="bottom">
                <span>可以认识一下吗，可以认识一…</span>
                <span><em>99+</em></span>
              </div>
            </div>
          </div>
          <div class="user-mod">
            <div class="img">
              <img src="../../assets/icon/logo.png" alt="">
            </div>
            <div class="info">
              <div class="top">
                <span>白云黑土</span>
                <span>20:53</span>
              </div>
              <div class="bottom">
                <span>可以认识一下吗，可以认识一…</span>
                <span><em>99+</em></span>
              </div>
            </div>
          </div>
          <div class="user-mod">
            <div class="img">
              <img src="../../assets/icon/logo.png" alt="">
            </div>
            <div class="info">
              <div class="top">
                <span>白云黑土</span>
                <span>20:53</span>
              </div>
              <div class="bottom">
                <span>可以认识一下吗，可以认识一…</span>
                <span><em>99+</em></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="letter-currentUser">
        <im-component :user-info="currentHxAccountInfo" :bindMessageCallback='bindMessageCallback'>
          <div class="im-header-name">白云黑土</div>
        </im-component>
      </div>
      <div class="letter-userInfo">
        <div class="header"></div>
        <user-info></user-info>
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
      currentHxAccountInfo: {
        user: '',
        pwd: ''
      }, // 当前账户环信账号密码
      searchForm: {
        subAccountId: ''
      },
      accountList: [] // 账号列表
    }
  },
  components: {
    imComponent,
    userInfo
  },
  created () {
    let _this = this
    this.getAccountList()
    Object.assign(this.$imoption, { user: '50', pwd: 'e10adc3949ba59abbe56e057f20f883e' })
    Object.assign(this.currentHxAccountInfo, { user: '50', pwd: 'e10adc3949ba59abbe56e057f20f883e' })
    this.$imconn.open(this.$imoption)
    this.$imconn.listen({
      onOpened: function (res) {
        console.log('用户已上线')
        _this.$imconn.getChatRooms({
          apiUrl: _this.$webIM.config.apiURL,
          pagenum: 1,
          pagesize: 10,
          success: function (res) {
          }
        })
        let msgId = _this.$imconn.getUniqueId()
        let deliverMessage = new WebIM.message('txt', msgId)
        deliverMessage.set({
          id: msgId,
          to: 'wetest005',
          msg: 'shdiahdasjdakj',
          success (res) {
            console.log('发送成功')
          }
        })
        deliverMessage.body.chatType = 'singleChat'
        _this.$imconn.send(deliverMessage.body)
      },
      onTextMessage (res) {
        console.log('收到文本消息', res)
      }
    })
  },
  methods: {
    // 选择聊天对象
    selectUserToChat () {
      Object.assign(this.currentHxAccountInfo, { user: '51', pwd: 'sadasdsa' })
    },
    // 选择当前账号
    selectAccount (e) {
      this.searchForm.subAccountId = e
      this.$imconn.close() // 断开前账号连接，准备重新连接新账号通讯
      this.findByUserId(e)
    },
    async getAccountList () { // 获取陪聊账号列表
      let accountList = await this.$http.getAccountList() || []
      if (accountList && accountList.result && accountList.result && accountList.result.length) {
        this.accountList = accountList.result
        this.searchForm.subAccountId = this.accountList[0].id
      }
      this.findByUserId()
    },
    findByUserId () { // 获取当前账号环信账号密码
      if (this.searchForm.subAccountId) {
        this.$http.findByUserId({ userId: this.searchForm.subAccountId }).then(res => {
          if (res.result) {
            Object.assign(this.currentHxAccountInfo, { user: res.result.username, pwd: res.result.password })
            Object.assign(this.$imoption, { user: res.result.username, pwd: res.result.password })
          }
        }).catch(e => {})
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
$color:#5584FF;
.page-private-letter{
  .top-content{
    width: 100%;
    height: 75px;
    box-sizing: border-box;
    padding: 20px 20px 0 0px;
    font-size: 14px;
    color: #333;

    .left-box{
      float: left;
      span{
        position: relative;
        margin-right: 15px;
        &:not(:last-child){
          color: #666;
          &::after{
            content: '>';
            display:inline-block;
            position: absolute;
            right: -13px;
            top:0;
          }
        }
      }
    }
  }
  .letter{
    @include display-flex();
    height: 880px;
    border: 1px solid #F0F0F0;
    background: #fff;
    .letter-recentUserList{
      width: 280px;
      .inherlint{
        height: 53px;
        @include display-flex();
        @include align-items(center);
        background: #F0F0F0;
        .el-form-item{
          margin-bottom: inherit;
        }
      }
      .user-list{
        background: #fff;
        .user-mod{
          @include display-flex();
          height: 75px;
          padding-right: 10px;
          @include align-items(center);
          border-bottom: 1px solid #F0F0F0;
          &.active{
            background: #FAFAFA;
          }
          .img{
            flex: 70px 0;
            @include display-flex();
            @include align-items(center);
            @include justify-content(center);
            img{
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
          .info{
            flex: 1;
            .top{
              @include display-flex();
              @include justify-content(space-between);
              span:first-child{
                font-size: 14px;
                color: #333;
                font-weight: 500;
              }
              span:first-child+span{
                font-size: 12px;
                color: #999;
              }
            }
            .bottom{
              @include display-flex();
              @include justify-content(space-between);
              margin-top: 5px;
              span:first-child{
                font-size: 12px;
                color: #666;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              span:first-child+span{
                width: 30px;
                em{
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
    .letter-currentUser{
      width: 580px;
      .im-header-name{
        height: 53px;
        background: #F0F0F0;
        line-height: 53px;
        text-align: center;
      }
    }
    .letter-userInfo{
      width: 225px;
      .header{
        height: 53px;
        background: #F0F0F0;
        line-height: 53px;
        text-align: center;
      }
    }
  }
}
</style>
