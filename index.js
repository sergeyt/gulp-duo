/**
 * Dependencies
 */
var map = require('map-stream');
var Duo = require('duo');

/**
 * Options
 *
 * see: https://github.com/duojs/duo/blob/master/docs/api.md
 */
function setOptions(duo, options) {
  if (!!options.dev || !!options.development) {
    duo = duo.development(true);
  }

  if (!!options.sourcemap) {
    duo = duo.sourcemap(options.sourcemap);
  }

  if (!!options.cache) {
    duo = duo.cache(true);
  }

  if (!!options.copy) {
    duo = duo.copy(true);
  }

  if (!!options.standalone) {
    duo = duo.standalone(options.standalone);
  }

  if (typeof options.concurrency !== 'undefined') {
    duo = duo.concurrency(options.concurrency);
  }

  if (!!options.installTo) {
    duo = duo.installTo(options.installTo);
  }

  if (!!options.buildTo) {
    duo = duo.buildTo(options.buildTo);
  }

  if (typeof options.token !== 'undefined') {
    duo = duo.token(options.token);
  }

  return duo;
}

/**
 * Export
 */
module.exports = function() {
  /**
   * Get and assign any arguments
   */
  var args = arguments[0];
  var options = false;
  var plugins = false;

  if (args && args.plugins instanceof Array) {
    plugins = args.plugins;
  }
  if (args && args.options) {
    options = args.options;
  }

  return function() {
    return map(function(file, cb) {

      /**
       * Start Duo from process folder and not from where the file's located
       */
      var duo = Duo(process.cwd()).entry(file.path);

      /**
       * Set options to use
       */
      if (options) {
        setOptions(duo, options);
      }

      /**
       * Set plugins to use
       */
      if (plugins) {
        for (var i = 0; i < plugins.length; i++) {
          duo = duo.use(plugins[i]);
        }
      }

      /**
       * Run Duo
       */
      return duo.run(function(err, src) {
        if (err) {
          return cb(err, null);
        }
        file.contents = new Buffer(src, 'utf8');
        return cb(null, file);
      });
    });
  };
};
