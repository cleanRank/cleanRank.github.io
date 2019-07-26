<template>
  <div class="page-cashmanage">
    <el-row class="top-content">
      <el-col  :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="left-box">
          <span>账户管理</span>
          <span>提现管理</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="mod">
      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="mod-item">
        <div class="inner-box">
          <div class="name-item">
            <img src="../../assets/icon/hp_icon_zhye.png" alt="">
          </div>
          <div class="inner-right">
            <p>账户余额</p>
            <p>¥{{walletInfo.balance || 0}}</p>
          </div>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="mod-item">
        <div class="inner-box">
          <div class="name-item">
            <img src="../../assets/icon/hp_icon_ktxje.png" alt="">
          </div>
          <div class="inner-right">
            <p>可提现金额</p>
            <p>¥{{walletInfo.canWithdrawBalance || 0}}</p>
          </div>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="mod-item">
        <div class="inner-box">
          <button class="btn btn-cash" @click="showMask=true">立即提现</button>
        </div>
      </el-col>
    </el-row>
    <div class="table-box">
      <h5>提现记录</h5>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="提现编号" class="mr50">
          <el-input v-model="searchForm.withdrawLogId" placeholder="提现编号"></el-input>
        </el-form-item>
        <el-form-item label="选择时间" class="mr50">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search"><i class="el-icon-search"></i> 查询</el-button>
          <el-button  @click="resert"><i class="el-icon-refresh"></i> 重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="withdrawList"  >
        <el-table-column prop="id" label="提现编号" width="100"></el-table-column>
        <el-table-column width="180" prop="gmtCreated" label="提现时间"></el-table-column>
        <el-table-column prop="applyAmt" label="提现金额"></el-table-column>
        <el-table-column prop="handlingFeeAmt" label="手续费"></el-table-column>
        <el-table-column prop="realAmt" label="实际金额"></el-table-column>
        <el-table-column prop="alipayAccount" label="支付宝账号"></el-table-column>
        <el-table-column prop="alipayName" label="支付宝名称"></el-table-column>
        <el-table-column class="color1" prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.class">{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :background="true"
        layout="prev, pager, next, sizes, jumper"
        :page-size="searchForm.size"
        @current-change="selectPage"
        @size-change="handleSizeChange"
        :total="totalPage">
        </el-pagination>
    </div>
    <div class="applydrawMask" v-show="showMask">
      <div class="mask-content">
         <h3 class="mask-title">立即提现<i class="" @click="showMask=false">×</i></h3>
        <div class="input-box">
          <el-form label-position="left" label-width="100px">
             <el-form-item label="输入金额">
                <el-input placeholder="请输入金额" v-model="formValue.applyAmt"></el-input>
              </el-form-item>
              <el-form-item label="支付宝账号">
                <el-input placeholder="请输入支付宝账号" v-model="formValue.alipayId"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名">
                <el-input placeholder="请输入真实姓名" v-model="formValue.realName"></el-input>
              </el-form-item>
          </el-form>
        </div>
        <div class="btn-box">
          <div class="confirm" @click="postData">确定</div>
          <div class="cancel" @click="showMask=false">取消</div>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
