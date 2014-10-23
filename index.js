var map = require('map-stream');
var Duo = require('duo');

module.exports = function() {
  var plugins = [].slice.call(arguments);
  var opts = {};

  if (plugins.length > 0 && typeof plugins[0] == "object") {
    opts = plugins[0];
    plugins = plugins.slice(1);
  }

  // TODO load opts.plugins
  // if (typeof opts.plugins == "object") {
  //   var plugs = Object.keys(opts.plugins).map(function(name){
  //     var po = opts.plugins[name];
  //     return require(name)(po);
  //   });
  //   plugins = plugs.concat(plugins);
  // }

  return function() {
    return map(function(file, cb) {
      var duo = Duo(file.base).entry(file.path);

      setOptions(duo, opts);

      plugins.forEach(function(plugin) {
        duo = duo.use(plugin);
      });

      return duo.run(function(err, src) {
          if (err) return cb(err, null);
          file.contents = new Buffer(src, 'utf8');
          return cb(null, file);
      });
    });
  };
};

// https://github.com/duojs/duo/blob/master/docs/api.md
function setOptions(duo, opts) {
  if (!!opts.dev || !!opts.development) {
    duo = duo.development(true);
  }

  if (!!opts.copy) {
    duo = duo.copy(true);
  }

  // TODO support CSV string value
  (opts.globals || []).forEach(function(name){
    duo = duo.global(name);
  });

  if (typeof opts.concurrency !== "undefined") {
    duo = duo.concurrency(opts.concurrency);
  }

  // github token
  if (typeof opts.token !== "undefined") {
    duo = duo.token(opts.token);
  }

  // TODO buildTo, includes, path, installPath, buildPath

  return duo;
}
