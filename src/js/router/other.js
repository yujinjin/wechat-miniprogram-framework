/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-14
 * 描述：小程序其他模块路由列表
 */
export default [
    {
        path: "/pages/others/help/index",
        name: "help",
        title: "帮助",
        authType: 0,
        app: {
            packageName: "subpackages-others"
        }
    },
    {
        path: "/pages/others/contents/index",
        name: "contents",
        title: "内容页",
        authType: 0,
        app: {
            packageName: "subpackages-others"
        }
    },
    {
        path: "/pages/others/web-view/index",
        name: "web-view",
        title: "web页面展示",
        authType: 0,
        app: {
            packageName: "subpackages-others"
        }
    }
];
