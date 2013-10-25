'use strict';

define([
		'app', //생성한 앵귤러 모듈에 루트를 등록하기 위해 임포트
		'route-config' //루트를 등록하는 routeConfig를 사용하기 위해 임포트
	],

	function (app, routeConfig) {
	
		//app은 생성한 myApp 앵귤러 모듈
		return app.config(function ($routeProvider) {

			//view1 경로 설정
			$routeProvider.when('/home', routeConfig.config('../views/home.html', 'controllers/first', {
				directives: ['directives/version'], 
				services: [], 
				filters: ['filters/reverse']
			}));
			
			//view2 경로 설정
			$routeProvider.when('/service', routeConfig.config('../views/service.html', 'controllers/second', {
				directives: ['directives/version'], 
				services: ['services/tester'], 
				filters: []
			}));
			
			//grid 경로 설정
			$routeProvider.when('/template', routeConfig.config('../views/template.html', 'controllers/grid'));

            //grid 경로 설정
            $routeProvider.when('/contact', routeConfig.config('../views/contact.html', 'controllers/grid'));

			//admin 경로 설정
			$routeProvider.when('/admin', routeConfig.config('../views/admin.html', 'controllers/third'));

			//기본 경로 설정
			$routeProvider.otherwise({redirectTo:'/home'});
		});
});
