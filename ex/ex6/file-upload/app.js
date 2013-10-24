var app = angular.module('myApp', [ 'myApp.directives' ]);

app.controller('MainCtrl', function($scope) {
    $scope.uploadFinished = function(e, data) {
        console.log('이 파일은 지금 업로드가 끝났습니다...');
    };
});
