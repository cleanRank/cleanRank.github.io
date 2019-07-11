// loading
const loading  = {};
import store from 'store/index'
loading.install = function(Vue) {
    Object.defineProperties(Vue.prototype, {
      // 显示/隐藏遮罩
      showLoad: {
         get (){
            return (flag)=>{
              store.commit('UPDATEISLOADING', flag)
            }
         }
      }
    })
}
export default loading
