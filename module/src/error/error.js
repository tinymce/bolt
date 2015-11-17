module.error.error = def(
  [
  ],

  function () {
    var die = function (msg) {
      throw msg || new Error('unknown error');
    };

    return {
      die: die
    };
  }
);
