'use strict';

var args = require('yargs').argv;

module.exports = function(config) {
    var debug = false;
    try {
        debug = JSON.parse(args._[0]).debug;
    } catch(err) {}
    debug = debug || args.debug;

    var autowatch = true;
    try {
        autowatch = JSON.parse(args._[0]).autowatch;
    } catch(err) {}
    autowatch = autowatch || args.autowatch;

    var reporters = ['mocha', 'coverage'];
    var browserify = {
        debug: true,
        transform: [
            ['babelify', {
                'ignore': ['./node_modules', './bower_components']
            }],
            [{
                ignore: ['**/*.test.js', '**/*.html', '**/bower_components/**', '**/node_modules/**', '**/<%=clientFolder%>/scripts/lbServices.js']
            }, 'browserify-istanbul']
        ]
    };
    if(debug === true) {
        delete browserify.transform;
        reporters.splice(reporters.indexOf('coverage'), 1);
    }

    config.set({
        browserNoActivityTimeout: 60000,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            './<%=clientFolder%>/scripts/**/*.html',
            './<%=clientFolder%>/scripts/**/*.test.js'
        ],

        // list of files to exclude
        exclude: [
            './<%=clientFolder%>/scripts/bundle*.js',
            './<%=clientFolder%>/scripts/main*.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './<%=clientFolder%>/scripts/**/*.test.js': ['browserify']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        //  reporters: ['dots', 'coverage'],
        reporters: reporters,

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: autowatch,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        mochaReporter: {
            output: 'full'
        },

        coverageReporter: {
            reporters: [{
                type: 'text'
            }, {
                type: 'text-summary'
            }, {
                type: 'cobertura',
                file: 'coverage.xml'
            }, {
                type: 'lcov'
            }]
        },

        browserify: browserify
    });
};
