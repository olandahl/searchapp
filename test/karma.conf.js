module.exports = function(config){
  config.set({

    basePath : '../',

    // Include angular, scripts and templates
    files : [
      'src/vendor/angular.min.js',
      'test/angular-mocks.min.js',
      'src/app/init.js',
      'src/app/**/*.js'
    ],

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-super-dots-reporter',
      'karma-coverage'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      'src/app/**/*.js': ['coverage']
    },

    // Optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'test/coverage/'
    }

  });
};