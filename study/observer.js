var _data_observer_instance = null;
var DataObserve = function () {
  this.observe_data_fun = []
}

DataObserve.instance = function () {
  if (!_data_observer_instance) {
    return false
  }
  _data_observer_instance = new DataObserve()
}
// 订阅
DataObserve.prototype.register = function (observe_fun) {
  if (Object.prototype.toString.call(observe_fun) !== '[object Function]') {
    throw new Error('params is not a function');
    return false
  }
  for (var i in this.observe_data_fun) {
    if (observe_fun == this.observe_data_fun[i]) {
      return false
    }
  }
  this.observe_data_fun.push(observe_fun)
}
// 取消订阅
DataObserve.prototype.cancel = function (observe_fun) {
  if (Object.prototype.toString.call(observe_fun) !== '[object Function]') {
    throw new Error('params is not a function');
    return false
  }
  for (var i in this.observe_data_fun) {
    if (observe_fun == this.observe_data_fun[i]) {
      this.observe_data_fun.splice(i, 1);
      return false
    }
  }
}
// 
DataObserve.prototype.emit = function(params) {
  this.observe_data_fun.forEach((e, i) => {
    var dataObserve = e;
    dataObserve.call(null, params);
  })
}