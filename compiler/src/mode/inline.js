compiler.mode.inline = def(
  [
    compiler.tools.files,
    compiler.tools.io,
    compiler.tools.error,
    compiler.inspect.metalator,
    compiler.generator.inline,
    ephox.bolt.kernel.fp.array
  ],

  function (filer, io, error, metalator, inline, ar) {

    var verbose = false;

    // TODO: in tools somewhere
    function escapeRegExp (string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll (string, target, value) {
      var search = '["\']' + target + '["\']';
      return string.replace(new RegExp(search, 'g'), '\'' + value + '\'');
    }

    var readall = function (files) {
      var read = io.readall(files);
      return read.join('\n');
    };

    var run = function (config, files, target, registermodules, main) {
      // moved register inside this function so we have access to the list of IDs for obfuscation
      var ids = ar.flatmap(files, metalator.boltmodules);
      var register = function (files) {
        return ar.map(ids, function (id) {
          return 'register(\'' + id + '\');';
        }).join('\n');
      };

      var result = readall(files);
      if (registermodules || main === undefined)
        // TODO: register doesn't work with obfuscation. Make obfs an option, and don't allow both simultaneously.
        // Or just ditch register, we've never used it.
        result += '\n' + register(files);
      if (main !== undefined)
        result += '\ndem(\'' + main + '\')();';

      var mkNextId = function() {
        var moduleIndex = 0;
        var nextId = function() {
          var currentIndex = moduleIndex;
          ++moduleIndex;
          return currentIndex.toString();
        };
        return nextId;
      };

      // Replace module names with obfuscated/minified names.
      var nextId = mkNextId();
      ar.each(ids, function (id) {
        var mappedTo = nextId();
        if (verbose) console.log("Mapping module '%s' => '%s'", id, mappedTo);
        result = replaceAll(result, id, mappedTo);
      });

      inline.generate(target, result);
    };

    return {
      run: run
    };
  }
);
