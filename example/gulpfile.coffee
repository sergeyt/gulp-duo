gulp = require 'gulp'

# gulp plugins
rename = require 'gulp-rename'
less = require 'gulp-less'

# duo with plugins
# duo = require('../index.js')({
#   plugins:
#     'duo-coffee-script': {}
# })
duo = require('../index.js')(
  require('duo-coffee-script')({})
)

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
