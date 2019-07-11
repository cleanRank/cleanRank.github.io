// pages/vip/components/contactList/contactList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    friendList: Array,
    type: String,
    showBtn: Boolean,
    productInfo: String,
  },
  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    modalTitle: '发送给',
    cancelBtnTxt:'取消',
    confirmBtnTxt:'发送',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    checkHandle(e){
      let id = e.currentTarget.dataset.info.imUserId
      let checkedArr = []
      this.data.friendList.map(item => {
        if(id == item.imUserId) {
          checkedArr.push(item)
          this.setData({
            checkedArr
          })
          if(checkedArr && checkedArr.length > 0){
            this.setData({
              showModal:true,
            })
          }
        }
      })
    },
    closeModal(){
      this.data.showModal = false
      this.setData({
        showModal:this.data.showModal
      })
    },
    confirmFn(){
      this.triggerEvent('finishEvent',this.data.checkedArr)
    },
    cancelFn(){
      this.triggerEvent('cancelEvent')
    }
  }
})
