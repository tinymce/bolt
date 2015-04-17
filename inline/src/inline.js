var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

var instantiate = function (id) {
  var dependencies = defs[id].deps;
  var definition = defs[id].defn;
  var instances = [];
  for (var i = 0; i < dependencies.length; ++i)
    instances.push(dem(dependencies[i]));
  defs[id].instance = definition.apply(null, instances);
  if (defs[id].instance === undefined)
     throw 'module [' + id + '] returned undefined';
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  if (defs[id] === undefined)
    throw 'module [' + id + '] was undefined';
  if (defs[id].instance === undefined)
    instantiate(id);
  return defs[id].instance;
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
