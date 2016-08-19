require('../include/include.js');

var mapper = ephox.bolt.module.config.mapper;

var check = function (message, expected, mapper, input) {
  var actual = mapper(input);
  var result = expected === actual;

  assert(result, message);
};


check('flat', 'bolt.testdata.Mapper', mapper.flat, 'bolt.testdata.Mapper');
check('heirarchical', 'bolt/testdata/Mapper', mapper.hierarchical, 'bolt.testdata.Mapper');
check('constant', 'bolt.testdata', mapper.constant('bolt.testdata'), 'bolt.testdata.Other');
check('repo(flat)', 'alpha/src/bolt.alpha.api.Module', mapper.repo('src', mapper.flat), 'bolt.alpha.api.Module');
check('repo(hierarchical)', 'alpha/src/bolt/alpha/api/Module', mapper.repo('src', mapper.hierarchical), 'bolt.alpha.api.Module');

