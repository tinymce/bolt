test.run.wrapper = def(
  [
    Function('return this;')(),
    test.assert.assert
  ],

  function (global, assert) {
    global.assert = assert;

    var resulter = function (testcase, type) {
      return function (returned) {
        if (returned === undefined)
          testcase.pass();
        else if (typeof returned === 'object' && Array.prototype.isPrototypeOf(returned))
          testcase.htmlcompare(returned);
        else
          testcase.fail('Success argument (or sync test return) must be either undefined or an array of HTML comparison objects');
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

        var oncomplete = function (result) {
          return function () {
            result.apply(null, arguments);
            global.define = undefined;
            global.require = undefined;
            global.demand = undefined;
            next();
          };
        };

        var onsuccess = oncomplete(resulter(testcase));
        var onfailure = oncomplete(testcase.fail);

        var args = Array.prototype.slice.call(arguments, 0);

        var promise;
        try {
          promise = f.apply(null, args.concat([ onsuccess, onfailure ]));
        } catch (e) {
          onfailure(e);
        }

        /*
         * Ideally this would require tests to return a promise (as dom tests do) rather than
         * passing success and failure to the test function but we have a huge number of
         * existing tests that need to be converted first
         */
        // IE doesn't support promises, this will at least not fail if a promise isn't returned. Proper fix TBD.
        if (promise !== undefined && promise instanceof Promise) {
          promise.then(onsuccess, onfailure);
        }
      };
    };

    var dom = function (reporter, testfile, name, f, next) {
      var window;
      // we don't want to make jsdom a dependency of bolt, so fail at runtime if it isn't installed
      try {
        var jsdom = require("jsdom");
        var JSDOM = jsdom.JSDOM;
      if (JSDOM === undefined) console.error('Bolt now requires jdom v10 or higher');
        window = new JSDOM().window;
      } catch (e) {
        console.error(e);
        throw new Error('jsdom must be installed to run dom tests');
      }

      // Transferring all properties from window to global seems like a bad idea.
      // This is a list of commonly used variables in DOM tests that are transferred. It is expected to expand over time.
      var variables = [
        "document",
        "window",
        "Node",
        "Image",
        "navigator",
        "alert",
        "NodeFilter",
        "XMLHttpRequest"
      ];

      variables.map(function (name) {
        global[name] = window[name];
      });

      var oncomplete = function () {
        variables.map(function (name) {
          global[name] = undefined;
        });
        next();
      };

      var wrappedF = function () {
        var promise = f.apply(null, arguments);
        if (!(promise instanceof Promise)) {
          throw 'dom tests must return a promise';
        }
        return promise;
      };

      return async(reporter, testfile, name, wrappedF, oncomplete);
    };

    return {
      sync: sync,
      async: async,
      dom: dom
    };
  }
);
