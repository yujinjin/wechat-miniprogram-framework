/**
 * 作者：yujinjin9@126.com
 * 时间：2021-01-08
 * 描述：页面工厂
 */
import extend from "@js/utils/extend";

export default function (page) {
    let wxApp = null;
    if (getApp()) {
        wxApp = getApp().getWxApp();
    }
    return Page(
        extend({}, page, {
            // 生命周期回调—监听页面加载
            onLoad(options) {
                if (!wxApp) {
                    wxApp = getApp().getWxApp();
                }
                this.wxApp = wxApp;
                // 通过onLoad方法设置动态设置标题的方式，发现体验不好，这里就作罢好了
                let route = wxApp.router.getRouteByUrl(this.route);
                // if(route && route.title) {
                // 	wx.setNavigationBarTitle({title: route.title});
                // }
                //分享
                if (route && route.share !== true) {
                    // 隐藏分享
                    wx.hideShareMenu();
                }
                // 页面权限判断
                if (page.onLoad) {
                    page.onLoad.call(this, options);
                }
            },
            // 生命周期回调—监听页面显示
            onShow() {
                // Do something when page show.
                if (page.onShow) {
                    page.onShow.call(this);
                }
                if (!this.data || this.data.noReport !== true) {
                    wxApp.dataReport.pageShow();
                }
            },
            // 生命周期回调—监听页面隐藏
            onHide() {
                // Do something when page show.
                if (page.onHide) {
                    page.onHide.call(this);
                }
                if (!this.data || this.data.noReport !== true) {
                    wxApp.dataReport.pageHide();
                }
            },
            // 生命周期回调—监听页面卸载
            onUnload() {
                // Do something when page show.
                if (page.onUnload) {
                    page.onUnload.call(this);
                }
                if (!this.data || this.data.noReport !== true) {
                    wxApp.dataReport.pageUnload();
                }
            },

            // 小程序分享
            onShareAppMessage(data) {
                let shareInfo = this.getDefaultShareInfo();
                if (page.onShareAppMessage && page.onShareAppMessage.call(this, data)) {
                    shareInfo = Object.assign({}, shareInfo, page.onShareAppMessage.call(this, data));
                }
                wxApp.dataReport.shareAppMessageEventReport(data, shareInfo);
                return shareInfo;
            },

            // 分享朋友圈
            onShareTimeline() {
                let shareInfo = this.getDefaultShareTimelineInfo();
                if (page.onShareTimeline && page.onShareTimeline.call(this)) {
                    shareInfo = Object.assign({}, shareInfo, page.onShareTimeline.call(this));
                }
                wxApp.dataReport.shareTimelineEventReport(shareInfo);
                return shareInfo;
            },

            // 获取默认分享微信消息信息
            getDefaultShareAppMessageInfo() {
                let route = wxApp.router.getRouteByUrl(this.route);
                let options = this.options;
                let path = "/pages/index/index?toName=" + route.name + (options && JSON.stringify(options) !== "{}" ? "&toQuery=" + JSON.stringify(options) : "");
                // 判断是否分享到首页
                if (route.isShareHome) {
                    path = "/pages/index/index?toName=home";
                }
                let referralCode = wxApp.data.userInfo.referralCode || wxApp.data.shareReferralCode;
                if (referralCode) {
                    path += `&icd=${referralCode}`;
                }
                let imgs = [
                    "https://miniappsource.oss-cn-shanghai.aliyuncs.com/724-shopping/89daf5d6dfbc96d8fac64a4db2d5433b.png",
                    "https://miniappsource.oss-cn-shanghai.aliyuncs.com/724-shopping/0fb8cccc729173148e4f1694b5354e74.png",
                    "https://miniappsource.oss-cn-shanghai.aliyuncs.com/724-shopping/8d08a4d831066892ca54757cfd74fe36.png"
                ];
                let i = parseInt(Math.random() * 3, 10);
                return {
                    path,
                    imageUrl: imgs[i],
                    title: "更健康，专注膳食营养和健康"
                };
            },

            // TODO:获取默认分享微信朋友圈信息
            // 由于分享朋友圈只能是当前页面路径，只能是加上自定义的参数
            getDefaultShareTimelineInfo() {
                // 可以考虑添加一个专属分享朋友圈的参数，在onload里判断如果有此参数重新跳转到入口获取相关信息再回到此页面
                return {
                    title: "更健康，专注膳食营养和健康",
                    query: "icd=xxx&fromTimeline=true",
                    imageUrl: "https://miniappsource.betterhealth.cn/health-better/logo.png?x-oss-process=image/resize,m_lfit,w_300,h_300,limit_1/auto-orient,1/quality,q_90"
                };
            },

            /**
             * 提示用户登录弹框
             * @param {String} message 提示用户信息
             */
            loginConfirm(message) {
                let result = true,
                    _message = "您尚未登录，是否去登录?";
                if (!wxApp.isLogin()) {
                    result = false;
                }
                if (!result) {
                    wx.showModal({
                        title: message || _message,
                        confirmColor: "#1aad19",
                        success(res) {
                            if (res.confirm) {
                                wxApp.push({ name: "login", query: { goBack: true } });
                            }
                        }
                    });
                }
                return result;
            },

            // input双向绑定
            inputChange(event) {
                let pos = event.detail.cursor;
                if (pos !== -1) {
                    // 光标在中间
                    const left = event.detail.value.slice(0, pos);
                    if (event.target.dataset.type === "number") {
                        // 计算光标的位置
                        pos = left.replace(/[^\d]/g, "").length;
                    }
                }
                let value = event.detail.value;
                if (event.target.dataset.type === "number") {
                    value = event.detail.value.replace(/[^\d]/g, "");
                }
                this.setData(wxApp.utils.setObjectProperty(this.data, event.target.dataset.name, value));
                return { value, cursor: pos };
            },

            // 切换数据状态(该参数只能是boolean类型)
            toggleStateHandle(event) {
                let paramPath = event.target.dataset.param.path;
                let value = wxApp.utils.getObjectProperty(this.data, paramPath, false);
                this.setData(wxApp.utils.setObjectProperty(this.data, paramPath, !value).rootObject);
            },

            // 一个没有意义实现的事件，由于小程序的机制事件必须要跟方法，不然会警告
            stopEvent(e) {
                //
            }
        })
    );
}
