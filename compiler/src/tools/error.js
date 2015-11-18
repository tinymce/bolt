compiler.tools.error = def(
  [
  ],

  function () {
    // A bit messy, but gives us the start of a bolt-wide logging instance
    var die;
    var setOutput = function (error, exit) {
      die = function (message, success) {
        error("error: " + message + "\n");
        exit(success === true);
      };
    };

    setOutput(console.error, function (success) {
      process.exit(success ? 0 : 1);
    });

    return {
      die: die,
      setOutput: setOutput
    };
  }
);
