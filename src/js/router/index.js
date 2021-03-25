/**
 * 作者：yujinjin9@126.com
 * 时间：2019-12-11
 * 描述：小程序路由
 */
import routers from "./routers";

let wxApp = null;

export default {
    // 路由跳转
    push({ name, query, isShowLoginTips = false, replace = false, closeAll = false }) {
        if (query && query.icd) {
            console.info(`页面邀请码：${query.icd}`);
        }
        if (!wxApp && getApp()) {
            wxApp = getApp().getWxApp();
        }
        return new Promise((resolve, reject) => {
            let route = routers.find((item) => item.name == name);
            if (!route) {
                reject("没有该路由信息");
                return;
            }
            if (route.authType == 2 && !wxApp.isLogin()) {
                reject("用户未登录!");
                // 当前用户未登录，跳转到登录注册页
                if (isShowLoginTips) {
                    wx.showModal({
                        title: "提示",
                        content: "您尚未登录，是否去登录?",
                        success: (res) => {
                            if (res.confirm) {
                                this.push({ name: "login", query: { toName: name, toQuery: query ? JSON.stringify(query) : null }, replace });
                            }
                        }
                    });
                } else {
                    this.push({ name: "login", query: { toName: name, toQuery: query ? JSON.stringify(query) : null }, replace });
                }
                return;
            }
            let path = route.path;
            if (query) {
                let params = "";
                for (let key in query) {
                    if (query[key] != null) {
                        params += key + "=" + (query[key] + "&");
                    }
                }
                if (params) {
                    path += "?" + params.substring(0, params.length - 1);
                }
            }
            if (closeAll || (route.isNavigationPage && query && JSON.stringify(query) != "{}")) {
                // 当前页面是reLaunch跳转或者导航页带参数跳转
                wx.reLaunch({
                    url: path,
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (res) {
                        reject(res);
                    }
                });
            } else if (route.isNavigationPage) {
                // 当前页面是导航页
                wx.switchTab({
                    url: route.path,
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (res) {
                        reject(res);
                    }
                });
            } else if (replace) {
                wx.redirectTo({
                    url: path,
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (res) {
                        reject(res);
                    }
                });
            } else {
                wx.navigateTo({
                    url: path,
                    success: function (res) {
                        resolve(res);
                    },
                    fail: function (res) {
                        reject(res);
                    }
                });
            }
        });
    },

    // 路由replace
    replace({ name, query, isShowLoginTips = false }) {
        return this.push({ name, query, isShowLoginTips, replace: true });
    },

    // 路由back
    back(number) {
        return new Promise((resolve, reject) => {
            wx.navigateBack({
                delta: number,
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                    reject(res);
                }
            });
        });
    },

    // 关闭所有页面，打开到应用内的某个页面
    reLaunch({ name, query, isShowLoginTips = false }) {
        return this.push({ name, query, isShowLoginTips, closeAll: true });
    },

    // 通过URL获取的路由
    getRouteByUrl(url) {
        if (!url.startsWith("/")) {
            url = "/" + url;
        }
        let query = {};
        let subfix = "";
        if (url.indexOf("?") != -1) {
            subfix = url.substr(url.indexOf("?") + 1);
            url = url.substring(0, url.indexOf("?"));
        }
        if (subfix) {
            let arg = subfix.split("&");
            arg.forEach((item) => {
                if (item) {
                    query[item.split("=")[0]] = item.split("=")[1];
                }
            });
        }
        let route = routers.find((item) => {
            return item.path == url;
        });
        if (route) {
            if (JSON.stringify(query) === "{}") {
                return Object.assign({}, route);
            } else {
                return Object.assign({ query }, route);
            }
        } else {
            return null;
        }
    },

    // 获取当前页面的路由
    getCurrentRoute() {
        // 获取所有页面列表
        let pages = getCurrentPages();
        if (pages.length == 0) {
            return null;
        }
        let currentPage = pages[pages.length - 1];
        if (!currentPage) {
            return null;
        }
        let route = this.getRouteByUrl(currentPage.route);
        if (!route) {
            // throw new Error("健康小程序：未获取到" + currentPage.route + "的路由对象");
            console.error("健康小程序：未获取到" + currentPage.route + "的路由对象");
            return currentPage;
        }
        route.query = currentPage.options;
        return route;
    }
};
