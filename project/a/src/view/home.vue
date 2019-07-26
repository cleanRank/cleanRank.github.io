<template>
  <div class="page-home">
    <!-- 首页头部金额提现 -->
    <el-row class="mod">
      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="mod-item">
        <div class="inner-box">
          <div class="name-item">
            <img src="./../assets/img/hp_icon_zhye.png" alt="">
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
            <img src="./../assets/img/hp_icon_ktxje.png" alt="">
          </div>
          <div class="inner-right">
            <p>可提现金额</p>
            <p>¥{{walletInfo.canWithdrawBalance || 0}}</p>
          </div>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="mod-item">
        <div class="inner-box">
          <button class="btn btn-cash" @click="goCashManage">立即提现</button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格部分 -->
    <div class="table-box">
      <el-table :data="messageList" style="width:100%">
        <el-table-column prop="accountNumber" label="账号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="handle-box">
              <!-- <div class="change" v-if="scope.row.status != 0" @click="toFillinfo(2,scope.row.status)">修改</div> -->
              <div class="check" @click="goPrivateManage(scope)">立即处理</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10,20,30,40]" :page-size="10" layout=" prev, pager, next,sizes, jumper" :total="20">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'standapply',
  data () {
    return {
      currentPage: 1,
      walletInfo: {},
      messageList: [{
        accountNumber: '1234567489',
        unprocessNum: 162
      }, {
        accountNumber: '1234567489',
        unprocessNum: 162
      }, {
        accountNumber: '1234567489',
        unprocessNum: 162
      }]
    }
  },
  components: {},
  created () {
    // this.showLoad(false)
    this.findUserWallet()
  },
  methods: {
    goCashManage () {
      this.$router.push({ path: '/cashManage' })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    findUserWallet () {
      // 获取钱包信息
      this.$http.findUserWallet().then(res => {
        this.walletInfo = Object.assign({}, { balance: 0, canWithdrawBalance: 0 }, res.result || {})
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss">
  .page-home {
    // 头部提现
    .mod{
      margin: 40px 20px 0 20px;
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
            display: flex;
            justify-content: center;
            margin-right: 10px;
            img{
              width: auto;
              height: 70px;
            }
          }
          .inner-right{
            height: 132px;
            display: flex;
            justify-content: center;
            flex-direction: column;
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
    // 表格部分
    .table-box {
      margin-top: 20px;
      padding: 0 20px 0 20px;

      .el-table {
        padding: 20px 20px 0 20px;

        &::before {
          height: 0;
        }
      }

      .el-table__header {
        th {
          background: #EBECF0;
        }
      }

      .cell {
        text-align: center;
      }

      .handle-box {

        .check {
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(254, 175, 39, 1);
          line-height: 17px;
          border-radius: 0;
          border: 0;
        }
      }

      .block {

        .el-pager li {
          padding: 0;
          width: 28px;
          border-radius: 4px;
          border: 1px solid rgba(229, 229, 229, 1);
          min-width: 0;
          margin: 0 4px;
          color: #666;

          &.active {
            color: #fff;
            border: 1px solid #FEAF27;

            &:hover {
              color: #fff !important;
            }
          }

          &:hover {
            color: #666 !important;
          }
        }

        .el-pagination {
          padding-top: 58px;

          button {
            padding: 0
          }

          .btn-next,
          .btn-prev {
            border-radius: 4px;
            border: 1px solid rgba(229, 229, 229, 1);

            &:hover {
              color: #333;
            }
          }

          .btn-next {
            padding-left: 0;
            margin-left: 4px;
          }

          .btn-prev {
            padding-right: 0;
            margin-right: 4px;
          }
        }

        .el-pagination button,
        .el-pagination span:not([class*=suffix]) {
          min-width: 0;
          width: 28px;
        }

        .el-pagination__jump {
          margin-left: 86px;
        }

        .el-pagination__sizes {
          margin: 0 10px 0 16px;
        }
      }
    }

  }

</style>
