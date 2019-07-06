// function createCurry(func, arrArgs) {
//   var args=arguments;
//   var funcLength = func.length;
//   var arrArgs = arrArgs || [];

//   return function(param) {
//       var allArrArgs=arrArgs.concat([param])

//       // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
//       if (allArrArgs.length < funcLength) {
//           return args.callee.call(this, func, allArrArgs);
//       }

//       // 参数收集完毕，则执行func
//       return func.apply(this, allArrArgs);
//   }
// }
// 参数只能从左到右传递
function createCurry(func, arrArgs) {
  var args=arguments;
  var funcLength = func.length;
  var arrArgs = arrArgs || [];

  return function() {
      var _arrArgs = Array.prototype.slice.call(arguments);
      var allArrArgs=arrArgs.concat(_arrArgs)

      // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
      if (allArrArgs.length < funcLength) {
          return args.callee.call(this, func, allArrArgs);
      }

      // 参数收集完毕，则执行func
      return func.apply(this, allArrArgs);
  }
}

// createCurry 返回一个柯里化函数
var addCurry=createCurry(function(a, b, c) {
  return a + b + c;
});
console.log(addCurry(1, 2, 3));
console.log(addCurry(1)(2)(3));  // 6
