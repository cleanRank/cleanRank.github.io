<template>
  <div class="leftMenu" :class="{'isCollapse':isCollapse}">
    <div class="top-logo">
      <img src="../../assets/icon/logo.png" class="logo">
      <span v-show="!isCollapse">陌玩</span>
    </div>
      <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="activePath" unique-opened>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-data menu-i"></i>
            <span class="menu-firstMenu-title">首页</span>
          </template>
          <el-menu-item :disabled="isdisabled" v-for="(item, index) in home" :key="index" :index="item.name" class="menu-secondMenu-title" @click="selectMenu(item)">
            {{item.meta.title}}
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2" :disabled="isdisabled">
          <template slot="title">
            <i class="el-icon-postcard menu-i"></i>
            <span class="menu-firstMenu-title">账号管理</span>
          </template>
          <el-menu-item :disabled="isdisabled" v-for="(item, index) in loginManage" :key="index" :index="item.name" class="menu-secondMenu-title"  @click="selectMenu(item)">
            {{item.meta.title}}
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3" :disabled="isdisabled">
          <template slot="title">
            <i class="el-icon-chat-line-round menu-i"></i>
            <span class="menu-firstMenu-title">陪聊管理</span>
          </template>
          <el-menu-item :disabled="isdisabled" v-for="(item, index) in talkManage" :key="index" :index="item.name" class="menu-secondMenu-title"  @click="selectMenu(item)">
            {{item.meta.title}}
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4" :disabled="isdisabled">
          <template slot="title">
            <i class="el-icon-coin menu-i"></i>
            <span class="menu-firstMenu-title">账户管理</span>
          </template>
          <el-menu-item :disabled="isdisabled" v-for="(item, index) in accountManage" :key="index" :index="item.name" class="menu-secondMenu-title"  @click="selectMenu(item)">
            {{item.meta.title}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
  </div>
</template>

<script>
import home from 'router/home'
import loginManage from 'router/loginManage'
import accountManage from '@/router/accountManage'
import talkManage from '@/router/talkManage'
import { mapGetters, mapState } from 'vuex'
export default {
  name: "leftMenu",
  data () {
    return {
      home,
      loginManage,
      accountManage,
      talkManage,
      defaultActive: ''
      // isdisabled: false
    }
  },
  props: {
    // isdisabled: {
    //   default: false,
    //   required: Boolean
    // }
  },
  // watch: {
  //   $route () {
  //     let path = this.$route.fullPath
  //     console.log(this.$route)
  //     this.initMenuIndex(path)
  //   }
  // },
  created () {
  },
  mounted () {
    // // 如果还未申请入驻或者审核中 左侧栏不可点击
    // let info = JSON.parse(localStorage.getItem('supplierInfo'))
    // if (!info || (info && info.auditStatus == '0')) {
    //   this.isdisabled = true
    // }
  },
  methods: {
    selectMenu (item) {
      this.$router.push({ path: item.path })
    },
    selectTab (e) {
      let [i, j] = e.split('-')
      this.$router.push({ path: this.redirectList[i-1][j-1].path })
    },
    changeCollapseStatus () {
      this.updateCollapse(!this.isCollapse)
    }
  },
  computed: {
    ...mapGetters({
      isCollapse: "getConfigInfo"
    }),
    ...mapState({
      // isdisabled: state => state.globelData.isdisabled
      isdisabled: state => false
    }),
    activePath () {
      return this.$route.query.activePath || this.$route.meta.activePath || this.$route.name
    }
  }
}
</script>

<style lang="scss">
  .leftMenu {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    color: #fff;
    .el-menu{
      background: #fff;
      border-right: none;
      height: 100%;
      .el-submenu{
        &.is-active{
          .menu-firstMenu-title{
            color: #FEAF27;
          }
        }
      }
    }
    .top-logo{
      height: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        font-size: 16px;
        color: #333;
        font-weight: 600;
        margin-left: 17px;
      }
    }
    &.isCollapse{
      .logo{
        width: 50px;
      }
      h5{
        display: none;
      }
      .cotent-leftMenu{
        width: 64px;
        height: 100%;
        background: #001529;
      }
    }
    img.logo{
      width:50px;
      height:50px;
    }
    h5{
      margin-left: 20px;
    }
    .no-border-right {
      border-right: none;
    }
    img.icon{
      margin-right: 5px;
    }
    .el-submenu__title:focus{
      background: none!important;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
    height: 100%;
  }
  .icon-menu{
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }
  .menu-firstMenu-title{
    color: #333333;
    font-size: 16px;
  }
  .menu-secondMenu-title{
    color: #333 !important;
    font-size: 14px!important;
    &:hover{
      background: #fff!important;
      color: #FEAF27!important;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }
.el-submenu {
  &.is-active{
    .el-submenu__title{
      .menu-i{
        color: #FEAF27;
      }
    }
  }
  .el-submenu__title{
    .menu-i{
      font-size: 22px!important;
    }
    &:hover{
      background: none!important;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }
}
.el-menu.el-menu--inline{
  li.is-active{
    background: #fff!important;
    color: #FEAF27!important;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  li{
    width: 200px;
    margin:8px auto 0;
    padding-left: 40px!important;
    height:42px;
    line-height: 42px;
  }
}
.el-menu--vertical{
  .el-menu{
    .menu-firstMenu-title{
      color: #333;
      font-size: 12px;
    }
    .menu-secondMenu-title{
      color: #333!important;
      font-size: 12px!important;
      background: #fff!important;
      &.is-active{
        color: #FEAF27!important;
        background: #fff!important;
      }
      &:hover{
        color: #FEAF27!important;
        background: #fff!important;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
      width: 200px;
      margin:15px auto 0;
      padding-left: 40px!important;
      height:42px;
      line-height: 42px;
    }
  }
}
</style>
