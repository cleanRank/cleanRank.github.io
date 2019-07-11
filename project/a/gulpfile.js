var gulp = require('gulp')
var sftp = require('gulp-sftp')
gulp.task('default', function () {
  return gulp.src('web/**/*')
    .pipe(sftp({
      host: '47.101.198.211',
      user: 'root',
      pass: 'Choulun@354266',
      remotePath: '/opt/webapp/pages/web/'
    }))
})
