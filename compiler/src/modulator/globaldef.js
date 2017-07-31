// this helps with minification when using a lot of global references
var defineGlobal = function (id, ref) {
  ephox.bolt.module.api.define(id, [], function () { return ref; });
};
