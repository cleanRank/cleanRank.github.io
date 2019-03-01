let regex = {
  phone: {
    required: '请输入手机号码',
    pattern: /^0?(13|15|18|14|17|16)[0-9]{9}$/,
    msg: "您输入的手机号码格式不正确"
  },
  phoneyzm: {
    required: "请输入短信验证码",
    pattern: /^[0-9]{6}$/,
    msg: '短信验证码错误!'
  },
  name: {
    required: "请输入姓名",
    pattern: /^[\u4E00-\u9FA5·]{2,10}$/,
    msg: "请输入正确的姓名"
  },
  bankPhone: {
    required: '请输入银行预留手机号',
    pattern: /^0?(13|15|18|14|17|16|19)[0-9]{9}$/,
    msg: '请输入正确的预留手机号'
  },
  addDetail: {
    required: '请输入详细地址',
    pattern: /^.{5,100}$/,
    msg: '请输入5-100个字详细地址'
  },
  companyAddr: {
    required: '请输入单位地址',
    pattern: /^.{5,100}$/,
    msg: '请输入5-100个字单位地址'
  },
  eMail: {
    required: '请输入邮箱',
    pattern: /^.{5,60}$/,
    msg: '请输入5-60个字邮箱'
  },
  staffNum: {
    required: '员工编号不能为空',
    pattern: /^[a-zA-Z0-9]{1,10}$/,
    msg: '请输入正确的员工编号'
  },
  company: {
    required: '请输入您的工作单位名称',
    pattern: /^.{5,60}$/,
    msg: '请输入5-60个字单位名称'
  }
}
export default regex
