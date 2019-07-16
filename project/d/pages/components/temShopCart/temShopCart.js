const app = getApp()
Component({
  data: {
    isPass: 1,
  },
  properties: {
    propA: {
      type: Array
    }
  },
  methods: {
    onTap(e) {
      let obj = {
        item: e.currentTarget.dataset.list,
        type: e.currentTarget.dataset.type,
        index: e.currentTarget.dataset.index
      }
      this.triggerEvent('myevent', obj, {
        bubbles: false,
        composed: false
      })
    },
    clearShopCar () {
      let obj = {}
      this.triggerEvent('clear', obj, {
        bubbles: false,
        composed: false
      })
    }
  },
  pageLifetimes: {
  show () {
  }
}
})