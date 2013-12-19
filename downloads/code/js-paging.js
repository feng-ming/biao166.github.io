function PageNav(args) {
    this.container = args.container;
    this.perNumber = args.perNumber, this.totalNumber = args.totalNumber;
    this.totalPage = Math.ceil(this.totalNumber / this.perNumber);
    this.callBack = args.callBack;
    this.cCount = 2;
    this.curPage = args.curPage || 1;
    if(this.container && this.perNumber && this.totalNumber) {
        this.setPage();
    }
}
PageNav.prototype = {
    constructor: PageNav,
    setPage: function() {
        var outstr = '';
        if(this.curPage == 1) {
            outstr = outstr + "<a class='pre disabled' href='javascript:void(0)'>&laquo;</a>";
        }
        if(this.curPage > 1) {
            var pre = this.curPage - 1;
            outstr = outstr + this.setHtml(pre, '&laquo;');
        }
        if(this.curPage > this.cCount + 1) {
            outstr = outstr + this.setHtml(1, 1);
        }
        if(this.curPage > this.cCount + 2) {
            outstr = outstr + "<span>...</span>";
        }
        for(var i = this.curPage - this.cCount; i <= this.curPage + this.cCount; i++) {
            if(i > 0 && i <= this.totalPage) {
                outstr = outstr + (i == this.curPage ? "<strong class='current'>" + i + "</strong>" : this.setHtml(i, i));
            }
        }
        if(this.curPage < this.totalPage - this.cCount - 1) {
            outstr = outstr + "<span>...</span>";
        }
        if(this.curPage < this.totalPage - this.cCount) {
            outstr = outstr + this.setHtml(this.totalPage, this.totalPage);
        }
        if(this.curPage < this.totalPage) {
            var nxt = this.curPage + 1;
            outstr = outstr + this.setHtml(nxt, '&raquo;');
        }
        if(this.curPage == this.totalPage) {
            outstr = outstr + "<a class='nxt disabled' href='javascript:void(0)'>&raquo;</a>";
        }
        this.container.html(outstr);
        this.bind();
        return this;
    },
    bind: function() {
        var that = this;
        this.container.find('a[data-page]').click(function() {
            that.curPage = parseInt($(this).attr("data-page"));
            that.setPage().callBack(that.curPage);
        });
    },
    setHtml: function(page, text) {
        return '<a data-page="' + page + '" href="javascript:void(0)" title="第' + page + '页">' + text + '</a>';
    }
}


//调用
var pageNav = new PageNav({
    container: $('#pgt_invitation'),
    perNumber: 4,
    totalNumber: 30,
    callBack: function(page) {
        window.console.log && console.log(page);
    }
});
