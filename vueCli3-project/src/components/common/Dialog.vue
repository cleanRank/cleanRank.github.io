<template>
  <div class="attent-dialog">
    <div class="dialog-frame">
      <div class="frame-main">
        <p>是否取消关注</p>
        <div class="frame-btn">
          <span @click="concel" class="btn btn-defalut-2">取消</span>
          <span @click="confirm" class="btn btn-confirm-2">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
    }
  },
  props: ["attion"],
  methods: {
    ...mapActions([
      "updateDialogFlag"
    ]),
    init () {
    },
    concel () {
      this.updateDialogFlag(false)
    },
    confirm () {
      this.$http.setAttention(this.attion.id, {type: this.attion.type}).then(data => {
        if (data.result) {
          this.$emit('setAttention', data.result)
          this.updateDialogFlag(false)
        }
      }).catch(data => {})
    }
  },
  mounted () {
  }
}
</script>
