compiler.mode.compile = def(
  [
    compiler.tools.io,
    compiler.inspect.identifier,
    compiler.compile.compiler,
    compiler.compile.sources,
    ephox.bolt.module.reader.node,
    ephox.bolt.kernel.fp.array
  ],

  function (io, identifier, compiler, sources, reader, ar) {

    var tlog = function () {
      // console.log.apply(console, [new Date().toLocaleTimeString()].concat(Array.prototype.slice.call(arguments, 0)));
    };

    var compile = function (source, files, target) {
      tlog('begin');
      var modules = ar.flatmap(files, identifier.identify);
      tlog('have modules')
      var result = compiler().compile(source, modules);
      tlog('have result')
      io.write(target, result);
      tlog('all done?')
    };

    var run = function (config, files, target, done) {
      reader.read(process.cwd() + '/.', config, function (configuration) {
        sources.build(configuration, function (source) {
          compile(source, files, target);
          done && done();
        });
      });
    };

    return {
      run: run
    };
  }
);
