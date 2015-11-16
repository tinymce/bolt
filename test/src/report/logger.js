test.report.logger = def(
  [
    test.report.errors,
    test.report.timer,
    test.report.namer
  ],

  function (errors, timer, namer) {
    var create = function (verbose, callback) {
      var initial = new Date();
      var times = {};
      var passed = 0;
      var failed = 0;
      var starttime = 0;

      var log = console.log;

      var errorLog = console.error;

      var vlog = function () {
        if (verbose)
          log.apply(null, arguments);
      };

      var test = function (testcase, name) {
        var starttime = new Date();
        vlog('[' + name + ']');

        var pass = function () {
          ++passed;
          vlog('+ [passed] in ' + timer.elapsed(starttime));
        };

        var fail = function (error) {
          ++failed;
          errorLog('- [failed] : ' + namer.format(testcase, name) + '');
          errorLog('    ' + errors.clean(error).replace(/\n/g, '\n    '));
          errorLog();
        };

        var htmlcompare = function() {
          fail("HTML comparison only supported in Tunic");
        };

        return {
          pass: pass,
          htmlcompare: htmlcompare,
          fail: fail
        };
      };

      var done = function () {
        var success = failed === 0;

        var logType = success ? log : errorLog;
        logType('Ran ' + (passed + failed) + ' tests in ' + timer.elapsed(initial) + ', ' + passed + ' passed, ' + failed + ' failed.');
        callback(success);
      };

      return {
        test: test,
        done: done
      };
    };

    return {
      create: create
    };
  }
);
