<template>
  <!-- 修改密码弹框 -->
  <div class="model-wrapper" v-if="isShow">
    <div class="model">
      <div class="model-header">修改密码</div>
      <div class="form">
        <div class="input-box">
          <span class="title"><span class="star">*</span>原密码:</span>
          <el-input placeholder="请输入原密码" onmousewheel="return false" maxlength=11 v-model="oldpwd" size="mini" required="true" autocomplete="new-password" oninput="if(value.length>20)value=value.slice(0,20)" :show-password="true" >
          </el-input>
        </div>
        <div class="input-box">
          <div class="title"><span class="star">*</span>新密码:</div>
          <el-input placeholder="请输入新密码" onmousewheel="return false" maxlength=11 v-model="newpwd" size="mini" required="true"  autocomplete="new-password" oninput="if(value.length>20)value=value.slice(0,20)" :show-password="true" >
          </el-input>
        </div>
        <div class="input-box">
          <div class="title"><span class="star">*</span>新密码:</div>
          <el-input placeholder="请输入新密码" onmousewheel="return false" maxlength=11 v-model="againNewpwd" size="mini" required="true" autocomplete="new-password" oninput="if(value.length>20)value=value.slice(0,20)" :show-password="true" >
          </el-input>
        </div>
        <div class="input-box btn-wrapper">
          <div class="confirm btn" @click="confirm">确定</div>
          <div class="cancle btn" @click="cancle">取消</div>
        </div>
      </div>
      <div class="cancle-x el-icon-close" @click="cancle"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { isPwd } from 'lib/until'
export default {
  name: "modPwd",
  data () {
    return {
      oldpwd: '',
      newpwd: '',
      againNewpwd: ''
    }
  },
  computed: {
    ...mapState({
      isShow: state => state.globelData.isShow
    })
  },
  methods: {
    checkinput () {
      if (!this.oldpwd) {
        this.$message({ message: '请输入6到20位的旧密码' })
        return false
      } else if (this.oldpwd.trim().length < 6 || !isPwd(this.oldpwd)) {
        this.$message({ message: '旧密码格式不正确' })
        return false
      } else if (!this.newpwd || !this.againNewpwd) {
        this.$message({ message: '请输入6到20位的新密码' })
        return false
      } else if (this.newpwd.trim().length < 6 || !isPwd(this.newpwd) || this.againNewpwd.trim().length < 6 || !isPwd(this.againNewpwd)) {
        this.$message({ message: '新密码格式不正确' })
        return false
      } else if (this.newpwd == this.oldpwd || this.againNewpwd == this.oldpwd) {
        this.$message({ message: '新旧密码不能相同' })
        return false
      } else if (this.newpwd != this.againNewpwd) {
        this.$message({ message: "两次输入新密码不同，请重新输入" })
        return false
      }
      return true
    },
    cancle () {
      // 取消修改密码
      this.$store.commit("ISSHOW", false)
    },
    confirm () {
      // 确认修改密码
      if (!this.checkinput()) return
      let params = {
        pwd: this.oldpwd.trim(),
        newPwd: this.againNewpwd.trim()
      }
      this.$http.updatePwd(params).then(res => {
        this.$store.commit("ISSHOW", false)
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    // 修改密码弹框
    .model-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .7);
      z-index: 666;

      .model {
        position: relative;
        width: 565px;
        height: 380px;
        background-color: #fff;

        .model-header {
          width: 100%;
          height: 45px;
          font-size: 15px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 45px;
          text-align: center;
          background-color: #FEAF27;
        }

        .form {
          .input-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 40px;

            &.btn-wrapper {
              margin-top: 60px;
            }

            .el-input {
              width: 140px;
              margin-left: 30px;
            }

            .title {
              font-size: 12px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: 16px;

              .star {
                color: red;
                padding-right: 5px;
              }
            }

            .btn {
              width: 117px;
              height: 34px;
              line-height: 34px;
              text-align: center;
              font-size: 14px;
              font-family: PingFangSC-Semibold;
              font-weight: 600;
              border-radius: 4px;
            }

            .confirm {
              background-color: #FEAF27;
              color: #fff;
              border: 1px solid rgba(254, 175, 39, 1);
            }

            .cancle {
              margin-left: 28px;
              background-color: #fff;
              color: rgba(102, 102, 102, 1);
              border: 1px solid rgba(229, 229, 229, 1);
            }
          }
        }
      }

      .cancle-x {
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        color: rgba(216, 216, 216, 1);
        padding: 15px;
      }
    }

</style>
