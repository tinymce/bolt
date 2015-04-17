compiler.modulator.bolt = def(
  [
    compiler.inspect.metalator,
    compiler.tools.io,
    compiler.tools.error
  ],

  // FIX cleanup after compiled/bolt unify
  function (metalator, io, error) {
    var create = function (pather, namespace, path, idTransformer) {

      var can = function (id) {
        return id.indexOf(namespace) === 0;
      };

      var get = function (id) {
        var file = pather(path) + "/" + idTransformer(id) + '.js';
        var content = io.lazyread(file);

        var render = function () {
          return content();
        };

        var loadcompiled = function (define) {
          var ids = metalator.inspect(file);
          ids.forEach(function (id) {
            define(id, []);
          });
        };

        var loadmodule = function (define /* eval scope */) {
          try {
            eval(content());
          } catch (e) {
            error.die('Could not evaluate file: ' + file + ', error: ' + e);
          }
        };

        var load = function (define) {
          var loader = metalator.hasMetadata(file) ? loadcompiled : loadmodule;
          loader(define);
        };

        return {
          url: file,
          serial: false,
          render: render,
          load: load
        };
      };

      return {
        can: can,
        get: get
      };
    };

    return {
      create: create
    };
  }
);
