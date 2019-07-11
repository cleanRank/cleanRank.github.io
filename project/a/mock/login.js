import Mock from 'mockjs'
const domain = process.env.APIPORT
let baseUrl = (`${domain}/`)

Mock.mock(`${baseUrl}`, 'get', {
  appCode: '00000',
  result: [{
  }]
})