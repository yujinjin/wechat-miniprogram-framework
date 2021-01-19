import api from "./api/index.js";
import localStorage from "./services/local-storage.js";
import utils from "./utils/utils.js";
import constant from "./services/constant.js";
import data from "./services/data";
import config from "./config/index.js";
import router from "./router/index.js";
import events from "./services/events";
import update from "./services/update";
import { autoLogin } from "./services/login";
import dataReport from "./services/data-report";

export default {
    config,
    api,
    localStorage,
    utils,
    constant,
    data,
    router,
    events,
    dataReport,
    async init(options) {
        // 初始化设备配置
        let systemInfo = wx.getSystemInfoSync();
        // TODO：初始化配置
        config.device.version = systemInfo.version;
        config.device.systemVersion = systemInfo.system;
        config.device.SDKVersion = systemInfo.SDKVersion;
        config.device.brand = systemInfo.brand;
        config.device.model = systemInfo.model;
        if (systemInfo.system.indexOf("iOS") != -1) {
            config.device.isIOSDevice = true;
        } else if (systemInfo.system.indexOf("Android") != -1) {
            config.device.isAndroidDevice = true;
        }
        // 初始化本地用户存储信息
        let loginUserInfo = localStorage.getLoginUserInfo();
        if (loginUserInfo.token) {
            data.userInfo.userId = loginUserInfo.userId;
            data.userInfo.token = loginUserInfo.token;
            data.userInfo.expiredTime = loginUserInfo.expiredTime;
            data.userInfo.referralCode = loginUserInfo.referralCode;
        }
    },

    async start(options) {
        let icd = options.query.icd;
        if (!icd) {
            data.shareReferralCode = localStorage.getShareReferralCode();
        } else {
            // 初始化别人分享过来的邀请码
            data.shareReferralCode = icd;
            localStorage.setShareReferralCode(icd);
        }
        // 查询小程序是否开启强制更新状态
        api.others
            .queryMiniappUpgradeSwitch({
                appVersionNo: config.innerVersion,
                appVersionType: 5
            })
            .then((data) => {
                if (!data.forceToUpgrade) {
                    return;
                }
                update(data.appVersion.isMust);
            });
        let route = router.getCurrentRoute();
        if (route && route.name != "entrance" && !this.isLogin()) {
            await autoLogin(true);
            if (this.isLogin()) {
                wx.showModal({
                    title: "提示",
                    content: "系统检测到您现在已经是登录，是否要重新进入?",
                    success: (res) => {
                        if (res.cancel) {
                            return;
                        }
                        if (route.isNavigationPage) {
                            router.reLaunch(route);
                        } else {
                            router.replace(route);
                        }
                    }
                });
            }
        }
        dataReport.init(options);
    },
    // 当前openAuth授权是否过期
    isExpireOpenAuth() {
        if (data.openAuth.expiredTime && data.openAuth.expiredTime > new Date().getTime()) {
            return false;
        }
        if (data.isAuthorityUser) {
            // 如果opauth已经过期，用户授权也同时会过期
            data.isAuthorityUser = false;
        }
        return true;
    },
    isLogin() {
        if (data.userInfo.expiredTime) {
            // 由于前端提前了12个小时设置过期时间，所以暂不考虑data.userInfo.expiredTime > new Date().getTime()
            return true;
        }
        return false;
    },
    getUserToken() {
        if (data.userInfo.expiredTime) {
            // 由于前端提前了12个小时设置过期时间，所以暂不考虑data.userInfo.expiredTime > new Date().getTime()
            return data.userInfo.token;
        }
        return null;
    },

    setData(ObjectValue) {
        for (let key in ObjectValue) {
            this.data[key] = data[key] = ObjectValue[key];
        }
    },

    loginConfirm(message) {
        if (!this.isLogin()) {
            wx.showModal({
                title: "提示",
                content: message || "您尚未登录，是否去登录?",
                confirmText: "确定",
                cancelText: "取消",
                success(res) {
                    if (res.confirm) {
                        router.push({ name: "login", query: { goBack: "true" } });
                    }
                }
            });
            return false;
        } else {
            return true;
        }
    },

    // 获取分享的邀请码
    getShareReferralCode() {
        let icd = "";
        if (this.isLogin()) {
            icd = this.data.userInfo.referralCode || "";
        } else {
            icd = this.data.shareReferralCode || "";
        }
        return icd;
    }
};
