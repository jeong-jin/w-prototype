'use strict';

define([
		'app', //생성한 앵귤러 모듈에 루트를 등록하기 위해 임포트
		'route-config' //루트를 등록하는 routeConfig를 사용하기 위해 임포트
	],

	function (app, routeConfig) {
	
		//app은 생성한 myApp 앵귤러 모듈
		return app.config(function ($routeProvider) {

			//홈-메인 경로 설정
			$routeProvider.when('/home', routeConfig.config('../views/home.html', 'controllers/home', {
				directives: ['directives/version'], 
				services: [], 
				filters: ['filters/reverse']
			}));
			
			//서비스 소개 경로 설정
			$routeProvider.when('/service', routeConfig.config('../views/service.html', 'controllers/service', {
				directives: ['directives/version'], 
				services: ['services/tester'], 
				filters: []
			}));
			
			//파일 업로드 / 템플릿 선택 / 템플릿 리스트 경로 설정
			$routeProvider.when('/template', routeConfig.config('../views/template.html', 'controllers/template', {
                directives: ['directives/version'],
                services: ['services/tester'],
                filters: []
            }));

            //연락처 경로 설정
            $routeProvider.when('/contact', routeConfig.config('../views/contact.html', 'controllers/contact'));

			//admin 경로 설정
			$routeProvider.when('/admin', routeConfig.config('../views/admin.html', 'controllers/admin'));

			//기본 경로 설정
			$routeProvider.otherwise({redirectTo:'/home'});
		});
});
