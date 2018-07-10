var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    host: '0.0.0.0',
    port: 4000
  });
});

gulp.task('default', ['connect']);
