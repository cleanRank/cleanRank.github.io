<template>
  <section class="agreementWrap">
    <ul class="xyList">
      <li class="flex" v-for='(checkb, idex) in checkboxList' :key="idex">
        <span class="cell_0" @click="checked(checkb)"><input type="checkbox" class="agree" name="radioContent"  :checked="checkList.indexOf(checkb)>-1" :value="checkb.value"></span>
        <router-link tag="a" :to="checkb.link" class="cell_1">{{checkb.value}}</router-link>
      </li>
    </ul>
    <div class="flex addorder_box">
      <p class="cell_1 money_txt" @click="checkall">
        <input type="checkbox" class="agree" name="radioContent":checked="isCheckAll" ><span>{{isCheckAll?'已选':'全选'}}</span>
      </p>
      <p class="cell_0 confirmorder_btn" :class="isCheckAll?'':'hui'" @click="confirm($event)">我已知晓并确认</p>
    </div>
  </section>
</template>
<script>
  import { app, getQueryString } from 'lib/until'
  export default {
    data () {
      return {
        checkboxList: [{
          id: '1',
          value: '借款协议',
          link: 'jkxy'
        },
        {
          id: '2',
          value: '征信及信息披露授权书',
          link: 'zxjxxplsqs'
        },
        {
          id: '3',
          value: '商城销售合同',
          link: 'scxsht'
        },
        // {
        //   id: '4',
        //   value: '保证借款合同',
        //   link: 'bzjkht'
        // },
        // {
        //   id: '5',
        //   value: '江西银行网络交易资金账户服务三方协议',
        //   link: 'jxyhwljyzjzhfwsfxy'
        // },
        {
          id: '4',
          value: '商品分期服务合同',
          link: 'spfqfwht'
        },
        // {
        //   id: '7',
        //   value: '商品转让协议',
        //   link: 'spwtzrxy'
        // },
        {
          id: '5',
          value: '小微金融水象分期信息咨询及信用管理服务合同',
          link: 'xwjrsxfqxxzxjxyglfwht'
        },
        // {
        //   id: '9',
        //   value: '银行卡变更协议',
        //   link: 'yhkbgxy'
        // },
        {
          id: '6',
          value: '用户授权协议',
          link: 'yhsqxy'
        }],
        checkList: [],
        isCheckAll: false
      }
    },
    created () {
      this.showLoad(false)
      this.checkall()
    },
    watch: {
      checkList: {
        handler (val) {
          if (val.length === this.checkboxList.length) {
            this.isCheckAll = true
          } else {
            this.isCheckAll = false
          }
        }
      }
    },
    methods: {
      checkall () {
        this.isChecked = this.isChecked
        if (this.isCheckAll) {
          this.checkList = []
        } else {
          this.checkList = []
          this.checkboxList.forEach((item) => {
            this.checkList.push(item)
          })
        }
      },
      checked (item) {
        if (this.checkList.indexOf(item) > -1) {
          let index = this.checkList.indexOf(item)
          this.checkList.splice(index, 1)
        } else {
          this.checkList.push(item)
        }
      },
      confirm (e) {
        if (this.isCheckAll) {
          const fromPage = this.$store.state.route.query['fromPage'] || getQueryString('fromPage')
          if (this.$store.state.config.fromChannel == 'sxypApp' && fromPage) {
            app.goIndex()
          } else {
            window.history.go(-1)
          }
        }
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .agreementWrap{
    background: #ffffff;
  }
  .xyList{
    @include px2rem(padding, 0 30 0);
    li{
      border-bottom: 1px solid $borderColor;
      @include px2rem(height, 98);
      @include px2rem(line-height, 98);
      &:last-child{
        border-bottom: none;
      }
    }
    a{
      color: $color333;
      @include font-dpr(24);
    }
  }
  .agree{
      @include px2rem(width,31);
      @include px2rem(height,31);
      -webkit-appearance: none;
      -moz-appearance: none;
      vertical-align: middle;
      // margin-top: -5px;
      background: url("../../assets/icon/icon/money_noselected_icon@3x.png") no-repeat;
      @include px2rem(background-size, 30 30);
      border-radius: 50%;
      @include px2rem(margin-right,20);
      border: none;
    }
    .agree:checked{
      border: none;
      background: url("../../assets/icon/icon/money_selected_icon@3x.png") no-repeat;
     @include px2rem(background-size, 30 30);
    }
</style>
