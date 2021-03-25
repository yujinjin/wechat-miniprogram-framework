/**
 * 作者：yujinjin9@126.com
 * 时间：2021-03-22
 * 描述：授权拒绝业务处理
 */
import { codeLogin } from "../services/login";

export default function () {
    let wxApp = getApp().getWxApp();
    if (!wxApp) {
        return;
    }
    if (wxApp.data.authorizationRefuseHandleState) {
        return;
    }
    wxApp.data.authorizationRefuseHandleState = true;
    wxApp.localStorage.setLoginUserInfo({});
    // debugger;
    wx.showToast({
        title: "当前账户登录信息已失效，2秒后将自动授权登录",
        icon: "none",
        duration: 2000
    });
    let isLogin = null;
    const handleFunction = function (isLogin) {
        wxApp.data.authorizationRefuseHandleState = false;
        let route = wxApp.router.getCurrentRoute();
        if (isLogin) {
            wxApp.router.reLaunch(route);
        } else {
            wxApp.router.reLaunch({
                name: "login",
                query: {
                    toName: route.name,
                    toQuery: JSON.stringify(route.query)
                }
            });
        }
    };
    let timeId = setTimeout(function () {
        if (isLogin == null) {
            return;
        }
        timeId = null;
        handleFunction(isLogin);
    }, 2000);
    codeLogin().then((data) => {
        isLogin = data;
        if (timeId == null) {
            handleFunction(isLogin);
        }
    });
}
