/**
 * 作者：yujinjin9@126.com
 * 时间：2020-01-08
 * 描述：小程序 App data
 */
export default {
    openAuth: {
        uid: null, // 临时票据
        encryptedData: null,
        iv: null,
        expiredTime: null // 过期时间
    }, // openAuth授权信息
    openId: null, // 当前用户openId
    userInfo: {
        userId: null, // 用户ID信息
        token: null, // token信息
        expiredTime: null, // 过期时间
        referralCode: null // 推荐码
    }, // 用户信息
    isAuthorityUser: false, // 当前用户是否已经授权认证过信息
    shareReferralCode: null // 当前用户别人分享过来的推荐码
};
