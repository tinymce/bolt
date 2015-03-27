compiler.modulator.globalator = def(
  [
  ],

  function () {
    var create = function () {
      var can = function (id) {
        return id.indexOf('global!') === 0;
      };

      var renderNormal = function (id, globalid) {
        return function () {
          return 'ephox.bolt.module.api.define("' + id + '", [], function () { return ' + globalid + '; });';
        };
      };

      var renderConsole = function () {
        return 'ephox.bolt.module.api.define("global!console", [], function () { if (typeof console === "undefined") console = { log: function () {} }; return console; });';
      };

      var get = function (id) {
        var globalid = id.substring('global!'.length);

        var render = globalid === 'console' ? renderConsole : renderNormal(id, globalid);

        var load = function (define) {
          define(id, []);
        };

        return {
          url: globalid,
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
