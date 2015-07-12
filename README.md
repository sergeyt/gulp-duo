# gulp-duo

[Gulp](https://github.com/gulpjs/gulp) plugin to easily run [duo](https://github.com/duojs/duo)

## Install

```
npm install gulp-duo
```

## Options

* `options` (object): options for duo can be passed under the `"options"` key. See the [duo api](https://github.com/duojs/duo/blob/master/docs/api.md) for all available options.
* `plugins` (array): plugins for duo to use can be passed under the `"plugins"` key. This should always be an array of [duojs plugin](https://github.com/duojs/duo/wiki/Third-Party-Libraries) functions. Pass options to the plugins like you normally would.

## Example

```javascript
var duo = require('gulp-duo');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
// Require a duo plugin
var coffeeScript = require('duo-coffee-script');

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
    // Pipe to duo
    .pipe(duo({
      plugins: [
        // Pass the duo plugin here
        coffeeScript({
          // Any options for the plugin go here
          })
      ],
      options: {
        // Any options for duo go here, for example:
        development: true
      }
    }))
    .pipe(rename('app.js'))
    .pipe(out());
});
```
