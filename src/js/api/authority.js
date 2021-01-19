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
                    url: "api/Account/ExternalLogin",
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
                    url: "api/Account/ExternalPhoneAuthorize",
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
                    url: "api/Account/AuthenticateByValidateCode",
                    method: "POST",
                    data: inputData
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
    }
};
