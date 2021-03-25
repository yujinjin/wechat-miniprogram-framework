/**
 * 作者：yujinjin9@126.com
 * 时间：2021-03-17
 * 描述：本地token升级，如果当前token版本过低删除本地token，并返回true
 */
export default function () {
    const wxApp = getApp().getWxApp();
    let loginUserInfo = wxApp.localStorage.getLoginUserInfo();
    if (!loginUserInfo || !loginUserInfo.accessToken) {
        // 当前用户没有本地登录信息
        return false;
    }
    let version = loginUserInfo.version;
    if (!wxApp.config.tokenVersion || version == wxApp.config.tokenVersion) {
        return true;
    }
    if (!version) {
        wxApp.localStorage.setLoginUserInfo({});
        return false;
    }
    // 缺位前面补0函数
    let prefixZero = function (num, n) {
        return (Array(n).join(0) + num).slice(-n);
    };
    let transformVersions = version.split(".");
    let transformVersion = parseInt(prefixZero(transformVersions[0], 3) + prefixZero(transformVersions[1], 3) + prefixZero(transformVersions[2], 3), 10);
    let configTokenVersions = wxApp.config.tokenVersion.split(".");
    let configTokenVersion = parseInt(prefixZero(configTokenVersions[0], 3) + prefixZero(configTokenVersions[1], 3) + prefixZero(configTokenVersions[2], 3), 10);
    if (transformVersion > configTokenVersion) {
        return true;
    }
    wxApp.localStorage.setLoginUserInfo({});
    return false;
}
