var app = angular.module('myApp', []);

// 소켓 서비스를 팩토리로 정의함으로써, 소켓 서비스가 한 번만 인스턴스화되어
// 애플리케이션 스코프 내에서 싱클톤 역할을 하게 하자.
app.factory('socket', function($rootScope) {
    var socket = io.connect('http://localhost:8080');
    return {
        on : function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit : function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

function MainCtrl($scope, socket) {

    $scope.message = '';
    $scope.messages = [];

    // 새 msg 이벤트가 서버에서 발생하면
    socket.on('new:msg', function(message) {
        $scope.messages.push(message);
    });

    // 새 메시지가 있음을 서버에 알림
    $scope.broadcast = function() {
        socket.emit('broadcast:msg', {
            message : $scope.message
        });
        $scope.messages.push($scope.message);
        $scope.message = '';
    };
}
