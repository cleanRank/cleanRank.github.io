class TimeStamp {
  constructor (x = 0, y) {
    this.layTime = x
    this.value = y
  }
  getLayTime () {
    let t = (new Date()).getTime()
    if ((t - this.layTime) < this.value) {
      return false
    } else {
      this.layTime = t
      return true
    }
  }
}
let timeStamp = new TimeStamp(0, 1500)
export { timeStamp }
