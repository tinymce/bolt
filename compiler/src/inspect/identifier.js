compiler.inspect.identifier = def(
  [
    compiler.tools.io,
    compiler.tools.error
  ],

  function (io, error) {


    var tlog = function () {
      // console.log.apply(console, [new Date().toLocaleTimeString()].concat(Array.prototype.slice.call(arguments, 0)));
    };

    var indentify = function (file) {
      tlog('compile inspect identifier identify reading ', file);
      var content = io.read(file);
      var ids = [];
      // eval scope
      var define = function (id) {
        ids.push(id);
      };
      try {
        eval(content);
      } catch (e) {
        error.die('Could not evaluate file: ' + file + ', error: ' + e);
      }
      return ids;
    };

    return {
      identify: indentify
    };
  }
);
