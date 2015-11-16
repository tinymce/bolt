module.exports = function(grunt) {
  grunt.registerMultiTask("bolt", "Grunt entry point for Bolt", function() {
    var config = grunt.config([this.name, this.target]);

    grunt.log.debug('task', this.name, '::', this.target, '::', process.cwd() + '/.', '::', config, '::', this.filesSrc);
    grunt.log.debug('running options:', this.options());

    config.reporter = {
      level: "debug",

      debug: function(message) {
        grunt.log.debug(message);
      },

      info: function(message) {
        grunt.log.ok(message);
      },

      warning: function(message) {
        grunt.fail.warn(message);
      },

      error: function(message) {
        grunt.log.error(message);
      },

      fatal: function(message) {
        grunt.log.error(message);
      }
    };

    var bolt = require("../npm/bolt");

    switch (this.target) {
      case 'build':
        bolt.build(config);
        break;
      case 'test':
        this.requiresConfig('bolt.test.config');
        this.requiresConfig('bolt.test.files');

        // adapt between grunt file normalisation and bolt internal config
        config.tests = this.filesSrc;
        bolt.test(config);
        break;
      default:
        grunt.fatal('There is no bolt target ' + this.target);
        break;
    }
  });
};