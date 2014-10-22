var map = require('map-stream');
var Duo = require('duo');
var duoize = require('duo-gulp');

module.exports = function() {
  var duoPlugins = [].slice.call(arguments);
  return map(function(file, cb) {

    var duo = Duo(file.base).entry(file.path);

    function usePlugin(plugin) {
      duo = duo.use(plugin);
      return duo;
    }

    // use duo plugins first
    duoPlugins.forEach(usePlugin);

    // load gulp plugins
    loadPlugins().forEach(usePlugin);

    return duo.run(function(err, src) {
        if (err) return cb(err, null);
        file.contents = new Buffer(src, 'utf8');
        return cb(null, file);
    });
  });
};

function loadPlugins() {
  // TODO add more plugins, dynamic load
  return [
    {name: 'gulp-coffee', pat: '*.coffee'},
    {name: 'gulp-less', pat: '*.less'},
    {name: 'gulp-sass', pat: '*.scc'}
  ].map(function(it) {
    try {
      var fn = require(it.name);
      return duoize(it.pat, fn)();
    } catch (err) {
      return null;
    }
  }).filter(function(f) {
    return f != null;
  });
}
