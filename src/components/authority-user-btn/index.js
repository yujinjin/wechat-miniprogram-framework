import { authorityUserLogin } from "@js/services/login";

/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-16
 * 描述：微信用户信息授权按钮
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
    lifetimes: {
        ready: function () {
            this.setData({ isLogin: wxApp.isLogin() });
        }
    },
    methods: {
        async authUserTap(e) {
            if (this.data.isSumbiting) {
                // 当前正在加载
                return;
            } else if (!e.detail.encryptedData) {
                // 拒绝授权
                return;
            }
            this.data.isSumbiting = true;
            let isLogin = false;
            if (wxApp.isLogin()) {
                isLogin = true;
            } else {
                try {
                    isLogin = await authorityUserLogin({ encryptedData: e.detail.encryptedData, iv: e.detail.iv });
                } catch (error) {
                    console.info(error);
                }
                this.data.isSumbiting = false;
            }
            this.setData({ isLogin });

            this.triggerEvent("login", { isLogin });
        }
    }
});
