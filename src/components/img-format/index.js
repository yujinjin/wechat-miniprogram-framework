/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-10
 * 描述：图片URL路径补全、阿里云压缩、默认头像
 */
import utils from "@js/utils/utils";
import config from "@js/config/index";

Component({
    options: {
        // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
        styleIsolation: "apply-shared"
    },
    data: {
        imgUrl: "",
        errorImg: config.errorDefaultImg
    },
    // 组件的对外属性，是属性名到属性设置的映射表
    properties: {
        src: {
            type: String
        },
        defaultType: {
            type: String,
            value: "common" //common|avatar
        },
        defaultErrorImg: {
            type: String
        },
        size: {
            type: Number,
            optionalTypes: [Object]
        },
        round: Boolean,
        width: {
            type: null,
            observer: "setStyle"
        },
        height: {
            type: null,
            observer: "setStyle"
        },
        radius: null,
        lazyLoad: {
            type: Boolean,
            value: true
        },
        useErrorSlot: {
            type: Boolean,
            value: true
        },
        useLoadingSlot: {
            type: Boolean,
            value: true
        },
        showMenuByLongpress: {
            type: Boolean,
            value: false
        },
        fit: {
            type: String,
            value: "fit"
        },
        showError: {
            type: Boolean,
            value: true
        },
        showLoading: {
            type: Boolean,
            value: true
        }
    },
    externalClasses: ["custom-class", "loading-class", "error-class", "image-class"],
    observers: {
        src(newVal) {
            this.initImgUrl();
        },
        defaultType(newVal) {
            this.initErrorImgUrl();
        },
        defaultErrorImg() {
            this.initErrorImgUrl();
        }
    },
    ready() {
        this.initErrorImgUrl();
        this.initImgUrl();
    },
    methods: {
        initImgUrl() {
            let imgUrl;
            let isLoadError = false;
            if (this.properties.src) {
                imgUrl = utils.perfectImageUrl(this.properties.src, this.data.size);
            } else {
                isLoadError = true;
            }
            this.setData({
                isLoadSuccee: false,
                isLoadError,
                imgUrl,
                isInitEnd: true
            });
        },
        initErrorImgUrl() {
            let errorImg;
            if (this.data.defaultErrorImg) {
                errorImg = this.data.defaultErrorImg;
            } else if (this.data.defaultType == "avatar") {
                errorImg = config.avatarDefaultImg;
            } else {
                errorImg = config.errorDefaultImg;
            }
            this.setData({ errorImg });
        }
    }
});
