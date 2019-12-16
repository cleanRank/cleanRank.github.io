var gulp = require('gulp')
var sftp = require('gulp-sftp')
gulp.task('default', function () {
  return gulp.src('web/**/*')
    .pipe(sftp({
      host: '', // 服务器IP例如 47.245.18.226
      user: 'root', // 服务器用户名
      pass: '', // 密码
      remotePath: '/opt/webapp/pages/web/' // 打包服务器路径
    }))
})
