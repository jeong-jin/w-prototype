// RequireJS 환경설정을 정의하는 app/scripts/main.js 파일
require.config({
  paths: {
    angular: 'vendor/angular.min',
    jquery: 'vendor/jquery',
    domReady: 'vendor/domReady'
  },
  shim: {
    angular: {
      deps: [ 'jquery'],
      exports: 'angular'
    }
  }
});

require([
  'angular',
  'app',
  'domReady',
  'services/userService',
  'controllers/rootController',
  'directives/ngbkFocus'
    // 개발자가 추가하는 개별 컨트롤러, 서비스, 지시어, 필터 파일을 여기에 끌어와야 한다.
],
  function (angular, app, domReady) {
    'use strict';
    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'views/root.html',
          controller: 'RootCtrl'
        });
      }
    ]);
    domReady(function() {
      angular.bootstrap(document, ['MyApp']);

      // 다음은 AngularJS Scenario 테스트가 제대로 되기 위해 꼭 필요하다.
      $('html').addClass('ng-app: MyApp');
    });
  }
);
