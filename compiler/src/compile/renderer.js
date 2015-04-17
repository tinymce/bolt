compiler.compile.renderer = def(
  [
    ephox.bolt.kernel.fp.array
  ],

  function (ar) {
    var stripempty = function (ss) {
      return ar.filter(ss, function (s) {
         return s !== '';
      });
    };

    var join = function (ss) {
      // joinCount++;
      return stripempty(ss).join('\n');
    };

    // var tlog = function () {
    //   console.log.apply(console, [new Date().toLocaleTimeString()].concat(Array.prototype.slice.call(arguments, 0)));
    // };

    // var joinCount = 0;
    // var rendererCount = 0;

    var render = function (ids, modules, renders) {
      // tlog('entering render');
      var printed = {};  // url ->  boolean
      var order = [];

      var renderer = function (id) {
        // rendererCount++;
        if (renders[id] === undefined) throw 'undefined render for ' + id + ', deps ' + modules[id];

        var spec = renders[id];

        if (printed[spec.url])
          return;

        var dependencies = modules[id];
        ar.each(dependencies, renderer);

        printed[spec.url] = true;
        // tlog('adding', id);
        order.push(id);
      };

      ar.each(ids, renderer);

      // tlog('rendering ' + order.length + ' modules');
      var thing = order.map(function (id) {
        return renders[id].render();
      });
      // tlog('done');

      return join(thing) + '\n';
    };

    return {
      // joinCount: function () { return joinCount; },
      // rendererCount: function () { return rendererCount; },
      render: render
    };
  }
);
