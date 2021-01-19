import request from "./request.js";
import config from "@js/config/index.js";
export default {
    // 查询小程序强制升级的开关
    queryMiniappUpgradeSwitch(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: "api/AppVersion/Latest",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },
    // 查询内容
    queryContent(code, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: "api/pageContent/" + code
                },
                ajaxOptions || {}
            )
        );
    },
    // 添加用户行为数据报告
    addUserActionDataReport(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: "api/app/report",
                    method: "POST",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    // 根据登录code获取当前用户的openid
    getOpenidByCode(code, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: "api/Account/OSIds/" + config.clientId + "/" + code
                },
                ajaxOptions || {}
            )
        );
    }
};
