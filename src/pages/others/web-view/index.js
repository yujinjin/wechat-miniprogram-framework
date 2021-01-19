import pageFactory from "@js/page-factory/index";

pageFactory({
    data: {
        webUrl: null,
        title: ""
    },
    onLoad(options) {
        this.setData({
            webUrl: options.webUrl
        });
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title
            });
        }
    }
});
