module.exports = function(grunt) {

  // Load all grunt plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    // Source and destionation directories
    src_dir: './src',
    build_dir: './dist',

    // Globbing patterns for different file types
    init_js: '<%= src_dir %>/app/init.js',   // The app init js files
    src_js: '<%= src_dir %>/app/**/*.js',   // All app js files
    src_spec: '<%= src_dir %>/**/*.spec.js',  // All unit test spec js files
    src_less: '<%= src_dir %>/**/*.less',   // All less files


    build_js: '<%= build_dir %>/searchApp.js',  // Destination js file, this is the concatenated, minified version of all js and html templates
    build_css: '<%= build_dir %>/searchApp.css', // Destination css file, this is the compiled, concatenated, minifed version of all less files


    // Concatenate and minify javascripts
    uglify: {
      dev: {
        options: {
          // Uncomment rows below to prevent minification
          mangle: false,
          compress: false,
          beautify: true
        },
        src: ['<%= init_js %>', '<%= src_js %>', '!<%= src_spec %>'], // Include all js except unit test specs
        dest: '<%= build_js %>'   // Place the result in the destination js file
      }
    },

    // Test runner
    karma: {
      unit: {
        // Used to run tests when javascripts change
        configFile: 'test/karma.conf.js',
        background: true,
        runnerPort: 9999,
        logLevel: 'INFO'
      },
      single: {
        // Used to run tests one time and end process
        configFile: 'test/karma.conf.js',
        runnerPort: 9999,
        singleRun: true,
        logLevel: 'INFO'
      }
    },

    // Compile, concatenate and minify less to css
    less: {
      options: {
        cleancss: true,
      },
      files: {
        expand: false,
        src: '<%= src_less %>',   // Include all less files
        dest: '<%= build_css %>'  // Place the result in the destination css file
      }
    },

    // Watch file changes and trigger actions such as livereload, recompile etc
    watch: {
      options: {
        spawn: false,   // Faster reaction when files change
        livereload: true  // Enables live reload when files change (use for example Chrome LiveReload app)
      },

      index: {
        files: ['index.html']
      },

      less: {
        files: ['<%= src_less %>'],
        tasks: ['less']
      },

      scripts: {
        files: ['<%= src_js %>', '!<%= src_spec %>'],
        tasks: ['js']
      },

      tests: {
        files: ['<%= src_js %>'],
        tasks: ['karma:unit:run']
      },
    }
  });


  // Run task when developing. Runs tasks when file changes.
  grunt.registerTask('dev', ['karma:unit', 'watch']);

  // Group js tasks together
  grunt.registerTask('js', ['uglify']);

  // Build project
  grunt.registerTask('build', ['js', 'karma:single', 'less']);

  // Build and run local dev server by default
  grunt.registerTask('default', ['build']);

};