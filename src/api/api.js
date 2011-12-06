module.api = def(
  [
    module.runtime,
    module.mapper.mapper
  ],
  
  function (runtime, mapper) {
    var delegate = function (method) {
      return function () {
        return runtime[method].apply(null, arguments);
      };
    };

    return {
      configure: delegate('configure'),
      modulator: delegate('type'),   // FIX transitioning to type, kill after Wed 7th December.
      type: delegate('type'),
      source: delegate('source'),
      mapper: mapper,
      define: delegate('define'),
      require: delegate('require'),
      demand: delegate('demand'),
      main: delegate('main'),
      expose: delegate('expose')
    };
  }
);
