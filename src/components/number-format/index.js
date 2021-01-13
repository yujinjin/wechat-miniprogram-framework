/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-13
 * 描述：日期时间格式化
 */

import utils from "@js/utils/utils";

Component({
    data: {
        moneyValue: "0"
    },
    options: {
        // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
        styleIsolation: "apply-shared"
    },
    properties: {
        value: {
            type: Number,
            optionalTypes: [String],
            value: 0
        },
        // 小数位数
        digit: {
            type: Number,
            value: 2
        },
        // 是否去除小数点最后面的几位0
        removeZero: {
            type: Boolean,
            value: true
        },
        prefix: {
            type: String,
            value: "¥"
        }
    },
    externalClasses: ["money-text", "symbol-text"],
    observers: {
        value(newVal) {
            let moneyValue = utils.numberFormat(newVal, this.data.digit);
            if (this.data.removeZero && moneyValue.indexOf(".") != -1) {
                for (let i = 0; i < this.data.digit; i++) {
                    if (moneyValue.endsWith("0")) {
                        moneyValue = moneyValue.substring(0, moneyValue.length - 1);
                    } else {
                        break;
                    }
                }
                if (moneyValue.endsWith(".")) {
                    moneyValue = moneyValue.substring(0, moneyValue.length - 1);
                }
            }
            this.setData({ moneyValue: moneyValue });
        }
    }
});
