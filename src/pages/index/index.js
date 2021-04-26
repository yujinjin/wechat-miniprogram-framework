/**
 * 作者：yujinjin9@126.com
 * 时间：2020-05-25
 * 站点首页
 */
import pageFactory from "@js/page-factory/index";
import tokenReplace from "../../js/services/token-replace";
import { autoLogin } from "@js/services/login";

pageFactory({
    data: {
        minWaitingMillisecond: 1 * 1000, //至少等待多时毫秒才跳转页面
        onLoadTime: null, // 当前加载时间
        noReport: true
    },
    /**
     * 首页页面路由解析格式
     * {
     *  toName：跳转的页面
     *  toQuery：跳转的页面相关的参数，JSON格式(JSON.stringify({a: 1,b: 1}))
     *  icd: 别人分享过来的推荐码
     * }
     *
     */
    async onLoad(options) {
        this.data.onLoadTime = new Date().getTime();
        // 路由页面名称
        let pageName = "";
        // 路由参数
        let query = null;
        // 分享过来的推荐码
        let icd = null;
        // 扫描、长按识别【小程序】二维码
        if (options.scene) {
            //扫描二维码入口进入(约定scene的格式为 toName=1&icd=2&[name]=3, 其中 toName 固定的表示 pagename,icd 固定的表示推荐码，其余参数名可自定义)
            let sceneQuery = this.wxApp.utils.generateQueryByUrl(options.scene);
            if (sceneQuery.queryId) {
                // 如果参数太多小程序存不下，通过接口获取到更多的参数
                let queryData = await this.wxApp.api.common.getValueById({ id: sceneQuery.queryId });
                delete sceneQuery.queryId;
                if (queryData) {
                    queryData = JSON.parse(queryData);
                }
                Object.assign(sceneQuery, queryData);
            }
            pageName = sceneQuery.toName;
            icd = sceneQuery.icd;
            delete sceneQuery["toName"];
            // 不要删除掉推荐码，在其他页面会用到
            // delete sceneQuery["icd"];
            query = sceneQuery;
            if (query.toQuery) {
                // 兼容一下APP里已经带有toQuery的方式
                Object.assign(query, query.toQuery);
                delete query.toQuery;
            }
        }
        // 扫描、长按识别【普通】二维码（此代码在商城入口中亦有判断） https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=1461628288&lang=zh_CN
        else if (options.q && options.scancode_time) {
            /*
                在后台管理定义的规则：
                二维码地址	                                      小程序路径	               测试范围	     全网发布
                https://wx.betterhealth.cn/miniapp/	            pages/index/index	         线上版	      已发布	
        
                https://wx.betterhealth.cn/miniapp/mall-pkg/	mall-pkg/pages/entry/index	 线上版	      已发布	
            */
            try {
                const willParseUrl = decodeURIComponent(options.q);
                const sceneQuery = this.wxApp.utils.generateQueryByUrl(willParseUrl.split("?")[1]);
                for (const k in sceneQuery) {
                    options[k] = sceneQuery[k];
                }
                pageName = options.toName;
                if (options.toQuery) {
                    query = JSON.parse(options.toQuery);
                    if (!query.icd && options.icd) {
                        query.icd = options.icd;
                    }
                }
            } catch (error) {
                console.info(error);
            }
        } else {
            pageName = options.toName;
            // 这种情况下分享过来的推荐码已经在初始化的时候处理掉了，无需再处理
            // icd = options.icd;
            if (options.toQuery) {
                query = JSON.parse(options.toQuery);
                if (!query.icd && options.icd) {
                    query.icd = options.icd;
                }
            }
        }
        if (!pageName) {
            pageName = "home";
        }
        if (icd) {
            this.wxApp.data.shareReferralCode = icd;
            this.wxApp.localStorage.setShareReferralCode(icd);
        }
        try {
            await tokenReplace();
            await autoLogin(true);
        } catch (error) {
            console.log(error);
        }
        this.wxApp.dataReport.start(Object.assign({}, query, { name: pageName }));
        // 延时指定时间，不然页面有些难看
        let distanceMillisecond = this.data.onLoadTime + this.data.minWaitingMillisecond - new Date().getTime();
        if (distanceMillisecond < 0) distanceMillisecond = 0;
        setTimeout(() => {
            this.wxApp.router.replace({ name: pageName, query });
        }, distanceMillisecond);
    }
});
