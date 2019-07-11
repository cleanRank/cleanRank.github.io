export default {
  methods: {
    addOverFlow () {
      document.getElementsByTagName('body')[0].className = 'oh'
      document.getElementsByTagName('html')[0].className = 'oh'
    },
    clearOverFlow () {
      document.getElementsByTagName('body')[0].className = ''
      document.getElementsByTagName('html')[0].className = ''
    }
  }
}
