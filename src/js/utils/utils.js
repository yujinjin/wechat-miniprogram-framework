import config from "@js/config/index.js";
/**
 * 作者：yujinjin9@126.com
 * 时间：2018-12-10
 * 描述：工具
 */
export default {
    // 字符串是否是整数
    isNumber(value) {
        if (!value) return false;
        return /^-?\d+$/.test(value);
    },

    // 字符串是否浮点数
    isFloat(value) {
        if (!value) return false;
        return /^(-?)((\d+\.\d*)|(\d*\.\d+))$/.test(value);
    },

    // 验证手机号
    validateMobile(mobile) {
        if (!mobile) {
            return false;
        }
        mobile = mobile.trim().replace(/\s/g, "");
        if (!/^1[0-9]{10}$/.test(mobile.trim())) {
            return false;
        } else {
            return true;
        }
    },

    //验证邮箱
    validateEmail(email) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(email)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 验证身份证号
     *
     * 验证规则是：18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
     **/
    validateIDCard(IDCard) {
        if (/^[a-zA-Z][0-9]{6}((（|\()[0-9aA](\)|）))$/.test(IDCard.trim())) {
            // 香港
            return true;
        } else if (/^[a-zA-Z][0-9]{9}$/.test(IDCard.trim())) {
            // 台湾
            let gender_sex = IDCard.trim().substring(1, 2);
            if (gender_sex === "1" || gender_sex === "2") {
                return true;
            }
            return false;
        } else if (/^[157]\d{6}((（|\()[0-9](\)|）))$/.test(IDCard.trim())) {
            // 澳门
            return true;
        } else if (/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard.trim())) {
            // 大陆身份证
            // 18位身份证需要验证最后一位校验位
            IDCard = IDCard.split("");
            // ∑(ai×Wi)(mod 11)
            // 加权因子
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            // 校验位
            let parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
            let sum = 0,
                ai = 0,
                wi = 0;
            for (let i = 0; i < 17; i++) {
                ai = IDCard[i];
                wi = factor[i];
                sum += ai * wi;
            }
            let last = parity[sum % 11];
            if (last != IDCard[17].toLocaleUpperCase()) {
                return false;
            }
            return true;
        }
        return false;
    },

    /**
     * 验证银行卡
     *
     * 验证规则是：全数字，长度必须在5到24之间
     */
    validateBankCard(bankCard) {
        if (!bankCard) return false;
        return /^[0-9]{5,25}$/.test(bankCard);
    },

    //获取图片地址，如果地址带有 http://那么就认为是绝对地址，然后直接返回
    perfectImageUrl(url, size) {
        if (!url) {
            return config.errorDefaultImg;
        }
        if (
            ((url.match(/http:\/\//) || url.match(/https:\/\//) || url.match(/\/\//)) && url.indexOf(config.imageDomain) == -1 && url.indexOf("cdnwx.jk724.com") == -1) ||
            url.startsWith("data:image")
        ) {
            // 外部域名的地址
            return url;
        }
        // 清除图片后缀
        if (typeof url === "string" && /(.+\.(jpeg|png|bmp|jpg|gif))\?.+/g.test(url)) {
            url = RegExp.$1;
        }
        let width = false;
        let height = false;
        if (size) {
            if (typeof size === "number") {
                width = height = size;
            } else {
                width = size.width;
                height = size.height;
            }
        }
        // 获取图片压缩质量样式
        let style = "";
        if (width || height) {
            // 小图不需要压缩质量
            const q = (width || height) <= 100 ? 100 : 90;
            style = "?" + "x-oss-process=image/resize,m_lfit," + (width ? `w_${width},` : "") + (height ? `h_${height},` : "") + `limit_1/auto-orient,1/quality,q_${q}`;
        }
        //全站统一配置
        if (url.match(/http:\/\//) || url.match(/https:\/\//) || url.match(/\/\//) || url.match("//cdnwx.jk724.com")) {
            return url + style;
        } else {
            return config.imageDomain + url + style;
        }
    },

    /**
     * 作者：yujinjin9@126.com
     * 时间：2020-04-09
     *
     * @param url 图片地址
     * @param size 图片尺寸(number: 表示宽和高一样，{width: number|boolean-宽或不限宽，height: number|boolean-高或不限制高})
     * @return 返回修改后的图片地址（String）
     * 描述：完善头像图片地址，如果是相对地址加上资源域名，如果有指定尺寸就通过阿里云裁剪，如果地址带有 http://那么就认为是绝对地址，然后直接返回
     */
    perfectAvatarImageUrl(url, size) {
        if (!url) {
            return config.avatarDefaultImg;
        }
        return this.perfectImageUrl(url, size);
    },

    // 生成图片资源的压缩后缀
    generateImgSuffix(size = { width: 750 }, timeStamp = true) {
        let width = 750;
        let height = 0;
        if (typeof size == "number") {
            width = height = size;
        } else if (typeof size == "object") {
            width = size.width;
            height = size.height;
        }
        let quality = 90;
        if (width <= 100 && height <= 100) {
            // 小图不压缩
            quality = 100;
        }
        // 分钟为单位
        let timeNumber = parseInt(new Date().getTime() / 6000);
        return (
            (timeStamp ? "t=" + timeNumber + "&" : "") +
            "x-oss-process=image/resize,m_lfit," +
            (width ? "w_" + width + "," : "") +
            (height ? "h_" + height + "," : "") +
            "limit_1/auto-orient,1/quality,q_" +
            quality
        );
    },

    // 日期时间段显示格式化，1小时以内：mm 分钟前|24小时以内：hh 小时前|1-30天：dd 天前|30天以上：mm/dd|如果30天以上，并且跨年：yyyy/mm/dd
    timeDifferenceFormat(date, separator = "/") {
        if (!date) return "";
        let currentTime = new Date(),
            compareTime = new Date(date);
        let timeDifference = (currentTime.getTime() - compareTime.getTime()) / 1000;
        if (timeDifference < 60) {
            return "刚刚之前";
        } else if (timeDifference < 3600) {
            return parseInt(timeDifference / 60, 10) + "分钟前";
        } else if (timeDifference < 60 * 60 * 24) {
            return parseInt(timeDifference / 3600, 10) + "小时前";
        } else if (timeDifference < 60 * 60 * 24 * 30) {
            return parseInt(timeDifference / (60 * 60 * 24), 10) + "天前";
        } else if (compareTime.getFullYear() == currentTime.getFullYear()) {
            return this.dateFormat(compareTime, `MM${separator}dd`);
        } else {
            return this.dateFormat(compareTime, `yyyy${separator}MM${separator}dd`);
        }
    },

    //日期格式化
    dateFormat(date, fmt = "yyyy-MM-dd") {
        // TODO: 没有经过测试
        if (!date) {
            return "";
        } else if (typeof date === "string") {
            date = new Date(date);
        }
        var o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return fmt;
    },

    /**
     * 文字转换, 空格换行转化
     * @param str 内容
     */
    textFormat(str) {
        if (typeof str !== "string" || !str.trim()) {
            return "";
        } else {
            // 如果内容只有换行或空格则清空内容
            if (
                str.replace(/[\r\n]/g, "").replace(/\s/g, "") &&
                str
                    .replace(/[\r\n]/g, "")
                    .replace(/\s/g, "")
                    .trim()
            ) {
                return str.replace(/[\r\n]/g, "<br>").replace(/\s/g, "&nbsp;");
            } else {
                return "";
            }
        }
    },

    /**
     * 将数值四舍五入(保留2位小数)后格式化成金额形式
     *
     * @param num 数值(Number或者String)
     * @param digit 保留小数点几位
     * @return 金额格式的字符串,如'1,234,567.45'
     * @type String
     */
    //货币格式化
    numberFormat(num, digit) {
        num = num.toString().replace(/\$|\,/g, "");
        if (isNaN(num)) num = "0";
        if (typeof digit != "number" || digit < 0) {
            digit = 0;
        }
        //最大支持11位小数
        if (digit > 11) {
            return;
        }
        // 绝对值
        var sign = num == (num = Math.abs(num)),
            cents = null;
        num = Math.floor(num * Math.pow(10, digit) + 0.50000000001);
        if (digit > 0) {
            //小数位
            cents = num % Math.pow(10, digit);
            cents = ("00000000000" + num).substr(-digit);
        }
        num = Math.floor(num / Math.pow(10, digit)).toString();
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
        if (cents) {
            return (sign ? "" : "-") + num + "." + cents;
        } else {
            return (sign ? "" : "-") + num;
        }
    },

    // 获取链接参数
    getUrlParam(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var result = url.split("?")[1].match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    /**
     * url参数转换成对象
     * @param url 地址
     */
    generateQueryByUrl(url) {
        const query = {};
        if (!url) return query;
        let url_suffix = url.substring(url.lastIndexOf("?") + 1);
        if (!url_suffix) return query;
        if (url_suffix.indexOf("=") === -1) {
            url_suffix = unescape(url_suffix);
        }
        if (!url_suffix) return query;
        url_suffix.replace(/([^?&=]+)=([^?&=]*)/g, function (matchWord, parame1, parame2) {
            query[decodeURIComponent(parame1)] = decodeURIComponent(parame2);
            return matchWord;
        });
        return query;
    },

    /**
     * 修改url中的参数值，如果参数名(name)在URL中不存在且有value值就表示增加该参数，如果value为null或者空字符串就表示删除该参数
     *
     * @param url 当前要修改的URL
     * @param name 参数名，如果参数名(name)在URL中不存在有value值且可以增加就表示增加该参数
     * @param value 参数值，如果value为null或者空字符串就表示删除该参数
     * @param isAdd 如果没有该参数时是否可以增加该参数，默认为true.
     * @return 返回新的URL
     */
    changeURLParameter(url, name, value, isAdd = true) {
        if (!url && !name) return;
        if (!value) {
            // 删除参数
            return url.replace(eval("/(\\?|\\&)(" + name + "=)([^&]*)(&*)/gi"), function (matchWord, parame1, parame2, parame3, parame4) {
                if (parame4 != "&") {
                    return "";
                } else {
                    return parame1;
                }
            });
        } else {
            let _is_has_name = false; // 是否有该参数
            let _new_url = url.replace(eval("/(\\?|\\&)(" + name + "=)([^&]*)(&*)/gi"), function (matchWord, parame1, parame2, parame3, parame4) {
                _is_has_name = true;
                return parame1 + parame2 + value + parame4;
            });
            if (!_is_has_name && isAdd) {
                _new_url += (_new_url.indexOf("?") === -1 ? "?" : "&") + name + "=" + value;
            }
            return _new_url;
        }
    },

    // 生成guid随机数
    generateGuid() {
        return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },

    //随机生成一个ID(年月日+8位随机数)
    generateRandomId() {
        let [_date, _id] = [new Date(), ""];
        _id = "xxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        _id = _date.getFullYear() + "" + (_date.getMonth() > 8 ? _date.getMonth() + 1 : "0" + (1 + _date.getMonth())) + "" + (_date.getDate() > 9 ? _date.getDate() : "0" + _date.getDate()) + _id;
        return _id;
    },

    // 设置 object对象中对应 path 属性路径上的值，如果path不存在，则创建。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。
    setObjectProperty(object, path, value) {
        if (!path) {
            throw new Error("path 属性路径上的值不能为空");
        } else if (!object || typeof object !== "object") {
            throw new Error("设置的目标必须是对象类型");
        }
        let keyArray = [];
        if (typeof path == "string") {
            //将a[b].c转换为a.b.c
            path = path.replace(/\[(\w+)\]/g, ".$1");
            path = path.replace(/^\./, "");
            //将.a.b转换为a.b
            keyArray = path.split(".");
        } else if (path instanceof Array) {
            keyArray = path;
        } else {
            throw new Error("path 属性路径只能为字符串类型或数组类型");
        }
        if (keyArray.length == 1) {
            object[keyArray[0]] = value;
            return { rootObject: { [keyArray[0]]: value } };
        }
        const getValue = function (targetObject, key, isArray) {
            let value = targetObject[key];
            if (value == undefined || value == null || typeof value != "object") {
                targetObject[key] = value = isArray ? [] : {};
            }
            return value;
        };

        let targetValue = getValue(object, keyArray[0], /^\d+$/.test(keyArray[1]));
        let rootName = keyArray[0];
        let rootValue = targetValue;
        for (let i = 1; i < keyArray.length - 1; i++) {
            targetValue = getValue(targetValue, keyArray[i], /^\d+$/.test(keyArray[i + 1]));
        }
        targetValue[keyArray[keyArray.length - 1]] = value;
        return { rootObject: { [rootName]: rootValue } };
    },

    // 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
    getObjectProperty(object, path, defaultValue) {
        if (!path) {
            throw new Error("path 属性路径上的值不能为空");
        } else if (!object || typeof object !== "object") {
            throw new Error("设置的目标必须是对象类型");
        }
        let keyArray = [];
        if (typeof path == "string") {
            //将a[b].c转换为a.b.c
            path = path.replace(/\[(\w+)\]/g, ".$1");
            path = path.replace(/^\./, "");
            //将.a.b转换为a.b
            keyArray = path.split(".");
        } else if (path instanceof Array) {
            keyArray = path;
        } else {
            throw new Error("path 属性路径只能为字符串类型或数组类型");
        }
        let targetValue = object;
        for (let i = 0; i < keyArray.length; i++) {
            if (Object.prototype.hasOwnProperty.call(targetValue, keyArray[i])) {
                targetValue = targetValue[keyArray[i]];
                if (targetValue == null) return null;
            } else {
                targetValue = undefined;
            }
            if (targetValue == undefined) {
                return defaultValue;
            }
        }
        return targetValue;
    }
};
