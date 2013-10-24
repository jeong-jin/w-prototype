angular.module('myApp.directives', []).directive('fileupload', function() {
    return {
        restrict : 'A',
        scope : {
            done : '&',
            progress : '&'
        },
        link : function(scope, element, attrs) {
            var optionsObj = {
                dataType : 'json'
            };

            if (scope.done) {
                optionsObj.done = function() {
                    scope.$apply(function() {
                        scope.done({
                            e : e,
                            data : data
                        });
                    });
                };
            }

            if (scope.progress) {
                optionsObj.progress = function(e, data) {
                    scope.$apply(function() {
                        scope.progress({
                            e : e,
                            data : data
                        });
                    });
                }
            }

            // 위의 코드는 fileupload에 들어 있는 모든 API를 커버하게끔
            // 루프 안에서 간편히 처리할 수도 있다.

            element.fileupload(optionsObj);
        }
    };
});
