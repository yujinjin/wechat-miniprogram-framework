/**
 * 作者：yujinjin9@126.com
 * 时间：2020-06-24
 * 描述：小程序自定义事件
 */

export default (function () {
    const events = {};

    const onceEvents = {};

    return {
        // 绑定事件
        on(eventName, callbackFun) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(callbackFun);
        },
        // 只绑定一次事件
        once(eventName, callbackFun) {
            if (!onceEvents[eventName]) {
                onceEvents[eventName] = [];
            }
            onceEvents[eventName].push(callbackFun);
        },
        // 移除事件
        off(eventName, callbackFun) {
            let callbackFuns = events[eventName];
            if (callbackFuns) {
                callbackFuns.find(function (value, index, arr) {
                    if (value === callbackFun) {
                        callbackFuns.splice(index, 1);
                        return true;
                    }
                });
            }
            callbackFuns = onceEvents[eventName];
            if (callbackFuns) {
                callbackFuns.find(function (value, index, arr) {
                    if (value === callbackFun) {
                        callbackFuns.splice(index, 1);
                        return true;
                    }
                });
            }
        },
        /**
         * 触发事件
         * @param eventName 事件名称
         * @param args 触发回调函数的的入参，数组类型:[id, number]
         */
        trigger(eventName, args) {
            let callbackFuns = events[eventName];
            if (callbackFuns && callbackFuns.length > 0) {
                for (let i = 0; i < callbackFuns.length; i++) {
                    callbackFuns[i].apply(this, args);
                }
            }
            callbackFuns = onceEvents[eventName];
            if (callbackFuns && callbackFuns.length > 0) {
                for (let i = 0; i < callbackFuns.length; i++) {
                    callbackFuns[i].apply(this, args);
                }
                delete onceEvents[eventName];
            }
        }
    };
})();
