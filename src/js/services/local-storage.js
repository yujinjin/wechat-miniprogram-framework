/**
 * 作者：yujinjin9@126.com
 * 时间：2020-5-21
 * 描述：站点本地存储信息
 */
import config from "@js/config/index.js";

export default (function () {
    let wxStorage = {
        setStorage(key, value) {
            return new Promise((resolve, reject) => {
                wx.setStorage({
                    key,
                    data: value,
                    success() {
                        resolve(true);
                    },
                    fail() {
                        reject(false);
                    }
                });
            });
        },
        removeStorage(key) {
            return new Promise((resolve, reject) => {
                wx.removeStorage({
                    key,
                    success() {
                        resolve(true);
                    },
                    fail() {
                        reject(false);
                    }
                });
            });
        },

        // 本地存储的key值(轻易不要改值，会影响线上业务)
        LOCAL_STORAGE_KEY: {
            // 整个站点的存储对象
            SITE: "siteLocalStorage_" + config.env,
            // 本地登录用户存储的信息
            LOGIN_USER_INFO: "loginUserInfo",
            // 别人分享的邀请码
            SHARE_REFERRAL_CODE: "shareReferralCode",
            DEVICE_ID: "deviceId"
        }
    };

    let localStorage = {
        //获取站点本地存储信息,同步
        getSiteLocalStorage: function (key) {
            var _site_local_storage = wx.getStorageSync(wxStorage.LOCAL_STORAGE_KEY.SITE);
            if (_site_local_storage) {
                try {
                    _site_local_storage = JSON.parse(_site_local_storage);
                } catch (e) {
                    console.error(e);
                }
            }
            if (_site_local_storage == null || typeof _site_local_storage != "object") {
                _site_local_storage = {};
            }
            if (key !== null && typeof key != "undefined") {
                return _site_local_storage[key];
            } else {
                return _site_local_storage;
            }
        },

        //设置站点本地存储信息（异步）
        setSiteLocalStorage(key, value) {
            let _site_local_storage = localStorage.getSiteLocalStorage();
            if (value !== null && typeof value != "undefined") {
                _site_local_storage[key] = value;
            } else if (key in _site_local_storage || _site_local_storage.hasOwnProperty(key)) {
                delete _site_local_storage[key];
            }
            return wxStorage.setStorage(wxStorage.LOCAL_STORAGE_KEY.SITE, JSON.stringify(_site_local_storage));
        },

        // 设置登录用户信息，会顺便设置全局用户信息
        async setLoginUserInfo({ token, expiredTime = -1, referralCode = null, userId = null } = {}) {
            let _login_user_info = localStorage.getSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
            let wxApp = null;
            if (getApp()) {
                // 会存在一种情况，app刚刚开始初始化时getApp()返回的undefined,所以还是判断wxApp的
                wxApp = getApp().getWxApp();
            }
            if (expiredTime > 0) {
                if (_login_user_info == null || typeof _login_user_info != "object") {
                    _login_user_info = {};
                }
                // 提前12个小时
                expiredTime = new Date().getTime() + (expiredTime - 60 * 60 * 12) * 1000;
                if (wxApp) {
                    wxApp.setData({
                        userInfo: {
                            userId,
                            token,
                            expiredTime,
                            referralCode
                        }
                    });
                    if (!referralCode || !userId) {
                        const userInfo = await wxApp.api.authority.queryUserInfo();
                        referralCode = userInfo.referralCode;
                        userId = userInfo.userId;
                        wxApp.setData({
                            userInfo: {
                                userId,
                                token,
                                expiredTime,
                                referralCode
                            }
                        });
                    }
                    wxApp.events.trigger("loginChange");
                }
                localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO, {
                    userId,
                    token,
                    expiredTime,
                    referralCode,
                    version: config.tokenVersion
                });
            } else if (_login_user_info) {
                localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
                if (wxApp && wxApp.isLogin()) {
                    wxApp.setData({
                        userInfo: {
                            userId: null,
                            token: null,
                            expiredTime: null,
                            referralCode: null
                        }
                    });
                    wxApp.events.trigger("loginChange");
                }
            }
        },

        // 获取登录用户信息
        getLoginUserInfo() {
            let _login_user_info = localStorage.getSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
            if (!_login_user_info) {
                return {};
            }
            let _current_time = new Date().getTime();
            if (_login_user_info.expiredTime && _login_user_info.expiredTime > _current_time) {
                return _login_user_info;
            } else {
                localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO);
                if (getApp()) {
                    // 会存在一种情况，app刚刚开始初始化时getApp()返回的undefined,所以还是判断wxApp的
                    let wxApp = getApp().getWxApp();
                    if (wxApp.isLogin()) {
                        // 如果内存用户信息是登录状态，就去注销用户登录信息
                        wxApp.setData({
                            userInfo: {
                                userId: null,
                                token: null,
                                expiredTime: null,
                                referralCode: null
                            }
                        });
                    }
                }
            }
            return {};
        },

        // 直接设置本地登录用户信息
        setLocalStorateLoginUserInfo(loginUserInfo) {
            if (loginUserInfo && loginUserInfo.token) {
                loginUserInfo = Object.assign({ version: config.tokenVersion }, loginUserInfo);
            }
            return localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.LOGIN_USER_INFO, loginUserInfo);
        },

        // 设置别人分享过来的邀请码
        setShareReferralCode(code) {
            console.info(`存储邀请码：${code}`);
            return localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.SHARE_REFERRAL_CODE, code);
        },

        // 设置别人分享过来的邀请码
        getShareReferralCode() {
            return localStorage.getSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.SHARE_REFERRAL_CODE) || "";
        },
        // 设置设备ID
        setDeviceId(deviceId) {
            localStorage.setSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.DEVICE_ID, deviceId);
        },
        getDeviceId() {
            return localStorage.getSiteLocalStorage(wxStorage.LOCAL_STORAGE_KEY.DEVICE_ID) || "";
        }
    };
    return localStorage;
})();
