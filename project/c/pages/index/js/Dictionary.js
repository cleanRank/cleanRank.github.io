/*字典 Dictionary类*/
function Dictionary() {
  this.add = add;
  this.datastore = new Array()
  this.find = find;
  this.remove = remove;
  this.showAll = showAll;
  this.count = count;
  this.clear = clear;
}
// 添加
function add(key, value) {
  this.datastore[key] = value
  //console.log.log(this.datastore[key])
}
// 查找
function find(key) {
  for(index in this.datastore){
    if(index == key){
      return true
    }
  }
  return false
  // return this.datastore[key];
}
// 删除
function remove(key) {
  delete this.datastore[key];
}
// 遍历显示
function showAll() {
  var str = "";
  for (var key in this.datastore) {
    str += key + " -> " + this.datastore[key] + ";  "
  }
  //console.log.log(str);
}
// 计算数量
function count() {
  /*var ss = Object.keys(this.datastore).length;
  //console.log.log("ssss   "+ss);
  return Object.keys(this.datastore).length;*/
  /**/
  var n = 0;
  for (var key in Object.keys(this.datastore)) {
    ++n;
  }
  //console.log.log(n);
  return n;
}
// 清空数据
function clear() {
  for (var key in this.datastore) {
    delete this.datastore[key];
  }
}

// module.exports.Dictionary = Dictionary; //这样暴露接口，这里不暴露是不能引用的
// exports.find = find;
// exports.add = add;
// exports.showAll = showAll;
// exports.clear = clear;
module.exports = {
  Dictionary: Dictionary,
  find: find,
  add: add,
  showAll: showAll,
  remove: remove,
  clear: clear,
  count: count,
}



