// 爆品图片
import Mock from 'mockjs'
// import "./myCollection"
// import "./indexHome"
// import "./shopCart"
// import "./confirmOrder"
Mock.mock("//47.100.14.188:8086/sxyp/getInstalmentDetail",{
  "status": "25",
  "statusDetail": "接口请求未返回数据",
  "channel": "1",
  "function": "getinstalmentdetail",
  "url": "baidu"
})
