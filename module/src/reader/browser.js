module.reader.browser = def(
  [
    module.error.error,
    module.reader.bouncing,
    module.util.path,
    ephox.bolt.loader.transporter.xhr
  ],

  function (error, bouncing, path, xhr) {
    var cache = { };

    var read = function (relativeto, file, done, acc) {
      var accumulated = acc || { sources: [], types: [], configs: [] };
      var base = path.dirname(relativeto);
      var absolute = base + '/' + file;
      var normalizedPath = path.normalize(absolute);

      if (cache[normalizedPath] !== undefined) bouncing.evaluate(absolute, cache[normalizedPath], done, read, accumulated);
      else {
        xhr.request(absolute, function (payload) {
          cache[normalizedPath] = payload;
          bouncing.evaluate(absolute, payload, done, read, accumulated);
        }, error.die);
      }
    };

    return {
      read: read
    };
  }
);
