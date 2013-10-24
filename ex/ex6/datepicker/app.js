var app = angular.module('myApp', [ 'myApp.directives' ]);

app.controller('MainCtrl', function($scope) {
    $scope.myText = '선택되지 않음';
    $scope.currentDate = '';
    $scope.updateMyText = function(date) {
        $scope.myText = '선택됨';
    };
});
