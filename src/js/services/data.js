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
        accessToken: null, // token信息
        refreshToken: null, // 刷新token
        tokenType: null, // token类型
        refreshTime: null, // 刷新token过期时间
        expiredTime: null, // 过期时间
        referralCode: null // 推荐码
    }, // 用户信息
    startScene: -1, // 初始化启动小程序的场景值
    showScene: -1, // 当前启动小程序的场景值
    isAuthorityUser: false, // 当前用户是否已经授权认证过信息
    shareReferralCode: null, // 当前用户别人分享过来的推荐码
    fromChannelCode: null, // 当前用户进入入口渠道code
    fromSceneCode: null, // 当前用户进入入口场景code
    authorizationRefuseHandleState: false // 当前API授权拒绝处理状态
};
