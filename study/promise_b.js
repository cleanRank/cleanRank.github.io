/* 基于观察者模式支持异步
 *
 *
 */
function Promise(constructor) {
  let _this = this
  _this.status = "pending" // 初始promise状态
  _this.value = undefined // resolve状态的值
  _this.reason = undefined // reject状态的值
  
  _this.onFulfilledArray = []
  _this.onRejectedArray = []

  function resolve(value) {
    if (_this.status === "pending") {
      _this.status = "resolved"
      _this.value = value
      _this.onFulfilledArray.forEach(e => {
        e(value)
      });
    }
  }
  function reject(reason) {
    if (_this.status === "pending") {
      _this.status = "rejected"
      _this.reason = reason
      _this.onRejectedArray.forEach(e => {
        e(value)
      });
    }
  }
  try {
    constructor(resolve, reject)
  } catch(err) {
    throw err
  }
}
Promise.prototype.then = function(onFullFilled, onRejected){
  if (this.status === "pending") {
    this.onFulfilledArray.push(() =>{
      onFullFilled(this.value)
    })
    this.onRejectedArray.push(() => {
      onRejected(this.reason)
    })
  } else if (this.status === "resolved") {
    onFullFilled(this.value)
  } else if (this.status === "rejected") {
    onRejected(this.reason)
  }
}
Promise.prototype.catch = onRejected => {
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
// 输出 执行了 成功了

let k = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("setTimeout")
  }, 1000)
})
k.then(data => {
  console.log(data)
})