<template lang="html">
  <div class="add-commodity">
    <ul class="info-list">
      <li class="list-item">
        <span>新增商品名称</span>
        <input type="text" name="" v-model="ajaxObj.name" placeholder="例：娃哈哈">
      </li>
      <li class="list-item">
        <span>建议零售价</span>
        <input type="number" name="" v-model="ajaxObj.retailPrice" placeholder="元">
      </li>
      <li class="list-item">
        <span>协议价格</span>
        <input type="number" name="" v-model="ajaxObj.purchasePrice" placeholder="元">
      </li>
      <li class="list-item clearfix">
        <span class="fl">商品图片</span>
        <ul class="add-img-box fl">
          <li v-if="ajaxObj.imgList.length" v-for="(value, index) in ajaxObj.imgList" :key="index">
            <img class="delImg" :src="imgObj.iconDele" @click="deleteFile(index)" alt="">
            <img class="fileImg" :src="value" alt="">
          </li>
          <li class="add-img" v-if="ajaxObj.imgList.length < 4">
            <img class="addFile_coat" :src="imgObj.iconAdd" alt="">
            <input class="addFile" type="file" captrue="camera" accept="image/*" @change="changeFile($event)">
          </li>
        </ul>
      </li>
    </ul>
    <div class="submit" @click="addCommit">确认保存</div>
  </div>
</template>

<script>
/*
  版本记录： 2018.12.20 - 嵇瑞梁
*/
import { base64ToFile } from 'lib/until'
export default {
  data () {
    return {
      imgObj: {
        img: require('@/assets/icon/icon/logo@2x.png'),
        iconAdd: require("@/assets/icon/icon/icon_add.png"),
        iconDele: require("@/assets/icon/icon/icon_delete.png")
      },
      ajaxObj: {
        name: '', // 商品名称
        retailPrice: '', // 建议零售价
        purchasePrice: '', // 协议价
        imgList: [], // 商品图片列表
        imgPathStr: '',
        applyId: '' // 供应商Id
      },
      imgList: [],
      item: ''
    }
  },
  mounted () {
    this.item = JSON.parse(window.sessionStorage.getItem('commodityItem'))
    if (this.item) {
      this.ajaxObj.name = this.item.itemName
      this.ajaxObj.retailPrice = this.item.retailPrice
      this.ajaxObj.purchasePrice = this.item.purchasePrice
      this.ajaxObj.imgList = this.item.itemPicPaths
      this.ajaxObj.applyId = this.item.applyId
      this.ajaxObj.itemId = this.item.itemId
      this.ajaxObj.applyDtlId = this.item.applyDtlId
    }
  },
  methods: {
    changeFile (e) { // 上传商品图片
      let _this = this
      if (_this.ajaxObj.imgList.length >= 4) {
        return false
      }
      this.showLoad(true)
      try {
        let img = event.target.files
        let type = img[0].type
        if (!img.length) {
          return false
        }
        if (!type.includes('jpg') && !type.includes('jpeg') && !type.includes('png')) {
          this.showToast({msg: '当前只支持.jpg ，.jpeg ，.png 格式的图片！'})
          return false
        }
        _this.compressFile(img[0])
      } catch (e) {
        this.showLoad(false)
      }
    },
    compressFile (file, wantedSize = 150000) {
      const curSize = file.size || file.length * 0.7
      const quality = Math.max(wantedSize / curSize, 0.65)
      window.lrz(file, {
        width: 880,
        quality
      }).then((src) => {
        this.commitUploadImage(base64ToFile(src.base64, src.origin.name))
      })
    },
    deleteFile (index) { // 图片上传取消图片0
      this.ajaxObj.imgList.splice(index, 1)
    },
    addCommit () { // 上传商品
      if (this.ajaxObj.name.trim() === '') {
        this.showToast({msg: '请输入商品名称！'})
        return false
      } else if (typeof this.ajaxObj.retailPrice !== 'number' && this.ajaxObj.retailPrice.trim() === '') {
        this.showToast({msg: '请输入建议零售价！'})
        return false
      } else if (typeof this.ajaxObj.purchasePrice !== 'number' && this.ajaxObj.purchasePrice.trim() === '') {
        this.showToast({msg: '请输入协议价格！'})
        return false
      } else if (this.ajaxObj.imgList.length === 0) {
        this.showToast({msg: '请上传商品图片！'})
        return false
      }
      this.ajaxObj.imgList.forEach((v, index) => {
        if (index === 0) {
          this.imgPathStr = v
        } else {
          this.imgPathStr += ',' + v
        }
      })
      this.$http.applySave({
        applyId: this.ajaxObj.applyId,
        itemType: 2,
        items: [
          {
            applyDtlId: this.ajaxObj.applyDtlId,
            applyId: this.ajaxObj.applyId,
            itemId: this.ajaxObj.itemId,
            itemName: this.ajaxObj.name,
            itemPicPath: this.imgPathStr,
            purchasePrice: this.ajaxObj.purchasePrice,
            retailPrice: this.ajaxObj.retailPrice
          }
        ]
      }).then(res => {
        this.ajaxObj.name = ''
        this.ajaxObj.retailPrice = ''
        this.ajaxObj.purchasePrice = ''
        this.ajaxObj.imgList = ''
        this.imgPathStr = ''
        this.applyId = ''
        window.history.back(1)
      }).catch(e => {})
    },
    commitUploadImage (file) {
      this.showLoad(true)
      let formData = new FormData()
      formData.append('file', file)
      this.$http.uploadImage(formData).then(res => {
        this.showLoad(false)
        this.ajaxObj.imgList.push(res.result.path)
        if (this.item) {
          window.sessionStorage.setItem('commodityItem', JSON.stringify(this.item))
        }
      }).catch(e => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/addCommodity.scss';
</style>
