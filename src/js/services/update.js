/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-07
 * 描述：小程序版本更新
 */
export default function (forceToUpgrade = false) {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (!wx.canIUse("getUpdateManager")) {
        //此时微信版本太低（一般而言版本都是支持的）
        if (forceToUpgrade) {
            wx.showToast({
                title: "当前微信版本过低，可能无法使用最新小程序功能!",
                icon: "none"
            });
        }
        return;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((result) => {
        if (!result.hasUpdate) {
            return;
        }
        // 监听小程序有版本更新事件
        updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            if (forceToUpgrade) {
                updateManager.applyUpdate();
                return;
            }
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate();
                    }
                }
            });
        });
        // 新版本下载失败
        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            if (forceToUpgrade) {
                wx.showModal({
                    title: "已经有新版本喽~",
                    content: "请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~",
                    showCancel: false
                });
            }
        });
    });
}
