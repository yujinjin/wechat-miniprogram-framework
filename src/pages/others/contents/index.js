/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-25
 * 站点首页
 */
import pageFactory from "@js/page-factory/index";

pageFactory({
    data: {
        content: null
    },
    async onLoad(options) {
        const contentInfo = await this.queryContents(options.code);
        this.setData({
            content: contentInfo.content
        });
        wx.setNavigationBarTitle({
            title: options.title || "内容"
        });
    },
    queryContents(code) {
        return this.wxApp.api.others.queryContent(code, { isShowLoading: true });
    }
});
