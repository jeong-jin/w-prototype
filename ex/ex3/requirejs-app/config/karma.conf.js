// 이것은 config/karma.conf.js 파일이다.
// 다음 경로는 파일을 해독하는 데 사용될 기준 경로다.
// (이 예제에선 프로젝트의 루트임)
basePath = '../';

// 브라우저에 로딩할 파일과 패턴을 배열로 정의
files = [
  JASMINE,
  JASMINE_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,

  // !! Put all libs in RequireJS 'paths' config here (included: false).
  // All these files are files that are needed for the tests to run,
  // but Karma is being told explicitly to avoid loading them, as they
  // will be loaded by RequireJS when the main module is loaded.

  // all the sources, tests  // !! all src and test modules (included: false)
  {pattern: 'app/scripts/vendor/*.js', included: false},
  {pattern: 'app/scripts/services/*.js', included: false},
  {pattern: 'test/spec/services/*.js', included: false},

  // !! test main require module last
  'test/spec/main.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress
reporter = 'progress';

// web server port
port = 8989;

// cli runner port
runnerPort = 9898;

// enable/disable colors in the output (reporters and logs)
colors = true;

// level of logging
logLevel = LOG_INFO;

// enable/disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
// - IE if you have a windows box
browsers = ['Chrome'];

// Continuous Integration mode
// if true, it captures browsers, runs tests, and exits
singleRun = false;
