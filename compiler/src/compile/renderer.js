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
      return stripempty(ss).join('\n');
    };

    var render = function (ids, modules, renders) {
      var found = {};  // url ->  boolean
      var sorted = [];

      // traverse the dependency tree, producing a list of modules in dependency order.
      var findDependencies = function (id) {
        var spec = renders[id];
        if (spec === undefined) throw 'undefined render for ' + id + ', deps ' + modules[id];
        else if (found[spec.url] === true) return; // already found, no need to search any further

        // recursively search this module's dependencies
        var deps = modules[id];
        ar.each(deps, findDependencies);

        // mark this module as found, and add it to the list
        found[spec.url] = true;
        sorted.push(id);
      };

      ar.each(ids, findDependencies);

      var rendered = sorted.map(function (id) {
        return renders[id].render();
      });

      return join(rendered);
    };

    return {
      render: render
    };
  }
);
