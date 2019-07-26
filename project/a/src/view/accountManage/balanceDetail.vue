<template>
  <div class="page-balanceDetail">
    <el-row class="top-content">
      <el-col  :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="left-box">
          <span>账户管理</span>
          <span>余额明细</span>
        </div>
      </el-col>
    </el-row>
    <div class="balanceDetail-table-box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="交易编号" class="mr50">
          <el-input v-model="searchForm.walletLogId" placeholder="交易编号"></el-input>
        </el-form-item>
        <el-form-item label="订单事件" class="mr50">
          <el-select v-model="searchForm.changeEvent" placeholder="订单事件">
            <el-option v-for="type in orderType" :key="type.changeEvent" :label="type.name" :value="type.changeEvent"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费对象" class="mr50">
          <el-input v-model="searchForm.spendUserId" placeholder="消费对象"></el-input>
        </el-form-item>
        <el-form-item label="关联账号" class="mr50">
          <el-input v-model="searchForm.childUserId" placeholder="关联账号"></el-input>
        </el-form-item>
        <el-form-item label="选择时间" class="mr50">
          <el-date-picker
            v-model="timeList"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            @change="dateChange"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search"><i class="el-icon-search"></i> 查询</el-button>
          <el-button  @click="resert"><i class="el-icon-refresh"></i> 重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="walletList"  >
        <el-table-column prop="id" label="交易编号" width="100"></el-table-column>
        <el-table-column prop="gmtCreated" width="180" label="时间"></el-table-column>
        <el-table-column prop="changeAmt" label="金额"></el-table-column>
        <el-table-column prop="changeText" label="事件"></el-table-column>
        <el-table-column prop="spendUserId" label="消费对象"></el-table-column>
        <el-table-column prop="childUserId" label="关联账号"></el-table-column>
        <el-table-column prop="changeAfterBalance" label="余额"></el-table-column>
      </el-table>
      <el-pagination
        :background="true"
        layout="prev, pager, next, sizes, jumper"
        :page-size="pageSize"
        @current-change="selectPage"
        @size-change="handleSizeChange"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'standapply',
  data () {
    return {
      orderType: [{
        changeEvent: '',
        name: '全部'
      }, {
        changeEvent: 1,
        name: '会员付费'
      }, {
        changeEvent: 2,
        name: '发送红包'
      }, {
        changeEvent: 3,
        name: '收到红包'
      }, {
        changeEvent: 4,
        name: '红包退回'
      }, {
        changeEvent: 5,
        name: '单次查看'
      }, {
        changeEvent: 6,
        name: '收到查看'
      }, {
        changeEvent: 7,
        name: '单次会话'
      }, {
        changeEvent: 8,
        name: '收到会话'
      }, {
        changeEvent: 9,
        name: '钱包充值'
      }, {
        changeEvent: 10,
        name: '提现'
      }, {
        changeEvent: 11,
        name: '提现拒绝退回'
      }, {
        changeEvent: 12,
        name: '用户提现驳回退回'
      }],
      searchForm: {
        walletLogId: '',
        changeEvent: '',
        spendUserId: '',
        childUserId: ''
      },
      totalPage: 1,
      pageSize: 10,
      page: 1,
      timeList: [],
      walletList: [] // 钱包流水
    }
  },
  created () {
    this.findChatWalletLogPage()
  },
  methods: {
    dateChange (e) {
      console.log(e)
      if (!e) {
        this.timeList = []
      }
    },
    search () {
      let reg = new RegExp("^[0-9]*$")
      if (!reg.test(this.searchForm.walletLogId)) return this.$message({ message: '交易编号格式不正确' })
      if (!reg.test(this.searchForm.spendUserId)) return this.$message({ message: '消费对象格式不正确' })
      if (!reg.test(this.searchForm.childUserId)) return this.$message({ message: '关联账号格式不正确' })
      this.findChatWalletLogPage()
    },
    resert () {
      this.timeList = []
      Object.assign(this.searchForm, { walletLogId: '', childUserId: '', spendUserId: '', changeEvent: '', startTime: '', endTime: '' })
      this.findChatWalletLogPage()
    },
    selectPage (e) {
      this.page = e
      this.findChatWalletLogPage()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.findChatWalletLogPage()
    },
    findChatWalletLogPage () { // 订单信息列表
      Object.assign(this.searchForm, { startTime: this.timeList ? this.timeList[0] : '', endTime: this.timeList ? this.timeList[1] : '' })
      let params = {
        page: this.page,
        size: this.pageSize,
        param: this.searchForm
      }
      this.$http.findChatWalletLogPage(params).then(res => {
        let data = res.result
        this.walletList = data.datas || []
        this.totalPage = data.total
        this.walletList.forEach(item => {
          item.changeAmt = item.changeAmt.toFixed(2)
          item.changeAfterBalance = item.changeAfterBalance.toFixed(2)
          switch (item.changeEvent) {
            case 1:
              item.changeText = '会员付费减少'
              break
            case 2:
              item.changeText = '发送红包减少'
              break
            case 3:
              item.changeText = '收到红包增加'
              break
            case 4:
              item.changeText = '红包退回增加'
              break
            case 5:
              item.changeText = '查看视频减少'
              break
            case 6:
              item.changeText = '被查看视频增加'
              break
            case 7:
              item.changeText = '发起聊天减少'
              break
            case 8:
              item.changeText = '接收聊天增加'
              break
            case 9:
              item.changeText = '钱包充值增加'
              break
            case 10:
              item.changeText = '提现减少'
              break
            case 11:
              item.changeText = '提现拒绝退回增加'
              break
            case 12:
              item.changeText = '提现驳回退回增加'
              break
            case 13:
              item.changeText = '查看联系方式减少'
              break
            case 14:
              item.changeText = '被查看联系方式增加'
          }
        })
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/_flex.scss';
$color:#5584FF;
.page-balanceDetail{
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
  .balanceDetail-table-box{
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
    .handle-box{
      .change,.check{
        display: inline-block;
        // width: 50px;
        // height: 25px;
        width: 20%;
        height: 20%;
        min-width: 30px;
        text-align: center;
        line-height: 25px;
        font-size: 12px;
        color: $color;
        border-radius:4px;
        border:1px solid rgba(85,132,255,1);
        &.change{
          color: #FFC455;
          border-color: #FFC455;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
