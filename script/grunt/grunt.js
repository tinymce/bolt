module.exports = function(grunt) {
  var bolt = require("../npm/bolt");

  grunt.registerMultiTask("bbuild", "Bolt build task", function () {
    var done = this.async();

    var config = grunt.config([this.name, this.target]);

    this.requiresConfig([this.name, this.target, 'files']);

    // adapt between grunt file normalisation and bolt internal config
    config.entry_groups = {};
    config.entry_groups[this.target] = this.filesSrc;

    bolt.build(config, grunt.log.error, done);
  });

  grunt.registerMultiTask("btest", "Bolt test task", function () {
    var done = this.async();

    var config = grunt.config([this.name, this.target]);

    this.requiresConfig([this.name, this.target, 'config']);
    this.requiresConfig([this.name, this.target, 'files']);

    // adapt between grunt file normalisation and bolt internal config
    config.tests = this.filesSrc;

    bolt.test(config, grunt.log.ok, grunt.log.error, done);
  });
};