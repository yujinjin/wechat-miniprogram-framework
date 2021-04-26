/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-21
 * 初始化用户登录信息
 * 本地存储=>通过小程序的login自动登录或非登录
 * @param auto 当本地存储有用户信息时是否自动设置到全局wxApp的数据上
 * @returns 用户是否登录
 */
export async function autoLogin(auto = false) {
    const wxApp = getApp().getWxApp();
    if (wxApp.isLogin()) {
        const userInfo = wxApp.data.userInfo;
        if (!userInfo.referralCode || !userInfo.userId) {
            const newUserInfo = await wxApp.api.authority.queryUserInfo();
            userInfo.referralCode = newUserInfo.referralCode;
            userInfo.userId = newUserInfo.userId;
            wxApp.localStorage.setLocalStorateLoginUserInfo(userInfo);
        }
        return Promise.resolve(true);
    }
    return codeLogin();
}

/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-22
 * 通过微信code 尝试用户登录
 * @returns 用户是否登录
 */
export async function codeLogin() {
    const wxApp = getApp().getWxApp();
    if (wxApp.isExpireOpenAuth()) {
        // 如果当前用户授权加密信息过期或没有，就重新获取
        const wxLogin = new Promise((resolve) => {
            wx.login({
                success: (response) => {
                    if (response.code) {
                        resolve(response.code);
                    }
                    resolve("");
                },
                fail(response) {
                    console.info(response);
                    resolve("");
                }
            });
        });
        const code = await wxLogin;
        if (!code) {
            wx.showToast({
                title: "登录失败！",
                icon: "none"
            });
            return Promise.resolve(false);
        }
        try {
            const result = await wxApp.api.authority.authBycode({ code }, { isShowError: false });
            wxApp.data.openAuth.iv = result.iv;
            wxApp.data.openAuth.uid = result.uid;
            wxApp.data.openAuth.encryptedData = result.encryptedData;
            wxApp.data.openAuth.expiredTime = result.expiresIn * 1000 + new Date().getTime();
        } catch (error) {
            if (error && error.message) {
                wx.showToast({ title: error.message, icon: "none" });
            } else {
                wx.showToast({ title: "openauth服务错误!", icon: "none" });
            }
            throw error;
        }
    }
    const secretInfo = wxApp.data.openAuth;
    // 根据加密信息，尝试能否获取用户登录信息
    try {
        const authInfo = await wxApp.api.authority.loginByOpenAuth(
            {
                uid: secretInfo.uid,
                encryptedData: secretInfo.encryptedData,
                iv: secretInfo.iv,
                clientId: wxApp.config.clientId
            },
            { isShowError: false }
        );
        if (authInfo.accessToken) {
            await wxApp.localStorage.setLoginUserInfo(authInfo);
            return Promise.resolve(true);
        }
    } catch (error) {
        console.info(error);
    }
    return Promise.resolve(false);
}

/**
 * @param iv 微信加密算法的初始向量
 * @param encryptedData 微信加密的用户信息
 * @returns 用户是否登录
 * 描述：通过微信登录用户授权信息获取登录信息
 */
export async function authorityUserLogin({ iv, encryptedData }) {
    const wxApp = getApp().getWxApp();
    let isLogin = wxApp.isLogin();
    if (isLogin) {
        // 当前用户已经登录
        return Promise.resolve(true);
    }
    if (wxApp.isExpireOpenAuth()) {
        // openauth的授权加密信息已经过期，重新获取
        isLogin = await autoLogin();
    }
    if (isLogin) {
        // 当前用户已经登录
        return Promise.resolve(true);
    }
    try {
        // 小程序解密用户信息
        await wxApp.api.authority.authByUserInfo({ iv: iv, encryptedData: encryptedData, uid: wxApp.data.openAuth.uid }, { isShowError: false });
    } catch (error) {
        if (error && error.message) {
            wx.showToast({ title: error.message, icon: "none" });
        } else {
            wx.showToast({ title: "openauth服务错误!", icon: "none" });
        }
        throw error;
    }
    wxApp.data.isAuthorityUser = true;
    return codeLogin();
}
