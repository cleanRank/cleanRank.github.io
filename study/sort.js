var a = [2,4,3,6,5,1];
function sort(v, by) {
  let p = [];let index = 0;
  for (var i = 0; i < a.length; i ++) {
    for (var j = 0; j < p.length; j++) {
      if (by > 0 ? a[i] > p[j] : a[i] < p[j] ) {
        index = j+1;
      }
    }
    p.splice(index, 0, a[i])
    index = 0
  }
  return p;
}
sort(a, 1)