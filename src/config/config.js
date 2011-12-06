module.config.config = def(
  [
    module.error.error,
    module.config.modulator,
    module.config.source,
    module.config.apiwrapper,
    ephox.bolt.kernel.api.config,
    ephox.bolt.kernel.api.regulator
  ],

  function (error, modulator, source, apiwrapper, config, regulator) {
    var configure = function (configuration, pather, builtins) {
      var sourcespecs = configuration.sources || [];
      var modulatorspecs = configuration.types || configuration.modulators || []; // FIX transitioning to type, kill after Wed 7th December.
      var modulatorsources = modulator.sources(modulatorspecs, pather);
      var modulatortypes = modulator.types(builtins, modulatorspecs);
      var oracle = source.build(modulatorsources, modulatortypes, sourcespecs, pather);
      var r = regulator.create(oracle);
      var bolt = config.configure(r, error.die);
      return apiwrapper.api(bolt, modulatorspecs, modulatortypes);
    };

    return {
      configure: configure
    };
  }
);
