import { get, post, del, postFile, json } from 'lib/httpPlugin'
// const domain = process.env.VUE_APP_BASE_URL
const domain = 'http://106.14.58.213:28205'
const domain1 = 'http://106.14.58.213:28201'
// let baseUrl = (`${domain}/`)
// let api = 'supplier/pubUser/'
export default {
  cityTree (params) { // 获取城市区域信息
    return get(`${domain}/user/region/tree`, params)
  },
  getAccountList (params) { // 获取陪聊帐号列表
    return get(`${domain}/user/account`, params)
  },
  profile (params) { // 获取用户信息
    return get(`${domain}/user/profile`, params)
  },
  subAccountCreate (params) { // 创建陪聊子帐号
    return json(`${domain}/user/subAccount/create`, params)
  },
  subAccountCount (params) { // 获取陪聊子帐号数量
    return get(`${domain}/user/subAccountCount`, params)
  },
  updateUserInfo (params) { // 完善用户资料接口
    return post(`${domain}/user/updateUserInfo`, params)
  },
  deleteAccount (params) { // 删除陪聊子账号
    return del(`${domain}/user/subAccount/delete`, params)
  },
  updateUserInfoBySex (params) { // 更新用户性别接口
    return post(`${domain}/user/updateUserInfoBySex`, params)
  },
  field (params) { // 查询字段属性列表  HEIGHT_TAG：身高 WEIGHT_TAG：体重 INDUSTRY_TAG：职业 ANNUAL_SALARY_TAG: 年收入
    return get(`${domain}/user/dictionary/field`, params)
  },
  count (params) { // 查询用户当前相册与视频个数
    return get(`${domain1}/media/user/count`, params)
  },
  userDelete (params) { // 删除用户相册或视频
    return post(`${domain1}/media/user/delete`, params)
  },
  friend (params) { // 查看交友相册或视频
    return post(`${domain1}/media/user/friend`, params)
  },
  my (params) { // 查看我的相册或视频
    return json(`${domain1}/media/user/my`, params)
  },
  get (params) { // 获取用户未审核相册或视频
    return get(`${domain1}/media/user/unAudit/get`, params)
  },
  updateUserMediaByStatus (params) { // 封禁或解封用户相册或视频
    return get(`${domain1}/media/user/updateUserMediaByStatus`, params)
  },
  upload (params) { // 用户上传相册或视频
    return postFile(`${domain1}/media/user/upload`, params)
  },
  userMediaInfoList (params) { // 根据相册ids查询用户相册
    return get(`${domain1}/media/user/userMediaInfoList`, params)
  },
  update (params) { // 用户动态更新
    return post(`${domain1}/media/moments/update`, params)
  },
  thumbUpList (params) { // 动态点赞用户列表
    return post(`${domain1}/media/moments/thumbUpList`, params)
  },
  thumbUp (params) { // 用户动态点赞
    return post(`${domain1}/media/moments/thumbUp`, params)
  },
  mediaList (params) { // 用户动态列表查询
    return json(`${domain1}/media/moments/list`, params)
  },
  findOne (params) { // 查找一条动态信息
    return post(`${domain1}/media/moments/findOne`, params)
  },
  mediaDelete (params) { // 用户动态信息删除
    return post(`${domain1}/media/moments/delete`, params)
  },
  mediaCreate (params) { // 用户动态信息插入
    return json(`${domain1}/media/moments/create`, params)
  },
  mediaFriend (params) {
    return get(`${domain1}/media/user/talk/friend`, params)
  }
}
