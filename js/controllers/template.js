'use strict';

define([], function () {

	//컨트롤러 선언
	function _controller($scope) {
	
		//CSS 설정
		$scope.$emit('updateCSS', ['css/template.css']);
	
        //페이지 요약
		$scope.headTitle = "템플릿 리스트 / 파일 업로드";

		

//		//내부 컨트롤러
//		$scope.fourthController = function($scope) {
//			//컨트롤러4 메시지
//			$scope.message = "I'm the 4th controller!";
//		}
	}

	//생성한 컨트롤러 리턴
	return _controller;
});
