/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-25
 * 描述：项目配置文件
 */

export default (function () {
    let config = {
        releaseTime: "", // 发布时间
        tokenVersion: "1.1.0", // 当前项目的token版本号，其实每次发版的时候并不会改这个版本号，它主要用于本地存储信息的判断，需要用的时候再改就行了
        isDebug: true, // 是否是前端调试状态
        innerVersion: "1.7.6", // 获得当前终端的版本号
        platform: "miniprogram", // 当前系统平台 H5,Android,IOS
        apiPlatform: "BetterHealthMinApp", // 请求接口api传入的平台code参数, H5:1,Android:2,IPhone:4,BetterHealthMinApp:更健康APP, WeightMinApp: 体重小程序
        buildVersion: null, // 编译版本号
        env: "UAT", // 当前环境
        apiDomain: "", // API接口地址
        openAuthApiDomain: "", // OpenAuth站点API地址
        passportAuthApiDomain: "", // passport站点API地址
        uploadImgServer: "", //图片上传服务
        imageDomain: "", //获取资源服务器地址
        clientId: "", // 客户端ID
        errorDefaultImg: "https://miniappsource.betterhealth.cn/health-better/default-error.png", // 724图片加载出错时的默认图片地址
        logoImg: "https://miniappsource.betterhealth.cn/health-better/logo-02.png", // 724默认logo图片
        avatarDefaultImg: "https://miniappsource.betterhealth.cn/health-better/default-avatar.png", // 默认头像图片
        device: {
            version: null, // 微信系统版本号
            systemVersion: null, //系统版本号
            SDKVersion: null, // 客户端基础库版本
            brand: null, // 手机品牌
            model: null, // 手机型号
            isAndroidDevice: false, // 是否是Android设备
            isIOSDevice: false // 是否是iOS设备
        }
    };
    // 获取环境变量配置
    let envConfig = null;
    if (config.env == "DEV") {
        envConfig = require("./DEV.js");
    } else if (config.env == "UAT") {
        envConfig = require("./UAT.js");
    } else if (config.env == "PRD") {
        envConfig = require("./PRD.js");
    }
    // 初始化环境配置
    Object.assign(config, envConfig);
    return config;
})();
