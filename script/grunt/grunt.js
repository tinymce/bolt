module.exports = function(grunt) {
  grunt.registerMultiTask("bolt", "Grunt entry point for Bolt", function() {
    var config = grunt.config([this.name, this.target]);

    grunt.log.debug('task', this.name, '::', this.target, '::', process.cwd() + '/.', '::', config, '::', this.filesSrc);
    grunt.log.debug('running options:', this.options());

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
    var done = this.async();

    var bolt = require("../npm/bolt");

    switch (this.target) {
      case 'build':
        this.requiresConfig('bolt.build.project');

        config.entry_groups = {};
        config.entry_groups[config.project] = this.filesSrc;

        bolt.build(config, grunt.log.error, function (success) {
          console.trace('build complete');
          done(success);
        });
        break;
      case 'test':
        this.requiresConfig('bolt.test.config');
        this.requiresConfig('bolt.test.files');

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
        break;
      default:
        grunt.fatal('There is no bolt target ' + this.target);
        break;
    }
  });
};