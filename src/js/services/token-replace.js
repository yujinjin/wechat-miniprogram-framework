/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-14
 * 描述：老的token替换
 */
export default function () {
    const wxApp = getApp().getWxApp();
    let loginUserInfo = wxApp.localStorage.getLoginUserInfo();
    if (!loginUserInfo || !loginUserInfo.token) {
        // 当前用户没有本地登录信息，或者是APP环境
        return Promise.resolve(false);
    }
    // 缺位前面补0函数
    let prefixZero = function (num, n) {
        return (Array(n).join(0) + num).slice(-n);
    };
    let version = loginUserInfo.version;
    if (version) {
        let transformVersions = version.split(".");
        let transformVersion = parseInt(prefixZero(transformVersions[0], 3) + prefixZero(transformVersions[1], 3) + prefixZero(transformVersions[2], 3), 10);
        if (transformVersion >= 1000001) {
            if (wxApp.config.tokenVersion != version) {
                // token需要升级重新登录
                wxApp.localStorage.setLoginUserInfo({});
                return Promise.resolve(false);
            } else {
                // 新版本token,不用替换
                return Promise.resolve(true);
            }
        }
    } else if (loginUserInfo.token.split(".").length == 3) {
        // 后台API已经先上线，导致新登录的用户已经是新token无需再次替换
        loginUserInfo.version = wxApp.config.tokenVersion;
        return wxApp.localStorage.setLocalStorateLoginUserInfo(loginUserInfo).then(() => true);
    }
    // 老版本，需要替换
    if (loginUserInfo.token.startsWith("Bearer ")) {
        loginUserInfo.token = loginUserInfo.token.substr("Bearer ".length);
    }
    // 老版本，需要替换
    return wxApp.api.common
        .exchangeTokenApi({ token: loginUserInfo.token })
        .then((data) => {
            wxApp.localStorage.setLoginUserInfo({
                referralCode: loginUserInfo.referralCode,
                token: data.authToken,
                expiredTime: data.expiredIn,
                userId: loginUserInfo.userId
            });
            return true;
        })
        .catch((error) => {
            wxApp.localStorage.setLoginUserInfo({});
            return error;
        });
}
