// FIX reconsider name, but compiler.compile.compiler.compile() method calls would rock.
compiler.compile.compiler = def(
  [
    compiler.inspect.metalator,
    compiler.tools.io,
    compiler.tools.error,
    compiler.compile.renderer,
    ephox.bolt.kernel.module.analyser,
    ephox.bolt.kernel.fp.functions,
    ephox.bolt.kernel.fp.object
  ],

  function (metalator, io, error, renderer, analyser, fn, obj) {
    return function () {
      var modules = {}; // id -> [id]
      var renders = {}; // id -> spec

      var analyse = function (ids) {
        var results = analyser.analyse(ids, modules);
        if (results.cycle)
          error.die('cycle detected whilst compiling modules: ' + results.cycle.join(' ~> '));
        return results;
      };

      var load = function (sources, id) {
        var spec = sources.load(id);
        renders[id] = spec;
        spec.load(function (id, dependencies) {
          modules[id] = dependencies;
        });
      };

      var checkedload = function (sources, id) {
        if (!sources.can(id))
          error.die('Configuration error: no source found to load module: ' + id);

        load(sources, id);

        if (modules[id] === undefined)
          error.die('Configuration error: module [' + id + '] was not loaded from expected source');
      };

      var tlog = function () {
        // console.log.apply(console, [new Date().toLocaleTimeString()].concat(Array.prototype.slice.call(arguments, 0)));
      };

      var compile = function (sources, ids) {
        tlog('in compiler');
        var loader = fn.curry(checkedload, sources);
        tlog('before analyse');
        var results = analyse(ids);
        tlog('after analyse, looping ' + results.load.length);
        while (results.load.length > 0) {
          results.load.forEach(loader);
          results = analyse(ids);
        }
        var all = obj.keys(modules);
        tlog('about to render metalator');
        var header = metalator.render(all); // FIX consider separating all ids vs specified ids.
        tlog('about to render renderer. ids :: modules :: renders ' + ids.length + ' ids, ' + obj.keys(modules).length + ' modules, ' + obj.keys(renders).length + ' renders');
        var r = header + renderer.render(ids, modules, renders);
        // tlog('render did ' + renderer.joinCount() + ' joins, ' + renderer.rendererCount() + ' renderer calls');
        return r;
      };

      return {
        compile: compile
      };
    };
  }
);
