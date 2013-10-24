describe('페이지 구분 서비스', function() {

    beforeEach(module('myApp.services'));

    var paginator;

    var items = [ 1, 2, 3, 4, 5, 6 ];
    var fetchFn = function(offset, limit, callback) {
        callback(items.slice(offset, offset + limit));
    };

    beforeEach(inject(function(Paginator) {
        paginator = Paginator(fetchFn, 3);
    }));

    it('첫 페이지의 항목들을 표시해야 함', function() {
        expect(paginator.currentPageItems).toEqual([ 1, 2, 3 ]);
        expect(paginator.hasNext()).toBeTruthy();
        expect(paginator.hasPrevious()).toBeFalsy();
    });

    it('다음 페이지로 이동해야 함', function() {
        paginator.next();
        expect(paginator.currentPageItems).toEqual([ 4, 5, 6 ]);
        expect(paginator.hasNext()).toBeFalsy();
        expect(paginator.hasPrevious()).toBeTruthy();
    });

    it('이전 페이지로 이동해야 함', function() {
        paginator.next();
        expect(paginator.currentPageItems).toEqual([ 4, 5, 6 ]);
        paginator.previous();
        expect(paginator.currentPageItems).toEqual([ 1, 2, 3 ]);
    });

    it('마지막 페이지에서 다음으로 이동해선 안 됨', function() {
        paginator.next();
        expect(paginator.currentPageItems).toEqual([ 4, 5, 6 ]);
        paginator.next();
        expect(paginator.currentPageItems).toEqual([ 4, 5, 6 ]);
    });

    it('첫 페이지에서 이전으로 이동해선 안 됨', function() {
        paginator.previous();
        expect(paginator.currentPageItems).toEqual([ 1, 2, 3 ]);
    });
});
