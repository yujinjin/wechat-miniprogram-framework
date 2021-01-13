/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-09
 * 描述：数据上报
 */

export default (function () {
    const conroller = {
        data: {
            inputForm: {
                sessionId: null, // 当前小程序会话ID
                openId: null,
                icd: null,
                deviceId: null,
                applicationName: "miniprogram",
                pageSessionId: null,
                previousPageSessionId: null,
                pageName: null,
                urlParameters: null
            },
            pageReportDataList: [], // 待上报的数据队列，{ eventType, eventValue, time }
            startParameters: "", // 启动参数
            waitingQueue: 0, // 当前数据上报是否需要等待
            isStart: false, // 是否已经开始
            dataReportAPIFun: null // 数据
        },
        push(pageReportDataList) {
            if (!conroller.data.isStart || conroller.data.waitingQueue > 0 || pageReportDataList.length == 0) {
                // 还未开始或有正在加载的队列数据，不能加载数据
                return;
            }
            for (let i = 0; i < pageReportDataList.length; i++) {
                pageReportDataList[i] = Object.assign({}, conroller.data.inputForm, pageReportDataList[i]);
            }
            // 上报数据
            conroller.data.dataReportAPIFun(pageReportDataList);
        }
    };

    return {
        // 初始化
        init(options) {
            conroller.data.startParameters = JSON.stringify(options);
        },
        async start(options) {
            let pageReportDataList = [];
            const dynamicParameters = {
                time: new Date().getTime(),
                eventType: "onStart",
                eventValue: "start",
                urlParameters: JSON.stringify(Object.assign({}, JSON.parse(conroller.data.startParameters), options)),
                pageSessionId: null,
                previousPageSessionId: null,
                pageName: null
            };
            if (!conroller.data.isStart) {
                let wxApp = getApp().getWxApp();
                conroller.data.inputForm.sessionId = wxApp.utils.generateGuid();
                let deviceId = wxApp.localStorage.getDeviceId();
                if (!deviceId) {
                    deviceId = wxApp.utils.generateGuid();
                    wxApp.localStorage.setDeviceId(deviceId);
                }
                conroller.data.inputForm.deviceId = deviceId;
                conroller.data.inputForm.icd = wxApp.data.shareReferralCode || null;
                conroller.data.isStart = true;
                conroller.data.dataReportAPIFun = wxApp.api.others.addUserActionDataReport;
                // 判断用户如果未登录，获取openid
                if (!wxApp.isLogin()) {
                    ++conroller.data.waitingQueue;
                    try {
                        // 获取openid
                        // 如果当前用户授权加密信息过期或没有，就重新获取
                        const wxLogin = new Promise((resolve) => {
                            wx.login({
                                success: (response) => {
                                    if (response.code) {
                                        resolve(response.code);
                                    }
                                    resolve("");
                                },
                                fail(response) {
                                    console.info(response);
                                    resolve("");
                                }
                            });
                        });
                        const code = await wxLogin;
                        if (code) {
                            const { oid } = await wxApp.api.others.getOpenidByCode(code);
                            conroller.data.inputForm.openId = oid;
                        }
                    } catch (error) {
                        console.info(error);
                    }
                    --conroller.data.waitingQueue;
                }
                // 上报数据
                pageReportDataList = conroller.data.pageReportDataList;
                if (conroller.data.waitingQueue == 0) {
                    conroller.data.pageReportDataList = [];
                }
            }
            pageReportDataList.push(dynamicParameters);
            conroller.push(pageReportDataList);
        },
        pageShow() {
            let pages = getCurrentPages();
            if (pages.length == 0) {
                return;
            }
            let currentPage = pages[pages.length - 1];
            conroller.data.inputForm.previousPageSessionId = conroller.data.inputForm.pageSessionId || null;
            conroller.data.inputForm.pageSessionId = currentPage["__wxExparserNodeId__"];
            conroller.data.inputForm.pageName = currentPage.route;
            conroller.data.inputForm.urlParameters = JSON.stringify(currentPage.options);
            conroller.push([
                {
                    time: new Date().getTime(),
                    eventType: "onShow",
                    eventValue: "pageShow"
                }
            ]);
        },
        pageHide() {
            conroller.push([
                {
                    time: new Date().getTime(),
                    eventType: "onHide",
                    eventValue: "pageHide"
                }
            ]);
        },
        pageUnload() {
            conroller.push([
                {
                    time: new Date().getTime(),
                    eventType: "onUnload",
                    eventValue: "pageUnload"
                }
            ]);
        },
        eventReport({ eventType = "onClick", eventValue, ...eventParameters } = {}) {
            conroller.push([
                {
                    time: new Date().getTime(),
                    eventType,
                    eventValue,
                    eventParameters: eventParameters && JSON.stringify(eventParameters) != "{}" ? JSON.stringify(eventParameters) : undefined
                }
            ]);
        }
    };
})();
