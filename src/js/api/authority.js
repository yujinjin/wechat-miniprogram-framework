/**
 * 作者：yujinjin9@126.com
 * 时间：2020-01-18
 * 描述：用户微信授权API接口
 */
import request from "./request.js";
import config from "../config/index.js";

export default {
    // 根据code获取用户基础信息
    authBycode(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.openAuthApiDomain + "api/wechat/miniProg/encryptedUserInfo/" + config.clientId,
                    isResultData: false,
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 微信用户信息授权
    authByUserInfo(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.openAuthApiDomain + "api/wechat/miniProg/userInfo/" + inputData.uid,
                    isResultData: false,
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 通过OpenAuth登录
    loginByOpenAuth(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.passportAuthApiDomain + "api/account/login/partner",
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 用手机号OpenAuth注册、绑定
    phoneLoginByOpenAuth(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.passportAuthApiDomain + "api/account/register/mixed",
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 用手机号验证码登录
    validateCodeLogin(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.passportAuthApiDomain + "api/account/login/sms",
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 发送登录注册的验证码
    sendValidateCodeForLogin({ phoneNumber, scenarioKey }, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.passportAuthApiDomain + "api/account/ValidateCode",
                    method: "POST",
                    data: { phoneNumber, scenarioKey }
                },
                ajaxOptions || {}
            )
        );
    },

    // 获取编辑信息
    queryUserInfo(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.apiDomain + "api/My/UserInfo",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },
    // 刷新当前登录用户token信息
    refreshUserToken(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: config.passportAuthApiDomain + "api/account/login/refresh",
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    }
};
