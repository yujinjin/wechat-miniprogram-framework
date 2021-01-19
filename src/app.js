/**
 * 作者：yujinjin9@126.com
 * 时间：2021-01-19
 * 描述：小程序 App
 */
import wxApp from "./js/wx-app";
App({
    globalData: {},

    // 有时wxAPP内部引用的对象会设置数据，防止循环引用
    getWxApp() {
        return wxApp;
    },

    /**
     * 小程序初始化完成时（全局只触发一次）
     * 生命周期回调—监听小程序初始化
     */
    onLaunch(options) {
        wxApp.init(options);
    },

    /**
     * 小程序启动，或从后台进入前台显示时
     * 生命周期回调—监听小程序显示
     */
    onShow(options) {
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            wxApp.start(options);
        }
    },

    /**
     * 小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
     * 错误监听函数
     */
    onError(msg) {
        console.info(msg);
    }
});
