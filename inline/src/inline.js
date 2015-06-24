var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

var instantiate = function (id) {
  var actual = defs[id];
  var dependencies = actual.deps;
  var definition = actual.defn;
  var instances = [];
  for (var i = 0; i < dependencies.length; ++i)
    instances.push(dem(dependencies[i]));
  actual.instance = definition.apply(null, instances);
  if (actual.instance === undefined)
     throw 'module [' + id + '] returned undefined';
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var instances = [];
  for (var i = 0; i < ids.length; ++i)
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
};

var ephox = {};

ephox.bolt = {
  module: {
    api: {
      define: def,
      require: req,
      demand: dem
    }
  }
};

// This is here to give hints to minification
// ephox.bolt.module.api.define
var eeephox_def_eeephox = def;
var define = def;
// ephox.bolt.module.api.require
var eeephox_req_eeephox = req;
var require = req;
// ephox.bolt.module.api.demand
var eeephox_dem_eeephox = dem;
var demand = dem;
// ephox.bolt.module.api.require
// ephox.bolt.module.api.demand
