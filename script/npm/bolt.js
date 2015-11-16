require('./../lib/kernel');
require('./../lib/loader');
require('./../lib/module');
require('./../lib/test');
require('fs');

var build = function (config) {
  throw 'not implemented';
};

var test = function (config, callback) {
  var runner = ephox.bolt.test.run.runner;
  var reporter = ephox.bolt.test.report.logger.create(config.verbose, callback);
  var fn = ephox.bolt.kernel.fp.functions;
  var node = ephox.bolt.module.reader.node;
  var reader = fn.curry(node.read, process.cwd() + '/.', config.config);

  runner.run(reporter, reader, config.tests);
};

module.exports = {
  build: build,
  test: test
};