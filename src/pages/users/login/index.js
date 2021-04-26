/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-28
 * 登录页
 */
import pageFactory from "@js/page-factory/index";
import { codeLogin, authorityUserLogin } from "@js/services/login";

pageFactory({
    data: {
        isNeedAuthorization: false, // 是否需要用户授权
        isNeedLogin: false, // 是否需要登录
        isAllowSubmit: false, // 是否允许提交登陆
        isSumbiting: false, // 是否正在提交中
        isHasInviteCode: false, // 当前用户是否有邀请码
        phoneNumber: "", // 手机号
        validateCode: "", // 验证码
        agreementChecked: false, // 同意协议
        countDownTimerId: -1, // 定时器ID
        countDownSecond: -1, // 倒计时（秒）
        toRoute: {}, // 跳转的路由
        goBack: "", // 跳转转化后的路由
        inviteCode: "", // 邀请码或手机号
        canIUseGetUserProfile: !!wx.getUserProfile // 是否可以使用获取头像昵称API
    },
    onLoad: function (options) {
        // 初始化登录成功后需要跳转的路由
        if (options.goBack) {
            this.data.goBack = options.goBack == "true" ? -1 : parseInt(options.goBack);
        } else if (options.toName) {
            this.data.toRoute = { name: options.toName, query: options.toQuery ? JSON.parse(options.toQuery) : undefined };
        } else {
            this.data.toRoute = { name: "home" };
        }
        if (this.wxApp.data.shareReferralCode) {
            this.setData({
                inviteCode: this.wxApp.data.shareReferralCode,
                isHasInviteCode: true
            });
        }
        this.init();
    },
    /**
     * 初始化
     * @returns 当前用户是否已经登录
     */
    async init() {
        if (!this.wxApp.isLogin()) {
            await codeLogin();
        }
        if (this.wxApp.isLogin()) {
            wx.showToast({ title: "当前用户已经登录", icon: "none" });
            this.go();
            return true;
        }
        this.setData({
            isNeedAuthorization: !this.wxApp.data.isAuthorityUser
        });
        if (this.wxApp.data.isAuthorityUser) {
            this.setData({
                isNeedLogin: true
            });
        }
        return false;
    },
    bindinput(event) {
        let pos = event.detail.cursor;
        if (pos !== -1) {
            // 光标在中间
            const left = event.detail.value.slice(0, pos);
            if (event.target.dataset.type === "number") {
                // 计算光标的位置
                pos = left.replace(/[^\d]/g, "").length;
            }
        }
        let value = event.detail.value;
        if (event.target.dataset.type === "number") {
            value = event.detail.value.replace(/[^\d]/g, "");
        }
        this.setData({
            [event.target.dataset.key]: value
        });
        this.setData({
            isAllowSubmit: this.validate(false)
        });
        return { value, cursor: pos };
    },
    agreementCheckboxChange(e) {
        this.setData({ agreementChecked: e.detail.value.length === 1 });
        this.setData({
            isAllowSubmit: this.validate(false)
        });
    },
    validate(isShowToast) {
        let message = null;
        if (!this.data.phoneNumber) {
            message = "请输入手机号";
        } else if (!this.wxApp.utils.validateMobile(this.data.phoneNumber)) {
            message = "请输入正确格式\r\n的手机号";
        } else if (!this.data.validateCode) {
            message = "请输入验证码";
        } else if (this.data.validateCode.length !== 4 && this.data.validateCode.length !== 6) {
            message = "请输入正确格式\r\n的验证码";
        } else if (!this.data.agreementChecked) {
            message = "您是否已经阅读\r\n并同意我们的\r\n用户协议!";
        } else if (this.data.isSumbiting) {
            message = "数据正在提交，\r\n请稍后!";
        }
        if (isShowToast && message) {
            wx.showToast({ title: message, icon: "none" });
        }
        return !message;
    },
    // 发送手机验证码
    sendValidateCode(e) {
        if (!this.data.phoneNumber) {
            wx.showToast({ title: "请输入手机号!", icon: "none" });
            return;
        } else if (!this.wxApp.utils.validateMobile(this.data.phoneNumber)) {
            wx.showToast({ title: "请输入正确格式\r\n的手机号!", icon: "none" });
            return;
        } else if (this.data.countDownSecond > 0) {
            wx.showToast({ title: "请稍后，验证码\r\n正在发送中!", icon: "none" });
            return;
        }
        this.data.countDownSecond = 60;
        const sendType = e.currentTarget.dataset.sendType;
        return this.wxApp.api.common
            .sendValidateCode({ scenarioKey: "reg", sendType, phoneNumber: this.data.phoneNumber })
            .then(() => {
                if (sendType == 1) {
                    wx.showModal({ content: "我们将以电话的\r\n方式告知您验证码\r\n请注意接听", title: "语音验证码", showCancel: false });
                } else {
                    wx.showToast({ title: "发送成功", icon: "none" });
                }
                this.validateCodeCountDown();
            })
            .catch(() => {
                this.data.countDownSecond = 0;
            });
    },
    // 授权用户
    async authUser(e) {
        if (!e.detail.encryptedData) {
            return;
        }
        if (this.data.isSumbiting) {
            wx.showToast({ title: "数据正在提交，\r\n请稍后!", icon: "none" });
            return;
        }
        this.setData({ isSumbiting: true });
        try {
            const result = await authorityUserLogin({ encryptedData: e.detail.encryptedData, iv: e.detail.iv });
            this.setData({ isSumbiting: false });
            if (result) {
                this.go();
            } else {
                this.setData({
                    isNeedLogin: true,
                    isNeedAuthorization: false
                });
            }
        } catch (error) {
            this.setData({ isSumbiting: false });
        }
    },
    // 获取当前用户头像信息
    async getUserProfileTap() {
        if (this.data.isSumbiting) {
            wx.showToast({ title: "数据正在提交，请稍后!", icon: "none" });
            return;
        }
        try {
            const result = await wx.getUserProfile({
                desc: "用于完善会员资料" // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            });
            this.authUser({ detail: { encryptedData: result.encryptedData, iv: result.iv } });
        } catch (error) {
            console.info(error);
        }
    },
    // 授权手机号
    async authPhoneNumber(e) {
        if (!e.detail.encryptedData) {
            return;
        }
        if (this.data.isSumbiting) {
            wx.showToast({ title: "数据正在提交，\r\n请稍后!", icon: "none" });
            return;
        }
        if (this.wxApp.isExpireOpenAuth()) {
            wx.showModal({
                title: "提示",
                content: "当前页面停留过长授权信息已经过期，是否重新操作？",
                success: (res) => {
                    if (res.confirm) {
                        // wx.redirectTo({url: "/pages/index/index"});
                        this.init();
                    }
                }
            });
            return;
        }
        this.setData({ isSumbiting: true });
        try {
            const result = await this.wxApp.api.authority.phoneLoginByOpenAuth({
                clientId: this.wxApp.config.clientId,
                weChatEncryptedData: e.detail.encryptedData,
                weChatIv: e.detail.iv,
                uid: this.wxApp.data.openAuth.uid,
                encryptedData: this.wxApp.data.openAuth.encryptedData,
                iv: this.wxApp.data.openAuth.iv,
                referralCode: this.data.inviteCode,
                channelCode: this.wxApp.data.fromChannelCode + "|" + (this.wxApp.data.fromSceneCode || "default")
            });
            this.setData({ isSumbiting: false });
            await this.wxApp.localStorage.setLoginUserInfo(result);
            this.go();
        } catch (error) {
            this.setData({ isSumbiting: false });
        }
    },
    // 发送验证码倒计时函数
    validateCodeCountDown() {
        this.setData({
            countDownTimerId: setInterval(() => {
                if (this.data.countDownSecond <= 0) {
                    clearInterval(this.data.countDownTimerId);
                    this.setData({ countDownTimerId: -1 });
                    return;
                }
                this.setData({ countDownSecond: this.data.countDownSecond - 1 });
            }, 1000)
        });
    },
    async submit() {
        if (!this.validate(true)) {
            return;
        }
        if (this.wxApp.isExpireOpenAuth()) {
            wx.showModal({
                title: "提示",
                content: "当前页面停留过长授权信息已经过期，是否重新操作？",
                success: (res) => {
                    if (res.confirm) {
                        // wx.redirectTo({url: "/pages/index/index"});
                        this.init();
                    }
                }
            });
            return;
        }
        this.setData({ isSumbiting: true });
        try {
            const result = await this.wxApp.api.authority.phoneLoginByOpenAuth({
                clientId: this.wxApp.config.clientId,
                phoneNumber: this.data.phoneNumber,
                validateCode: this.data.validateCode,
                uid: this.wxApp.data.openAuth.uid,
                encryptedData: this.wxApp.data.openAuth.encryptedData,
                iv: this.wxApp.data.openAuth.iv,
                referralCode: this.data.inviteCode,
                channelCode: this.wxApp.data.fromChannelCode + "|" + (this.wxApp.data.fromSceneCode || "default")
            });
            this.setData({ isSumbiting: false });
            await this.wxApp.localStorage.setLoginUserInfo(result);
            this.go();
        } catch (error) {
            this.setData({ isSumbiting: false });
        }
    },
    go() {
        if (typeof this.data.goBack == "number") {
            this.wxApp.router.back(this.data.goBack, 10 || -1);
        } else {
            this.wxApp.router.replace({ name: this.data.toRoute.name, query: this.data.toRoute.query });
        }
    },
    gotoAgreementsPage(e) {
        this.wxApp.router.push({ name: e.currentTarget.dataset.type });
    },
    onUnload() {
        if (this.data.countDownTimerId) {
            // 倒计时
            clearInterval(this.data.countDownTimerId);
        }
    }
});
