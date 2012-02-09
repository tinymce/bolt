compiler.mode.dev = def(
  [
    compiler.bootstrap.generator,
    compiler.compile.modulator,
    compiler.compile.configurator
  ],

  function (generator, modulator) {
    var run = function (bootstrap, config) {
      config = config || 'module.js';
      var hookup =
        '(function () {\n' +
        '  var obj = ephox.bolt.kernel.fp.object;\n' +
        '  var api = ephox.bolt.module.api;\n' +
        '  var builtins = ephox.bolt.module.config.builtins.browser;\n' +
        '  var install = ephox.bolt.module.bootstrap.install;\n' +
        '  var reader = ephox.bolt.module.bootstrap.configloader.create("' + config + '");\n' +
        '  install.install(reader, builtins);\n' +
        '  obj.merge(window, api);\n' +
        '})();';
      generator.generate(bootstrap, hookup);
    };

    return {
      run: run
    };
  }
);
