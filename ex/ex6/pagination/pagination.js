var app = angular.module('myApp.services', []);

app.factory('Paginator', function() {
    // 팩토리임에도 불구하고, 이 서비스를 사용하는 주체는 이 서비스를 호출할 때마다
    // 새로운 Paginator를 얻게 된다. 실행 시에 객체를 제공하는 함수를 반환하기 때문이다.
    return function(fetchFunction, pageSize) {
        pageSize = pageSize || 10;
        var paginator = {
            hasNextVar : false,
            next : function() {
                if (this.hasNextVar) {
                    this.currentOffset += pageSize;
                    this._load();
                }
            },
            _load : function() {
                var self = this;
                fetchFunction(this.currentOffset, pageSize + 1,
                        function(items) {
                            self.currentPageItems = items.slice(0, pageSize);
                            self.hasNextVar = items.length === pageSize + 1;
                        });
            },
            hasNext : function() {
                return this.hasNextVar;
            },
            previous : function() {
                if (this.hasPrevious()) {
                    this.currentOffset -= pageSize;
                    this._load();
                }
            },
            hasPrevious : function() {
                return this.currentOffset !== 0;
            },
            currentPageItems : [],
            currentOffset : 0
        };

        // 첫 페이지를 로딩함
        paginator._load();
        return paginator;
    };
});
