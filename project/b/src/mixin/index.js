// 修改背景颜色
export default {
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').style.background = '#fff'
    document.querySelector('html').style.background = '#fff'
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('body').style.background = '#F4F4F4'
    document.querySelector('html').style.background = '#F4F4F4'
    next()
  }
}
