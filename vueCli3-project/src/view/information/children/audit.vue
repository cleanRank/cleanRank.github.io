<template lang="html">
  <div class="commodity-submit-audit">
    <div class="submit-audit" @click="dialog()">
      提交审核
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    itemType: Number,
    filePath: String
  },
  methods: {
    dialog () {
      let _this = this
      if (_this.list.length === 0 || !_this.list) {
        this.showToast({msg: '请先添加商品或图表'})
        return false
      }
      this.showDialog({
        title: '提示',
        msg: '是否提交审核？',
        lBtnText: '取消',
        rBtnText: '确定',
        confCallBack () {
          if (_this.list.length === 0) {
            return
          }
          let applyId = _this.list[0].applyId
          let paramsItemList = []
          _this.list.forEach(value => {
            value.itemPicPaths.forEach((item, index) => {
              if (index === 0) {
                value.itemPicPath = item
              } else {
                value.itemPicPath += ',' + item
              }
            })
            let obj = {
              applyDtlId: value.applyDtlId,
              applyId: value.applyId,
              itemId: value.itemId,
              itemName: value.itemName,
              itemPicPath: value.itemPicPath,
              purchasePrice: value.purchasePrice,
              retailPrice: value.retailPrice
            }
            paramsItemList.push(obj)
          })
          _this.$http.applyCommit({
            applyId: applyId,
            itemType: _this.itemType,
            items: paramsItemList
          }).then(res => {
            _this.$router.push({
              path: '/applydetail'
            })
          }).catch(e => {})
        }
      })
      this.$emit('child-list', 'audit')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/informationIndex.scss";
</style>
