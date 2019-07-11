<template>
  <div class="page-userList">
    <el-row class="top-content">
      <el-col  :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="left-box">
          <span>陪聊管理</span>
          <span>用户列表</span>
        </div>
      </el-col>
    </el-row>
    <div class="userList-table-box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="当前账号" class="mr50">
          <el-select v-model="searchForm.subAccountId" placeholder="当前账号">
            <el-option v-for="list in accountList" :key="list.id" :label="list.nickname" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前位置" class="mr50">
          <el-select v-model="provinceName" placeholder="选择省份" class="mr50" @change="selectCity">
            <el-option v-for="province in provinceList" :key="province.province" :label="province.provinceName" :value="province.province"></el-option>
          </el-select>
          <el-select v-model="cityName" placeholder="选择城市">
            <el-option v-for="city in cityList" :key="city.city" :label="city.cityName" :value="city.city"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否在线" class="mr50">
          <el-select v-model="searchForm.stealth" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="离线" value="0"></el-option>
            <el-option label="在线" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mr50">
          <el-checkbox-group v-model="linkTypesChecked">
            <el-checkbox v-for="type in linkTypes" :label="type.id" :key="type.id">{{type.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="getLinkPersonList"><i class="el-icon-search"></i> 查询</el-button>
          <el-button  @click="resert"><i class="el-icon-refresh"></i> 重置</el-button>
        </el-form-item>
      </el-form>
      <div class="mod clearfix">
        <h5>用户列表</h5>
        <el-row>
          <el-col :span="16">
            <div class="item-mod" v-for="(item, index) in fansList" :key="index">
              <div class="item-img-info">
                <img :src="item.avatar?item.avatar:'https://waterelephant.oss-cn-shanghai.aliyuncs.com/images/wxfile://tmp_0cd3fd948e550550d09e279f8b803aab.jpg'" alt="">
              </div>
              <div class="item-user-info">
                <div class="info-basic">
                  <span>{{item.nickname}}</span>
                  <span>用户ID：{{item.friendId}}</span>
                </div>
                <div class="info-label">
                  <span class="label oranger">{{item.age}}.{{item.job}}</span>
                  <span class="label oranger">{{item.height}}.{{item.weight}}</span>
                  <span class="label red">年收入{{item.annualSalary}}w</span>
                  <span class="label gray">{{item.distance}}km</span>
                  <span class="label green">{{item.stealth==1?'在线':'下线'}}</span>
                  <span class="label red">微信:{{item.wechat}}</span>
                  <span class="label red">QQ:{{item.qq}}</span>
                </div>
                <div class="info-tag">
                  标签：
                  <span>查看过我&nbsp;&nbsp;</span>
                </div>
                <div class="info-opertor">
                  <span class="btn btn-oranger">私信</span>
                  <span class="btn btn-oranger-plain">连麦</span>
                  <span class="btn btn-pray" @click="checkDetail(item)">详情</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="useinfo-detail">
              <user :datas="userinfo"></user>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-pagination
        :background="true"
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="selectPage"
        :total="totalPage">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import user from '@/components/component/user'
export default {
  name: 'standapply',
  data () {
    return {
      linkTypesChecked: [],
      linkTypes: [{
        name: '查看过我',
        id: 1
      }, {
        name: '三天内赞过我',
        id: 2
      }, {
        name: '标记我为喜欢的人',
        id: 3
      }, {
        name: '私信过',
        id: 4
      }, {
        name: '连麦过',
        id: 5
      }, {
        name: '有红包往来',
        id: 6
      }],
      searchForm: {
        subAccountId: '', // 子账号id
        stealth: '', // 是否在线
        age: '',
        annualSalary: "",
        attention: '',
        auditStatus: '',
        distance: '',
        friendId: '',
        job: "",
        lat: '',
        lng: '',
        nickname: "",
        regionId: '',
        sex: ''
      },
      accountList: [], // 账号列表
      fansList: [], // 聊天列表
      provinceList: [], // 省列表
      cityList: [], // 城市列表
      totalPage: 10,
      pageSize: 10,
      page: 1,
      userinfo: {},
      provinceName: '',
      cityName: ''
    }
  },
  created () {
    this.getAccountList() // 获取陪聊账号
    this.getLinkPersonList() // 获取联系人列表
    this.getCity() // 获取省市区
  },
  methods: {
    checkDetail (item) { // 查看用户详细信息
      this.userinfo = item
    },
    resert () {
      this.linkTypesChecked = []
      this.cityName = ''
      this.provinceName = ''
      this.searchForm.subAccountId = ''
      this.searchForm.stealth = ''
    },
    selectCity (e) {
      this.getCity(e)
    },
    selectPage (e) {
      this.searchForm.page = e
    },
    getCity (regionId = 0) {
      this.$http.getCity({ regionId: regionId }).then(res => {
        let data = res.result || []
        if (regionId == 0) {
          this.provinceList = data
          this.provinceList.unshift({ provinceName: '全部', province: '' })
        } else {
          this.cityList = data
          this.cityList.unshift({ cityName: '全部', city: '' })
        }
      }).catch(e => {})
    },
    // 获取用户详情
    getUserDetailInfo (item) {
    },
    getAccountList () { // 获取陪聊账号列表
      this.$http.getAccountList().then(res => {
        this.accountList = res.result || []
        this.accountList.unshift({ id: '', nickname: '全部' })
      }).catch(e => {})
    },
    getLinkPersonList () { // 获取联系人列表
      this.searchForm.regionId = this.cityName
      Object.assign(this.searchForm, { actionTypes: this.linkTypesChecked })
      let param = {
        page: this.page,
        size: this.pageSize,
        param: this.searchForm
      }
      this.$http.getLinkPersonList(param).then(res => {
        this.fansList = res.result
        this.totalPage = res.result.totalPage
      }).catch(e => {})
    }
  },
  components: {
    user
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/_flex.scss';
$color:#5584FF;
$orangerColor:#FFF2DB;
$redColor:#FFEAEE;
$grayColor:#EDEDED;
.page-userList{
  min-height: 100%;
  .top-content{
    height: 60px;
    align-items: center;
    box-sizing: border-box;
    @include display-flex();
    @include align-items(center);
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
    .right-box{
      float: right;
      width: 73px;
      height: 28px;
      font-size: 12px;
      color: $color;
      background: #fff;
      border:1px solid $color;
      text-align: center;
      line-height: 28px;
      border-radius: 3px;
      &.active {
        color: #929292;
        border-color: #929292;
      }
    }
  }
  .mod{
    padding-left: 0;
    position: relative;
    min-height: 500px;
    .useinfo-detail{
      width: 225px;
      border:1px solid #F0F0F0;
    }
    .mod-item{
      margin-bottom: 20px;
      height: 132px;
      background:#F6F6F6;
      .inner-box{
        background: #fff;
        border-radius:6px;
        height: 132px;
        display: flex;
        align-items: center;
        padding-left: 50px;
        .btn-cash{
          width:100px;
          height:32px;
          border-radius:22px;
          border:1px solid rgba(190,190,190,1);
          background: #fff;
          font-size: 14px;
          color: #333;
        }
        .name-item{
          @include display-flex();
          @include align-items(center);
          margin-right: 10px;
          img{
            width: auto;
            height: 70px;
          }
        }
        .inner-right{
          height: 132px;
          @include display-flex();
          @include justify-content(center);
          @include flex-direction-column();
          p:first-child+p{
            color: #333;
            font-weight: 600;
            font-size: 16px;
          }
          p:first-child{
            color: #666;
            font-size: 12px;
            margin-top: -10px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  .total-box{
    display: flex;
    justify-content: space-between;
    padding:0 20px 0 0px;
  }
  .userList-table-box{
    h5{
      color: #333;
      font-size: 14px;
      font-size: 600;
      margin-bottom: 30px;
    }
    .mr50{
      margin-right: 50px;
    }
    background: #fff;
    padding:20px 20px 0 20px;
    .cell{
      text-align: center;
    }
  }
  .mod{
    h5{
      color: #333;
      font-size: 15px;
      font-size: 600;
    }
    .item-mod{
      margin-top: 20px;
      @include display-flex();
      .item-img-info{
        flex: 64px 0;
        padding-right: 15px;
        img{
          width: 64px;
          height: 64px;
          border-radius: 50%;

        }
      }
      .item-user-info{
        @include flex(1);
        @include display-flex();
        @include flex-direction-column();
        .info-basic {
          span:first-child{
            font-size: 12px;
            color: #333;
          }
          span:first-child+span{
            margin-left: 30px;
            color: #666666;
            font-size: 12px;
          }
        }
        .info-label{
          margin-top: 10px;
          .label{
            height: 20px;
            border-radius: 10px;
            font-size: 12px;
            padding: 0 6px;
            line-height: 20px;
            display: inline-block;
            text-align: center;
            margin-right: 10px;
            &.oranger{
              background: $orangerColor;
              color: #AE6B00;
            }
            &.red{
              background: $redColor;
              color: #D0697F;
            }
            &.gray{
              background: $grayColor;
              color: #666666;
            }
            &.green{
              background: #E5FFEF;
              color: #6CC497;
            }
          }
        }
        .info-tag{
          margin-top: 10px;
          font-size: 12px;
          color: #999;
        }
        .info-opertor{
          margin-top: 10px;
          .btn{
            width:50px;
            height:27px;
            display: inline-block;
            line-height: 27px;
            text-align: center;
            font-size: 12px;
            margin-right: 10px;
            border-radius:4px;
            cursor: pointer;
            &.btn-oranger{
              background: #FEAF27;
              color: #fff;
              border: 1px solid #FEAF27;
            }
            &.btn-oranger-plain{
              background: #fff;
              color: #FEAF27;
              border: 1px solid #FEAF27;
            }
            &.btn-pray{
              background: #fff;
              color: #666;
              border: 1px solid #E5E5E5;
            }
            &.btn-green{
              background: #E5FFEF;
              color: #6CC497;
              border: 1px solid #E5E5E5;
            }
          }
        }
      }
    }
  }
}
</style>
