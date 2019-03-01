/* 普通模式
*
*
*/
function Promise(constructor) {
  this.status = "pending" // 当前状态
  this.value = undefined // resolove状态的返回值
  this.reason = undefined // reject状态返回值
  let _this = this
  function resolve (value) {
    if (_this.status === 'pending') {
      console.log(value)
      _this.value = value
      _this.status = 'resolved'
    }
  }
  function reject (reason) {
    if (_this.status === 'pending') {
      _this.reason = reason
      _this.status = "rejected"
    }
  }
  try {
    constructor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
Promise.prototype.then = function(onFulfilled, onRejected) {
  let _this = this
  if (_this.status === "resolved") {
    onFulfilled(_this.value)
  } else if (_this.status === "rejected") {
    onRejected(_this.reason)
  }
}
Promise.prototype.catch = function(onRejected) {
  if (this.status === "rejected") {
    onRejected(this.reason)
  }
}
let p = new Promise((resolve, reject) => {
  resolve("成功了")
  console.log('执行了');
});
p.then(data => {
  console.log(data)
})
// 输出 成功了 执行了 成功了
let k = new Promise((resolve, reject) => {
  setTimeout(()=> {
    resolve("setTimeout")
  },1000)
})
k.then(data => {
  console.log(data)
})
// 输出setTimeout
// 不支持异步，因为先执行then方法，在执行setTimeout
