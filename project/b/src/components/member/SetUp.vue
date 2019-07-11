<template>
  <section class="set-up">
    <div class="setLine"></div>
    <div class="personalInfo set-list">
      <div class="setInfo setHead set-item">
        <label class="setInfoLabel">头像</label>
        <div class="setHeadFileWrap">
          <img class="setHeadImg" :src="userInfo.img" alt="">
          <input class="setHeadFile" type="file" @change="fileChange($event)"
                   accept="image/*">
        </div>
      </div>
      <div class="setInfo setNickname set-item">
        <label class="setInfoLabel">昵称</label>
        <div class="setInfoName"
          :class="{'c_999':!userInfo.nickName}"
          @click="editUserName"
        >{{userInfo.nickName?userInfo.nickName:'请输入昵称'}}</div>
      </div>
      <router-link to="myaddress" class="set-item" tag="div">收货地址</router-link>
      <div class="setLine"></div>
      <router-link to="about" class="set-item" tag="div">关于我们</router-link>
    </div>
    <!-- 输入昵称弹窗 s -->
    <div class="editNameMask flex" v-if="maskFlag">
      <div class="editNameContent">
        <p class="editTitle">请输入新的昵称</p>
        <p>
          <input class="userName" type="text" maxlength="10" v-model.trim="nickName"  ref="ipt" @keyup="changeIpt">
        </p>
        <p class="editControl flex">
          <span class="editBtn cancel" @click="closeMask">取消</span>
          <span class="editBtn confirm" @click="confirmUserName">确定</span>
        </p>
      </div>
    </div>
    <!-- 输入昵称弹窗 e -->

    <div></div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {}, // 用户信息
      nickName: '请输入昵称',
      maskFlag: false,
      photos: '', // 存放压缩后的base64编码
      img: '' // 存放图片发送到服务器
    }
  },
  created () {
    this.getUserInfo()
  },
  computed: {
    nickNameTrim () {
      var result = this.nickName.replace(/(^\s+)|(\s+$)/g, "")
      result = result.replace(/\s/g, "")
      return result
    }
  },
  methods: {
    changeIpt (e) {
      var result = this.nickName.replace(/(^\s+)|(\s+$)/g, "")
      this.nickName = result.replace(/\s/g, "")
      if (e.keyCode == 13) {
        console.log('keyCode'+ e.keyCode)
        this.confirmUserName()
      }
    },
    getUserInfo (type = 0, nickName, img) {
      this.showLoad(true)
      /*
        type
          0-回显
          1-修改
      */
      let { uid, token } = this.$store.state.userInfo
      let data = {
        uid,
        token,
        userInfoFlag: type
      }
      if (nickName) {
        data.nickName = nickName
      } else if (img) {
        data.img = img
      }
      this.$post({
        url: this.$store.state.api.userInfo,
        data
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          this.userInfo = res
          this.nickName = this.userInfo.nickName
          if (type == '1' && nickName) {
            this.showToast({msg: '昵称修改成功'})
          } else if (type == '1' && img) {
            this.showToast({msg: '头像更换成功'})
          }
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    // 上传头像
    fileChange (e) {
      let img = event.target.files
      this.compressFile(img[0])
    },
    compressFile (file, wantedSize = 150000) {
      // 图片大小约是base64的70%
      const curSize = file.size || file.length * 0.7
      const quality = Math.max(wantedSize / curSize, 0.65)
      window.lrz(file, {
        // 压缩照片
        width: 880,
        quality
      }).then((src) => {
        this.img = src.base64.replace(/^data:image\/\w+;base64,/, "")
        this.getUserInfo(1, '', this.img)
      })
    },
    // 修改昵称
    editUserName () {
      this.maskFlag = true
      this.nickName = this.userInfo.nickName
      this.$nextTick(() => {
        this.$refs.ipt.focus()
      })
    },
    // 保存修改用户名
    confirmUserName () {
      if (this.nickName=='') {
        this.showToast({msg: '请输入新的昵称'})
      } else if ((/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(this.nickName))) {
        this.showToast({msg: '昵称不能包含表情哦~'})
      } else if (this.nickName.length < 2) {
        this.showToast({msg: '昵称最少两个字符'})
      } else {
        if (this.nickName != this.userInfo.nickName) {
          this.getUserInfo(1, this.nickName)
        }
        this.closeMask()
      }
    },
    closeMask () {
      this.maskFlag = false
      this.nickName = ''
    }
  }
}
</script>

<style scoped>

</style>
