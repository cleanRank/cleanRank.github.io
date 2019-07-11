import {
  get,
  postFile,
  post,
  json
} from 'lib/httpPlugin'
const domain = process.env.VUE_APP_BASE_URL
let baseUrl = (`${domain}`)
export default {
  getSupplierDetail (params) { // 查看供应商
    return get(`${baseUrl}/supplier/b/detail`, params)
  },
  getSupplierDetailIndex (params) { // 首页获取供应商信息
    return get(`${baseUrl}/supplier/b/index`, params)
  },
  uploadImage (params) { // 上传图片
    return postFile(`${baseUrl}/supplier/upload/uploadImage`, params)
  },
  getRegion (params) { // 获取省市区
    return get(`${baseUrl}/supplier/b/region`, params)
  },
  certtype (params) { // 获取证书类型
    return get(`${baseUrl}/supplier/b/certtype`, params)
  },
  getSupplierOrderInfo (params) {
    return post(`${baseUrl}/supplier/purchase/getSupplierOrderInfo`, params)
  },
  updateSupplier (params) { // 修改供应商
    return json(`${baseUrl}/supplier/b/update`, params)
  },
  createSupplier (params) { // 创建供应商
    return json(`${baseUrl}/supplier/b/create`, params)
  },
  uploadExcel (params) { // 上传文件
    return postFile(`${baseUrl}/supplier/upload/uploadExcel`, params)
  }
}
