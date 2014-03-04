test.run.wrapper = def(
  [
    Function('return this;')(),
    test.assert.assert
  ],

  function (global, assert) {
    global.assert = assert;

    var resulter = function (testcase) {
      return function (returned) {
        if (returned === undefined)
          testcase.pass();
        else if (typeof returned === 'object' && Array.prototype.isPrototypeOf(returned))
          testcase.htmlcompare(returned);
        else
          throw 'Tests must either return undefined or an array of HTML comparison objects';
      };
    };

    var sync = function (reporter, testfile, name, f, next) {
      global.define = ephox.bolt.module.api.define;
      global.require = ephox.bolt.module.api.require;
      global.demand = ephox.bolt.module.api.demand;

      return function (/* arguments */) {
        var testcase = reporter.test(testfile, name);
        try {
          resulter(testcase)(f.apply(null, arguments));
        } catch (e) {
          testcase.fail(e);
        } finally {
          global.define = undefined;
          global.require = undefined;
          global.demand = undefined;
          next();
        }
      };
    };

    var async = function (reporter, testfile, name, f, next) {
      global.define = ephox.bolt.module.api.define;
      global.require = ephox.bolt.module.api.require;
      global.demand = ephox.bolt.module.api.demand;

      return function (/* arguments */) {
        var testcase = reporter.test(testfile, name);

        var oncomplete = function (f) {
          return function () {
            f.apply(null, arguments);
            global.define = undefined;
            global.require = undefined;
            global.demand = undefined;
            next();
          };
        };

        var onsuccess = oncomplete(resulter(testcase));
        var onfailure = oncomplete(testcase.fail);

        var args = Array.prototype.slice.call(arguments, 0);

        try {
          f.apply(null, args.concat([ onsuccess, onfailure ]));
        } catch (e) {
          onfailure(e);
        }
      };
    };

    return {
      sync: sync,
      async: async
    };
  }
);
