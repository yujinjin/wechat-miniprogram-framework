/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-20
 * 描述：小程序发起 HTTPS 网络请求
 */
import constant from "@js/services/constant.js";
import config from "@js/config/index.js";

export default (function () {
    let wxApp = null;
    let loadingTimes = 0;
    return function (options) {
        let token = undefined;
        if (!wxApp && getApp()) {
            wxApp = getApp().getWxApp();
        } else if (!getApp()) {
            console.error("getApp 未初始化...");
        }
        if (wxApp) {
            token = wxApp.getUserToken();
        }
        let _default = {
            header: {
                "Abplus-ClientVersion": config.innerVersion,
                ["Authorization"]: token,
                "Abplus-SysCode": config.apiPlatform
            },
            // 是否显示loading加载
            isShowLoading: false,
            // 是否让框架自动显示错误提示信息
            isShowError: true,
            //是否处理返回的response数据，默认系统框架会处理数据
            isResultData: true,
            // 数据loading加载定时器ID
            showLoadingTimerId: null
        };
        if (typeof options === "string") {
            _default.url = options;
        } else {
            _default = Object.assign(_default, options);
        }
        if (_default.url.indexOf("http://") === -1 && _default.url.indexOf("https://") === -1) {
            _default.url = config.apiDomain + _default.url;
        }
        return new Promise((resolve, reject) => {
            _default.success = function (response) {
                let errorMesg = "";
                // 可以在这里对收到的响应数据对象进行加工处理
                switch (response.statusCode) {
                    case 200:
                        break;
                    case 401:
                    case 403:
                        errorMesg = "当前账户信息有问题，请重新登录";
                        // wxApp.localStorage.setLoginUserInfo({}, wxApp);
                        // // 自动跳转登录页
                        // wx.redirectTo({
                        //     url: "/pages/index/index"
                        // });
                        break;
                    case 405:
                        errorMesg = "请求的资源不支持!";
                        break;
                    case 500:
                    case 502:
                        errorMesg = (response.data.error && (response.data.error.details || response.data.error.message)) || "服务器出错";
                        break;
                    case 503:
                        errorMesg = "哦～服务器宕机了";
                        break;
                }
                if (errorMesg) {
                    if (_default.isShowError)
                        wx.showToast({
                            title: errorMesg,
                            icon: "none"
                        });
                    reject(response);
                } else {
                    let result = response.data;
                    if (_default.isResultData && response.data.__abp === true) {
                        result = response.data.result;
                    }
                    resolve(result);
                    if (options && typeof options.success === "function") options.success(result);
                }
            };
            _default.fail = function (response) {
                if (_default.isShowError) {
                    // TODO：具体抛出的异常消息
                    wx.showToast({
                        title: "网络连接失败",
                        icon: "none"
                    });
                }
                if (options && typeof options.fail === "function") options.fail(response);
                reject(response);
            };
            _default.complete = function () {
                if (_default.isShowLoading) {
                    loadingTimes = loadingTimes - 1;
                    if (_default.showLoadingTimerId) {
                        clearTimeout(_default.showLoadingTimerId);
                    }
                    if (loadingTimes == 0) {
                        wx.hideNavigationBarLoading();
                    }
                }
            };
            if (_default.isShowLoading) {
                loadingTimes = loadingTimes + 1;
                _default.showLoadingTimerId = setTimeout(wx.showNavigationBarLoading, constant.API_LAZY_LOADING_TIME);
            }
            wx.request(_default);
        });
    };
})();
