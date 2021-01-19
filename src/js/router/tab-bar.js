/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-14
 * 描述：小程序用户模块路由列表
 */
export default [
    {
        path: "/pages/entrance/index",
        name: "entrance",
        title: "入口页",
        authType: 0
    },
    {
        path: "/pages/tab-bar/home/index",
        isNavigationPage: true,
        name: "home",
        title: "首页",
        authType: 0,
        app: {
            tabBar: {
                text: "首页",
                iconPath: "imgs/tab-bar/home-icon.png",
                selectedIconPath: "imgs/tab-bar/home-active-icon.png"
            }
        }
    },
    {
        path: "/pages/tab-bar/user/index",
        isNavigationPage: true,
        name: "user",
        title: "用户中心",
        authType: 0,
        app: {
            tabBar: {
                text: "我的",
                iconPath: "imgs/tab-bar/my-icon.png",
                selectedIconPath: "imgs/tab-bar/my-active-icon.png"
            }
        }
    }
];
