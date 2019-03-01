/* 基于观察者模式支持异步
 * 实现链式调用
 * then方法返回promise
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
  } catch (err) {
    throw err
  }
}
Promise.prototype.then = function (onFullFilled, onRejected) {
  let _this = this
  let promise2
  promise2 = new Promise(function(resolve, reject){
    if (_this.status === "pending") {
      _this.onFulfilledArray.push(() => {
        try {
          let result = onFullFilled(_this.value)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
      _this.onRejectedArray.push(() => {
        try {
          let result = onRejected(_this.reason)
          reject(result)
        } catch (e) {
          reject(e)
        }
      })
    } else if (_this.status === "resolved") {
      try {
        let result = onFullFilled(_this.value)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    } else if (_this.status === "rejected") {
      try {
        let result = onRejected(_this.reason)
        reject(result)
      } catch (e) {
        reject(e)
      }
    }
  })
  return promise2
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
}).then(d => {
  console.log("链式调用2")
}).then(d => {
  console.log("链式调用3")
})
// 执行了 成功了 链式调用2 链式调用3

// let k = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("setTimeout")
//   }, 1000)
// })
// k.then(data => {
//   console.log(data)
// })