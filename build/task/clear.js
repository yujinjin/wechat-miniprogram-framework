/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：清理目标目录
 */

const fs = require("fs-extra");
module.exports = function (targetPath) {
    return function () {
        console.log("清空“" + targetPath + "”目录下所有文件");
        if (fs.pathExists(targetPath)) {
            return fs.emptyDir(targetPath);
        } else {
            return fs.mkdirs(targetPath);
        }
    };
};
