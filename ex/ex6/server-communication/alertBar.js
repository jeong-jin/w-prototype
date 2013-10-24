// 사용법: <div alert-bar alertMessage="myMessageVar"></div>
angular.module('myApp.directives', []).
directive('alertBar', ['$parse', function($parse) {
    return {
        restrict: 'A',
        template: '<div class="alert alert-error alert-bar" ng-show="errorMessage">' +
            '<button type="button" class="close" ng-click="hideAlert()">x</button>' +
            '{{errorMessage}}</div>',

        link: function(scope, elem, attrs) {
                var alertMessageAttr = attrs['alertmessage'];
                scope.errorMessage = null;

                scope.$watch(alertMessageAttr, function(newVal) {
                scope.errorMessage = newVal;
            });
            scope.hideAlert = function() {
                scope.errorMessage = null;
                // 연결된 변수의 에러 메시지도 초기화한다.
                // 이것은 같은 에러가 다시 발생할 경우에 대비해
                // 경고 바가 다음 번에 다시 표시될 수 있게 하기 위함이다.
                $parse(alertMessageAttr).assign(scope, null);
            };
        }
    };
}]);
