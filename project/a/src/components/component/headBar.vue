<template>
  <div class="headBar">
    <div class="collapseBtn" @click="changeCollapseStatus">
      <img :class="{'isCollapse':isCollapse}" src="../../assets/icon/meunfold.png" alt="">
    </div>
    <el-row class="headerBar-right" display="flex">
      <el-col :span="22" class="welcome">
        <span>欢迎光临进入陌玩聊天系统</span>
      </el-col>
      <!--<el-col :span="8" class="update-psw">-->
      <!---->
      <!---->
      <!--</el-col>-->
      <el-col :span="2" class="logout">
        <el-dropdown>
          <div class="header-auth">
            <img src="../../assets/icon/default_handsome.jpg" class="default-img" alt="">
            <span>小甘菊</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="modPwd"><i class="el-icon-edit"></i>修改密码</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="loginOut"><i class="el-icon-switch-button"></i>退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tracker } from 'lib/analytics'
import { delSessionStorage } from 'lib/until'
import {
  mapActions,
  mapGetters,
  mapState
} from 'vuex'
export default {
  name: "headBar",
  computed: {
    ...mapGetters({
      isCollapse: "getConfigInfo"
    }),
    ...mapState({
      clientWidth: state => state.config.clientWidth,
      supplierInfo: state => state.globelData.supplierInfo
    })
  },
  data () {
    return {
      hiddenInfo: false,
      hiddenName: false,
      hiddenMoreInfo: false,
      phone: null,
      onShow: true
    }
  },
  beforeUpdate () {
    this.checkClientWidth()
  },
  mounted () {
    this.checkClientWidth()
    this.phone = localStorage.getItem('supplierPhone')
  },
  methods: {
    ...mapActions([
      'updateCollapse'
    ]),
    modPwd () {
      this.$store.commit("ISSHOW", this.onShow)
    },
    loginOut () {
      this.$confirm('退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async (action) => {
        if (action == 'confirm') {
          tracker.deleteToken()
          // this.$http.loginOut({}).then(res => {}).catch(err => {})
          delSessionStorage()
          localStorage.clear()
          this.$router.push({
            path: '/login'
          })
        }
      })
    },
    checkClientWidth () {
      if (!this.isCollapse) {
        this.hiddenMoreInfo = this.clientWidth < 1245
        this.hiddenInfo = this.clientWidth < 1025
        this.hiddenName = this.clientWidth < 850
      } else {
        this.hiddenMoreInfo = this.clientWidth < 1245
        this.hiddenInfo = this.clientWidth < 900
        this.hiddenName = this.clientWidth < 680
      }
    },
    changeCollapseStatus () {
      this.updateCollapse(!this.$store.state.config.isCollapse)
    }
  }
}
</script>

<style lang="scss">
  .el-button.el-button--small {
    width: 70px !important;
  }
  .headBar {
    position: relative;
    box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    height: 93px;
    overflow: hidden;
    /*border:1px solid black;*/
    width: 100%;
    line-height: 93px;
    padding: 0 20px;
    background: #fff;
    color: #333;

    .headerBar-right {
      margin-left: 55px;
      min-width: 215px;
      white-space: nowrap;
    }

    .company-name {
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }

    .company-info {
      font-size: 14px;
      /*min-width: 400px;*/
    }

    .welcome,
    .update-psw,
    .logout {
      font-size: 14px;
      text-align: right;
    }

    .welcome {
      display: flex;
      justify-content: flex-end;

      span:first-child {
        color: #FEAF27;
        font-size: 14px;
        margin-right: 87px;
      }

      span:first-child+span {
        color: #333;
        font-size: 13px;
        margin-right: 56px;
      }
    }

    .logout {
      min-width: 50px;
    }

    .header-auth {
      height: 93px;
      width: 93px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .default-img {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }

    .collapseBtn {
      position: absolute;
      left: 0;
      background: #fff;
      width: 50px;
      height: 93px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 20px;
        height: 20px;

        &.isCollapse {
          transform: rotate(-180deg);
          -webkit-transform: rotate(-180deg);
          -moz-transform: rotate(-180deg);
        }

        transition: transform .2s ease,
        -webkit-transform .2s ease;
        -webkit-transition: transform .2s ease,
        -webkit-transform .2s ease;
        -moz-transition: transform .2s ease,
        -webkit-transform .2s ease;
      }
    }

    .hidden {
      display: none;
    }
  }

</style>
