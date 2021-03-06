module.exports = function(config){
  config.set({

    basePath : '../',

    // Include angular, scripts and templates
    files : [
      'vendor/angular.min.js',
      'test/angular-mocks.min.js',
      'src/init.js',
      'src/**/*.js'
    ],

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage'
    ],

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    // Optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'test/coverage/',
      subdir: '.'
    }

  });
};