/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-10
 * 描述：日期时间格式化
 */

import utils from "../../js/utils/utils";

Component({
    options: {
        // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
        styleIsolation: "apply-shared"
    },
    // 组件的对外属性，是属性名到属性设置的映射表
    properties: {
        // 日期时间
        value: {
            // 属性名
            type: String,
            optionalTypes: [Object],
            value: ""
        },
        // 格式
        format: {
            type: String,
            value: "yyyy-MM-dd hh:mm:ss"
        },
        // text 文本是否可选
        selectable: {
            type: Boolean,
            value: true
        },
        // 是否是列表的格式化时间
        list: {
            type: Boolean,
            value: false
        },
        // 列表时间分隔符
        separator: {
            type: String,
            value: '-'
        }
    },
    observers: {
        value: function (newVal) {
            if (!isNaN(newVal)) {
                newVal = +newVal;
            }
            this.setData({
                formatValue: this.properties.list ? utils.timeDifferenceFormat(newVal, this.properties.separator) : utils.dateFormat(newVal, this.data.format)
            });
            // console.info(this.data.formatValue, newVal, this.data.format)
        }
    },
    data: {
        formatValue: ""
    }
});
