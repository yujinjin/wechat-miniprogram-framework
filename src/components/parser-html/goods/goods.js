import request from "@js/api/request";
import utils from "@js/utils/utils";
// import config from "../../../js/config/index"

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        goodsId: {
            type: String,
            value: ''
        }
    },

    ready() {
        request(Object.assign({
            url: "api/goods/GoodsShare",
            data: {
                ids: this.properties.goodsId
            },
        }, {})).then(res => {
            if (res && res.length > 0) {
                res[0].pic = utils.perfectImageUrl(res[0].imgs.split('|')[0]);
                this.setData({
                    goodsInfo: res[0]
                })
            }
        })
    },

    /**
     * 组件的初始数据
     */
    data: {
        goodsInfo: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toGoodsDetailsPage(e) {
            let goodsId = e.currentTarget.dataset.goodsId;
            let wxApp = getApp().getWxApp();
            wxApp.router.push({ name: "product-details", query: { id: goodsId } });
            // jump(`minapp://mall-pkg/pages/entry/index?toName=product-details&id=${goodsId}`);
        }
    }
});
