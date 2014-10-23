# gulp-duo

[Gulp](https://github.com/gulpjs/gulp) plugin to easily run [duo](https://github.com/duojs/duo)

## Install

```
npm install gulp-duo
```

## Usage

```coffeescript
gulp = require 'gulp'

# gulp plugins
rename = require 'gulp-rename'
less = require 'gulp-less'
duo = require('gulp-duo')({
  plugins:
    'duo-coffee-script': {} # set gulp-coffe options
})

# flush result to build dir
out = () -> gulp.dest('./build/')

# gulp tasks
gulp.task 'default', ['styles', 'scripts']

# compile styles
gulp.task 'styles', () ->
  gulp.src('less/app.less')
    .pipe less()
    .pipe out()

# compile scripts
gulp.task 'scripts', () ->
  gulp.src('src/app.coffee')
    .pipe duo()
    .pipe rename 'app.js'
    .pipe out()
```
