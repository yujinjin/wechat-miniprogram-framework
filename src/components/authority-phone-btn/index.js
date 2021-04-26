/**
 * 作者：yujinjin9@126.com
 * 时间：2020-11-10
 * 描述：微信手机号信息授权按钮
 */
const wxApp = getApp().getWxApp();
Component({
    options: {
        // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
        styleIsolation: "apply-shared"
    },
    data: {
        isLogin: false,
        isSumbiting: false
    },
    properties: {
        channelCode: {
            type: String
        }
    },
    lifetimes: {
        ready: function () {
            this.setData({ isLogin: wxApp.isLogin() });
        }
    },
    methods: {
        // 授权手机号
        async authPhoneNumber(e) {
            if (!e.detail.encryptedData) {
                this.triggerEvent("authority", { result: "refuse" });
                return;
            }
            if (this.data.isSumbiting) {
                wx.showToast({ title: "数据正在提交，\r\n请稍后!", icon: "none" });
                return;
            }
            if (wxApp.isExpireOpenAuth()) {
                wx.showToast({ title: "当前页面停留过长,授权信息已经过期，\r\n请重新操作!", icon: "none" });
                this.triggerEvent("authority", { result: "expire" });
                return;
            }
            this.setData({ isSumbiting: true });
            try {
                const result = await wxApp.api.authority.phoneLoginByOpenAuth({
                    clientId: wxApp.config.clientId,
                    weChatEncryptedData: e.detail.encryptedData,
                    weChatIv: e.detail.iv,
                    uid: wxApp.data.openAuth.uid,
                    encryptedData: wxApp.data.openAuth.encryptedData,
                    iv: wxApp.data.openAuth.iv,
                    referralCode: wxApp.data.shareReferralCode,
                    channelCode: wxApp.data.fromChannelCode + "|" + (wxApp.data.fromSceneCode || this.data.channelCode)
                });
                this.setData({ isSumbiting: false });
                await wxApp.localStorage.setLoginUserInfo(result);
                this.triggerEvent("authority", { result: "success" });
            } catch (error) {
                this.setData({ isSumbiting: false });
                this.triggerEvent("authority", { result: "error" });
            }
        }
    }
});