import { isName } from 'lib/until'
export default {
  name: 'standapply',
  data () {
    return {
      searchForm: {
        withdrawLogId: null,
        time: [],
        page: 1,
        startTime: '',
        endTime: '',
        size: 10
      },
      totalPage: 1,
      withdrawList: [], // 提现记录
      walletInfo: {},
      formValue: {
        applyAmt: null,
        alipayId: null,
        realName: null
      },
      showMask: false
    }
  },
  created () {
    this.findUserWallet() // 获取钱包信息
    this.search()
  },
  watch: {
    showMask (newvalue) {
      if (!newvalue) {
        this.formValue = {
          applyAmt: null,
          alipayId: null,
          realName: null
        }
      }
    }
  },
  methods: {
    dateChange (e) {
      if (!e) {
        this.searchForm.time = []
      }
    },
    search () {
      let reg = new RegExp("^[0-9]*$")
      if (this.searchForm.withdrawLogId && !reg.test(this.searchForm.withdrawLogId)) return this.$message({ message: '提现编号格式不正确' })
      this.findChildWithdrawLogPage()
    },
    resert () {
      Object.assign(this.searchForm, { withdrawLogId: '', time: [], page: 1, startTime: '', endTime: '' })
      this.search()
    },
    selectPage (e) {
      this.searchForm.page = e
      this.findChildWithdrawLogPage()
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.findChildWithdrawLogPage()
    },
    checkInput () {
      if (!this.formValue.applyAmt) {
        this.$message({
          message: "请输入提现金额"
        })
        return false
      }
      if (this.formValue.applyAmt * 1 <= 0) {
        this.$message({
          message: "提现金额不能小于等于0元"
        })
        return false
      }
      if (this.formValue.applyAmt * 1 > this.walletInfo.canWithdrawBalance * 1) {
        this.$message({
          message: "提现金额大于可提现金额，请重新输入"
        })
        return false
      }
      if (!this.formValue.alipayId) {
        this.$message({
          message: "请输入支付宝账号"
        })
        return false
      } else if (!this.formValue.realName) {
        this.$message({
          message: "请输入姓名"
        })
        return false
      } else if (!isName(this.formValue.realName)) {
        this.$message({
          message: "姓名格式不正确"
        })
        return false
      }
      return true
    },
    postData () { // 立即提现
      if (!this.checkInput()) return
      let param = {
        applyAmt: this.formValue.applyAmt,
        alipayAccount: this.formValue.alipayId,
        alipayName: this.formValue.realName
      }
      this.$http.applyWithdraw(param).then(res => {
        this.showMask = false
        this.findUserWallet() // 获取钱包信息
        this.search()
      })
    },
    // 分页获取
    findChildWithdrawLogPage () {
      let params ={
        page: this.searchForm.page,
        size: this.searchForm.size,
        param: {
          endTime: this.searchForm.time ? this.searchForm.time[1] : '',
          startTime: this.searchForm.time ? this.searchForm.time[0] : '',
          withdrawLogId: this.searchForm.withdrawLogId
        }
      }
      this.$http.findChildWithdrawLogPage(params).then(res => {
        let data = res.result
        this.withdrawList = data.datas || []
        this.totalPage = data.total
        console.log(this.totalPage)
        this.withdrawList.forEach(item => {
          item.applyAmt = item.applyAmt.toFixed(2)
          item.handlingFeeAmt = item.handlingFeeAmt.toFixed(2)
          item.realAmt = item.realAmt.toFixed(2)
          switch (item.withdrawStatus) {
            case 1:
              item.status = '已申请'
              item.class="color2"
              break
            case 2:
              item.status = '已拒绝'
              item.class="color1"
              break
            case 3:
              item.status = '已同意'
              item.class="color3"
              break
            case 4:
              item.status = '已驳回'
              item.class="color1"
              break
            case 5:
              item.status = '已付款'
              item.class="color3"
          }
        })
      }).catch(e => {})
    },
    // 获取钱包信息
    findUserWallet () {
      this.$http.findUserWallet().then(res => {
        this.walletInfo = Object.assign({}, { balance: 0, canWithdrawBalance: 0 }, res.result || {})
        this.walletInfo.balance = this.walletInfo.balance.toFixed(2)
        this.walletInfo.canWithdrawBalance = this.walletInfo.canWithdrawBalance.toFixed(2)
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/_flex.scss';
$color:#5584FF;
.page-cashmanage{
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
        justify-content: center;
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

  .table-box{
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
  .applydrawMask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .el-input,.el-input__inner{
      width: 140px;
      height: 30px;
    }
    .mask-content{
      width: 565px;
      background: #fff;
    }
    .mask-title{
      width: 100%;
      height: 45px;
      background: #FFC455;
      color: #fff;
      font-size: 15px;
      text-align: center;
      line-height: 45px;
      position: relative;
      font-weight: normal;
      i{
        position: absolute;
        right: 0;
        top: 0;
        width: 45px;
        height: 45px;
        font-size: 20px;
        line-height: 40px;
        cursor: pointer;
      }
    }
    .input-box{
      width: 100%;
      padding:30px 0 20px;
      .el-form{
        width: 300px;
        margin: 0 auto;
      }
    }
    .btn-box{
      text-align: center;
      padding-bottom: 30px;
      div{
        width: 117px;
        height: 34px;
        display: inline-block;
        font-size: 14px;
        color: #000000;
        text-align: center;
        line-height: 34px;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        &.confirm{
          color: #fff;
          background: #FFC455;
          margin-right: 20px;
        }
        &.cancel{
          border:1px solid rgba(229,229,229,1);
        }
      }
    }
  }
  .color1{
    color: #FF5E4B;
  }
  .color2{
    color: #FEAF27;
  }
  .color3{
    color: #2CCD7F;
  }
}
.el-message{
  z-index: 99999 !important;
}
</style>
