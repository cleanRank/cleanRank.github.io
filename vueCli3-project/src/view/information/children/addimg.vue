<template lang="html">
  <div class="commodity-add-img clearfix">
    <div class="commodity-add-left">
      图表图片
    </div>
    <div class="commodity-add-right">
      <ul class="clearfix">
        <li v-if="ajaxObj.addFileList.length" v-for="(value, index) in ajaxObj.addFileList" :key="index">
          <img class="closeImg" :src="imgObj.iconDele" @click="deleteFile(index)" alt="">
          <img class="fileImg" :src="value" alt="">
        </li>
        <li class="addChange" v-if="ajaxObj.addFileList.length < 4">
          <img class="addFile_coat" :src="imgObj.iconAdd" alt="">
          <input class="addFile" type="file" captrue="camera" accept="image/*" @change="changeFile($event)">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { base64ToFile } from 'lib/until'
export default {
  data () {
    return {
      imgObj: {
        img: require('@/assets/icon/icon/logo@2x.png'),
        iconDele: require("@/assets/icon/icon/icon_delete.png"),
        iconAdd: require("@/assets/icon/icon/icon_add.png")
      },
      ajaxObj: {
        addFileList: [] // 商品图表图片列表
      },
      imgPathStr: '', // 图片地址拼接串
      fileList: [] // 上传文件列表
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    changeFile (e) {
      let _this = this
      if (_this.ajaxObj.addFileList.length >= 4) {
        return false
      }
      this.showLoad(true)
      let img = event.target.files
      try {
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
        this.addFile(base64ToFile(src.base64, src.origin.name))
      })
    },
    deleteFile (index) { // 图表上传取消图片
      if (this.fileList[index].itemPicPaths[0] === this.ajaxObj.addFileList[index]) {
        this.$http.applyRemove({
          applyDtlId: this.fileList[index].applyDtlId
        }).then(res => {
          this.getList()
        }).catch(e => {})
      }
    },
    addCommit () { // 上传商品
      this.$http.applySave({
        applyId: '',
        itemType: 3,
        items: [
          {
            applyDtlId: 0,
            applyId: '',
            itemId: '',
            itemName: '',
            itemPicPath: this.imgPathStr,
            purchasePrice: '',
            retailPrice: ''
          }
        ]
      }).then(res => {
      }).catch(e => {})
    },
    addFile (file) { // 上传图表文件
      // 图片上传http
      this.showLoad(true)
      let formData = new FormData()
      formData.append('file', file)
      this.$http.uploadImage(formData).then(res => {
        this.showLoad(false)
        this.imgPathStr = res.result.path
        this.addCommit()
        let _this = this
        setTimeout(function () {
          _this.getList()
        }, 500)
      }).catch(e => {})
    },
    getList () {
      this.$http.applySelect({
        page: 1,
        param: {
          itemType: 3
        },
        size: 100
      }).then(res => {
        this.ajaxObj.addFileList = []
        this.fileList = res.result.datas
        res.result.datas.forEach((value, index) => {
          this.ajaxObj.addFileList.push(value.itemPicPaths[0])
        })
        this.$emit('change-file', res.result.datas)
      }).catch(e => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/informationIndex.scss";
</style>
