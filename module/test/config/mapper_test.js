require('../include/include.js');

var mapper = ephox.bolt.module.config.mapper;

var check = function (expected, mapper, input, message) {
  var actual = mapper(input);
  var result = expected === actual;
  assert(result, message);
};


// check('bolt.testdata.mapper', mapper.flat, 'bolt.testdata.mapper');

