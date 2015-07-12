var coffeeScript = require('duo-coffee-script');
var duo = require('gulp-duo');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');

function out() {
  return gulp.dest('./build/');
}

gulp.task('default', ['styles', 'scripts']);

gulp.task('styles', function() {
  return gulp.src('less/app.less')
    .pipe(less())
    .pipe(out());
});

gulp.task('scripts', function() {
  return gulp.src('src/app.coffee')
    .pipe(duo({
      plugins: [
        coffeeScript({})
      ],
      options: {
        development: true
      }
    }))
    .pipe(rename('app.js'))
    .pipe(out());
});
