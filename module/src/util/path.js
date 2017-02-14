module.util.path = def(
  [
    ephox.bolt.kernel.fp.array
  ],

  function (ar) {
    var dirname = function (file) {
      var normalized = file.replace(/\\/g, '/');
      var end = normalized.lastIndexOf('/');
      return normalized.substring(0, end);
    };

    var basename = function (file) {
      var normalized = file.replace(/\\/g, '/');
      var end = normalized.lastIndexOf('/');
      return normalized.substring(end + 1);
    };

    var normalize = function (file) {
      var parts = file.split('/');
      var outParts = [];

      ar.each(parts, function (part) {
        if (part === '.') return;
        else if (part === '..') outParts.pop();
        else outParts.push(part);
      });

      return outParts.join('/');
    };

    return {
      basename: basename,
      dirname: dirname,
      normalize: normalize
    };
  }
);
