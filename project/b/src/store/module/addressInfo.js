import { UPDATEADDRESSINFO } from 'store/mutation-types'
// 地址信息
const state = {
  consignee: '', // 收货人姓名
  consigneeMobile: '', // 收货人手机号码
  addProvince: '',  // 收货地址-省
  addProvinceCode: '',  // 收货地址-省编码
  addCity: '',  // 收货地址-市
  addCityCode: '',  // 收货地址-市编码
  addCounty: '',  // 收货地址-县
  addCountyCode: '',  // 收货地址-县编码
  addTown: '',  // 收货地址-镇 (可空)
  addTownCode: '',  // 收货地址-镇编码 (可空)
  addDetail: '',  // 收货详细地址
  addDefault: 2,  // 默认收货地址
  addressNo: '',  // 收货地址ID (修改必传,新增为空)
  addresslabel: '' // 收货人关系标签 (可空)
}
const mutations = {
  [UPDATEADDRESSINFO] (state, obj) {
    // state = obj
    Object.assign(state, obj)
    // console.log(state)
  }
}
export default {
  state,
  mutations
}
