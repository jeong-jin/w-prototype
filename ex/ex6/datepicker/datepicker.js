angular.module('myApp.directives', []).directive('datepicker', function() {
    return {
        // angularJS가 기본적으로 지시어를 속성에만 사용하게끔 제한
        restrict : 'A',
        // 반드시 ng-model과 함께 사용하게 함
        require : '?ngModel',
        scope : {
            // 이 메소드를 정의해서 뷰 컨트롤러에 있는 지시어에 전달해야 한다.
            select : '&' // 참조하는 select 함수를 정확한 스코프에 바인딩

        },
        link : function(scope, element, attrs, ngModel) {
            if (!ngModel)
                return;

            var optionsObj = {};

            optionsObj.dateFormat = 'mm/dd/yy';
            var updateModel = function(dateTxt) {
                scope.$apply(function() {
                    // 양방향 바인딩을 업데이트하는 내부의 AngularJS 도우미 함수를 호출
                    ngModel.$setViewValue(dateTxt);
                });
            };

            optionsObj.onSelect = function(dateTxt, picker) {
                updateModel(dateTxt);
                if (scope.select) {
                    scope.$apply(function() {
                        scope.select({
                            date : dateTxt
                        });
                    });
                }
            };

            ngModel.$render = function() {
                // AngularJS의 내부 binding-specific 변수를 사용
                element.datepicker('setDate', ngModel.$viewValue || '');
            };
            element.datepicker(optionsObj);
        }

    };
});
