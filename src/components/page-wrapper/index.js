Component({
    properties: {},
    externalClasses: ["page-class", "content-class"],
    data: {
        goHome: {},
        backApp: {}
    },
    options: {
        multipleSlots: true
    },
    observers: {},
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {},
        hide: function () {},
        resize: function () {}
    },
    methods: {}
});
