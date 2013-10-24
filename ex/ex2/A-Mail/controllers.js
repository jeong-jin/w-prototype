var aMailServices = angular.module('AMail', []);

function emailRouteConfig($routeProvider) {
    $routeProvider.when('/', {
        controller : ListController,
        templateUrl : 'list.html'
    }).when('/view/:id', {
        controller : DetailController,
        templateUrl : 'detail.html'
    }).otherwise({
        redirectTo : '/'
    });
}

aMailServices.config(emailRouteConfig);

messages = [
    {
        id : 0,
        sender : 'jean@somecompany.com',
        subject : '오랜만이군, 잘 지냈어?',
        date : '2013년 12월 7일,  12:32:00',
        recipients : [ 'greg@somecompany.com' ],
        message : '야, 우리 언제 점심이나 같이 먹으면서 밀린 얘기나 하지 않으련?  올해 공동작업 할 것도 많고 말이야.'
    },
    {
        id : 1,
        sender : 'maria@somecompany.com',
        subject : '내 노트북 어디 놔뒀냐?',
        date : '2013년 12월 7일,  8:15:12',
        recipients : [ 'greg@somecompany.com' ],
        message : '너가 쓰고 나서 내 책상 서랍에 넣어놨을 줄 알았는데 보니까 거기 없는 듯...  혹시 노트북 쓰고 어디에 뒀어?'
    },
    {
        id : 2,
        sender : 'bill@somecompany.com',
        subject : '비단구렁이가 없어졌어요',
        date : '2013년 12월 6일,  20:35:02',
        recipients : [ 'greg@somecompany.com' ],
        message : "놀라진 마세요.  제가 기르는 비단구렁이가 케이지 밖으로 나갔는지 없네요.  움직임이 느리니까 혹시 보시면 전화 좀 주세요."
    },
];

function ListController($scope) {
    $scope.messages = messages;
}

function DetailController($scope, $routeParams) {
    $scope.message = messages[$routeParams.id];
}
