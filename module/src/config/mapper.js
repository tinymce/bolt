module.config.mapper = def(
  [
  ],

  function () {
    var flat = function (id) {
      return id;
    };

    var hierarchical = function (id) {
      return id.replace(/\./g, '/');
    };

    var constant = function (name) {
      return function () {
        return name;
      };
    };

    var grouping = function (splitter, groupIndex, base, idMapper) {
      return function (id) {
        var groups = id.split('.');

        return [
          groups[groupIndex],
          base,
          idMapper(id)
        ].join('/');
      }
    };

    var repo = function (base, idMapper) {
      return grouping('.', 1, base, idMapper);
    };

    return {
      flat: flat,
      hierarchical: hierarchical,
      repo: repo,
      constant: constant
    };
  }
);
