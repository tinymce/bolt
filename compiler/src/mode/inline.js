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

    var replaceAll = function (string, target, value) {
      var search = '["\']' + target + '["\']'; // FIX: Be more precise here. Either '<module-name>' or "<module-name>".
      return string.replace(new RegExp(search, 'g'), value);
    };

    var readall = function (files) {
      var read = io.readall(files);
      return read.join('\n');
    };

    var run = function (config, files, target, registermodules, main, minimiseModuleNames, verbosity) {
      // moved register inside this function so we have access to the list of IDs for obfuscation
      var ids = ar.flatmap(files, metalator.boltmodules);
      var register = function (files) {
        return ar.map(ids, function (id) {
          return 'register(\'' + id + '\');';
        }).join('\n');
      };

      var result = readall(files);
      if (registermodules || main === undefined)
        result += '\n' + register(files);

      if (main !== undefined)
        result += '\ndem(\'' + main + '\')();';

      var doMinimiseModuleNames = function () {
        var mkNextId = function() {
          var base = 36;
          var moduleIndex = 0;
          var nextId = function() {
            var currentIndex = moduleIndex;
            ++moduleIndex;
            return JSON.stringify(currentIndex.toString(base));
          };
          return nextId;
        };
        var nextId = mkNextId();
        ar.each(ids, function (id) {
          var mappedTo = nextId();
          if (verbosity > 0) console.log("Mapping module %s ⇒ %s", JSON.stringify(id), mappedTo);
          result = replaceAll(result, id, mappedTo);
        });
      };

      var doMinimiseWrapperReferences = function () {
        // these are defined in the following file:
        //      inline/src/inline.js
        var def = 'eeephox_def_eeephox';
        var req = 'eeephox_req_eeephox';
        var dem = 'eeephox_dem_eeephox';
        result = result.replace(new RegExp('ephox\\.bolt\\.module\\.api\\.define', 'g'), def);
        result = result.replace(new RegExp('ephox\\.bolt\\.module\\.api\\.require', 'g'), req);
        result = result.replace(new RegExp('ephox\\.bolt\\.module\\.api\\.demand', 'g'), dem);
      };

      if (minimiseModuleNames) {
        doMinimiseModuleNames();
        doMinimiseWrapperReferences();
      }

      inline.generate(target, result);
    };

    return {
      run: run
    };
  }
);
