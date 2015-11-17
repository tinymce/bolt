compiler.tools.defaults = def(
  [
  ],

  function () {
    return function () {
      return {
        config_js: 'config/bolt/prod.js',
        output_dir: 'scratch/main/js',
        src_dir: 'src/main/js',
        generate_inline: false,
        generate_modules: false,
        minimise_module_names: false,
        register_modules: false,
        main: undefined,
        entry_points: [],
        entry_groups: {},
        verbosity: 0
      };
    };
  }
);
