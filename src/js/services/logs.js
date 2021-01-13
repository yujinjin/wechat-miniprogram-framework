/**
 * 作者：yujinjin9@126.com
 * 时间：2021-01-08
 * 描述：站点log日志
 */

import config from "@js/config";

const levels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
};
// 默认error级别打印输出
let level = levels.ERROR;

export default {
    // 初始化
    init() {
        if (config.isDebug) {
            level = levels.DEBUG;
        }
    },

    log(logObject, logLevel) {
        if (!console || !console.log) {
            return;
        }
        if (logLevel != undefined && logLevel < level) {
            return;
        }
        console.log(logObject);
    },

    debug(logObject) {
        this.log("DEBUG: ", levels.DEBUG);
        this.log(logObject, levels.DEBUG);
    },

    info(logObject) {
        this.log("INFO: ", levels.INFO);
        this.log(logObject, levels.INFO);
    },

    warn(logObject) {
        this.log("WARN: ", levels.WARN);
        this.log(logObject, levels.WARN);
    },

    error(logObject) {
        this.log("ERROR: ", levels.ERROR);
        this.log(logObject, levels.ERROR);
    },

    fatal(logObject) {
        this.log("FATAL: ", levels.FATAL);
        this.log(logObject, levels.FATAL);
    }
};
