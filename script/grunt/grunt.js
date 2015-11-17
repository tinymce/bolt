module.exports = function(grunt) {
  var bolt = require("../npm/bolt");

  // var reporter = {
  //   level: "debug",

  //   debug: function(message) {
  //     grunt.log.debug(message);
  //   },

  //   info: function(message) {
  //     grunt.log.ok(message);
  //   },

  //   warning: function(message) {
  //     grunt.fail.warn(message);
  //   },

  //   error: function(message) {
  //     grunt.log.error(message);
  //   },

  //   fatal: function(message) {
  //     grunt.log.error(message);
  //   }
  // };

  grunt.registerMultiTask("bbuild", "Bolt build task", function () {
    var done = this.async();

    var config = grunt.config([this.name, this.target]);

    grunt.log.debug('task', this.name, '::', this.target, '::', process.cwd() + '/.', '::', config, '::', this.filesSrc);
    grunt.log.debug('running options:', this.options());

    config.entry_groups = {};
    config.entry_groups[this.target] = this.filesSrc;

    bolt.build(config, grunt.log.error, function (success) {
      done(success);
    });
  });

  grunt.registerMultiTask("btest", "Bolt test task", function () {
    var done = this.async();

    var config = grunt.config([this.name, this.target]);

    grunt.log.debug('task', this.name, '::', this.target, '::', process.cwd() + '/.', '::', config, '::', this.filesSrc);
    grunt.log.debug('running options:', this.options());

    this.requiresConfig([this.name, this.target, 'config']);
    this.requiresConfig([this.name, this.target, 'files']);

    // TODO: use a bolt-wide logging framework for tests too
    var oldLog = {
      log: console.log,
      error: console.error
    };
    console.debug = console.log;
    console.log = grunt.log.ok;
    console.error = grunt.log.error;

    var callback = function (success) {
      console.log = oldLog.log;
      console.error = oldLog.error;
      done(success);
    };

    // adapt between grunt file normalisation and bolt internal config
    config.tests = this.filesSrc;
    bolt.test(config, callback);
  });
};