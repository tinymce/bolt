kernel.modulator.bolt = def(
  [
    kernel.fp.functions
  ],

  function (fn) {
    var create = function (loader, pather, namespace, path, idTransformer, options) {
      var can = function (id) {
        return id === namespace || id.indexOf(namespace + '.') === 0 || id.indexOf(namespace + '/') === 0;
      };

      var get = function (id) {
        var before = options !== undefined && options.absolute === true ? path : pather(path);
        var after = options !== undefined && options.fresh === true ? '?cachebuster=' + new Date().getTime() : '';
        var url = before + "/" + idTransformer(id) + '.js' + after;
        var load = fn.curry(loader.load, url);

        return {
          url: url,
          load: load,
          serial: false
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