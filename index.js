/**
 * Dependencies
 */
var map = require('map-stream');
var Duo = require('duo');

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
  if (args && args.options instanceof Object) {
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
       *
       * See: https://github.com/duojs/duo/blob/master/docs/api.md
       */
      if (options) {
        for (var option in options) {
          if (options.hasOwnProperty(option)) {
            duo = duo[option](options[option]);
          }
        }
      }

      /**
       * Set plugins to use
       *
       * See: https://github.com/duojs/duo/wiki/Third-Party-Libraries
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