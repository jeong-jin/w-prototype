'use strict';

define([], function () {

	//컨트롤러 선언
	function _controller($scope) {
	
		//CSS 설정
		$scope.$emit('updateCSS', ['css/home.css']);
		
		$scope.message = "소개 페이지";

        //내부 컨트롤러 4 선언
        $scope.fourthController = function($scope) {
            //컨트롤러4 메시지
            $scope.message = "싱글 페이지의 혁명!!";
        }
	}

	//생성한 컨트롤러 리턴
	return _controller;
});
