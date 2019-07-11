<template>
<section v-if="isLoding">
  <ul class="sxt_list_wrap">
    <template v-for="(item, i) in querySxtCardList">
    <li class="sxt_item flex" :key="i">
      <div class="sxt_detail cell_1">
        <div class="balance_box">
          <p class="balance_p">
            <span class="balance_txt font18">余额&nbsp;</span>
            <b class="yj_f">¥</b><b class="balance_num">{{item.leftAmount.toString().split('.')[0]}}</b><b class="balance_xs" v-if="item.leftAmount.toString().split('.')[1]">.{{item.leftAmount.toString().split('.')[1]}}</b>
          </p>
          <p class="effective_time">有效期至 {{item.deadline}}</p>
        </div>
        <p class="faceValue_p c_999 font12">面值¥{{item.totalAmount}}</p>
      </div>
      <div class="cell_0 select_sxt_item" @click="selectSxt(item)">
        <input type="checkbox" name="checkbox" :disabled="item.disabled" :checked="include(item)" :value="item.id">
      </div>
    </li>
    </template>
  </ul>
  <div class="nouse_reb"><button class="btnCom" @click="bindEvent">确定</button></div>
</section>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      querySxtCardList: [],
      isLoding: false,
      checkList: [],
      amountPrice: this.$store.state.route.query.amountPrice || 0 // 实付款金额
    }
  },
  computed: {
    choosePrice () {
        // 水象通选择金额
      let choosePrices = 0
      if (this.checkList.length>0) {
        this.checkList.map((item) => {
          choosePrices = choosePrices + (+item.leftAmount)
        })
      }
      return choosePrices
    }
  },
  created () {
    if (this.$store.state.goodsInfo.checkList) {
      this.checkList = JSON.parse(JSON.stringify(this.$store.state.goodsInfo.checkList))
    }
    this.querySxtCard()
  },
  methods: {
    ...mapActions([
      "updateGoodsInfo"
    ]),
    querySxtCard () {
      // 查询水象通
      const { uid, token } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.querySxtCardList,
        data: {
          uid,
          token,
          usableStatus: 1,
          currentPage: 1
        }
      }).then(data => {
        this.showLoad(false)
        this.isLoding = true
        let res = data.data
        if (res.status == "1") {
          this.$set(this.$data, 'querySxtCardList', res.data)
          this.isDisabled()
        }
      })
    },
    include (item) {
      return this.checkList.some(obj => obj.cardNo === item.cardNo)
    },
    selectSxt (item) {
      if (this.include(item)) {
        let index = this.checkList.indexOf(item)
        this.checkList.splice(index, 1)
      } else {
        this.checkList.push(item)
      }
      // 判断哪些能选择
      this.isDisabled()
    },
    isDisabled () {
      this.querySxtCardList.map((item, i) => {
        if (!this.include(item) && this.choosePrice >= this.amountPrice) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    bindEvent () {
      // 选中卡片
      this.updateGoodsInfo({
        checkList: ''
      })
      if (this.checkList.length>0) {
        let sxtList = {
          checkList: this.checkList
        }
        this.updateGoodsInfo(sxtList)
        window.history.go(-1)
      } else {
        this.showToast({
          msg: '请选择水象通'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nouse_reb{
background: #fff;
position: fixed;
bottom: 0;
padding: 0.32rem 0;
width: 100%; left: 0;
}
.btnCom{
  width: 81.33%;
  background: #fd455f;
  height: 1.04rem;
  line-height: 1.04rem;
}
</style>
