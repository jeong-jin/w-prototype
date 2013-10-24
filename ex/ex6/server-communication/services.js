var servicesModule = angular.module('myApp.services', []);

servicesModule.factory('errorService', function() {
    return {
        errorMessage : null,
        setError : function(msg) {
            this.errorMessage = msg;
        },
        clear : function() {
            this.errorMessage = null;
        }
    };
});

servicesModule.config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('errorHttpInterceptor');
});

// interceptor를 서비스로 등록하고 모든 angular ajax http 호출을 가로챔
servicesModule.factory('errorHttpInterceptor', 
function($q, $location, ErrorService, $rootScope) {
    return function(promise) {
        return promise.then(function(response) {
            return response;
        }, function(response) {
            if (response.status === 401) {
                $rootScope.$broadcast('event:loginRequired');
            } else if (response.status >= 400 && response.status < 500) {
                ErrorService.setError('서버가 원하는 것을 찾지 못 했습니다... 아쉽네요!!');
            }
            return $q.reject(response);
        });
    };
});

servicesModule.factory('Authentication', function() {
    return {
        getTokenType : function() {
            return 'Awesome';
        },
        getAccessToken : function() {
            // 실제 서버에서 가져옴
            return 'asdads131321asdasdasdas';
        }
    };
});

// 이 팩토리는 한 번만 산출되므로 authHttp는 저장된다. 따라서 authHttp 서비스가
// 다시 요청되면 똑같은 authHttp 인스턴스가 반환된다.
servicesModule.factory('authHttp', function($http, Authentication) {
    var authHttp = {};

    // 요청에 적절한 헤더를 덧붙임
    var extendHeaders = function(config) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = Authentication.getTokenType() + ' '
                + Authentication.getAccessToken();
    };

    // $http 호출마다 다음을 수행함
    angular.forEach([ 'get', 'delete', 'head', 'jsonp' ], function(name) {
        authHttp[name] = function(url, config) {
            config = config || {};
            extendHeaders(config);
            return $http[name](url, config);
        };
    });

    angular.forEach([ 'post', 'put' ], function(name) {
        authHttp[name] = function(url, data, config) {
            config = config || {};
            extendHeaders(config);
            return $http[name](url, data, config);
        };
    });

    return authHttp;
});
