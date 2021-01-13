/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：复制目录文件到目标目录
 */
const gulp = require("gulp");

module.exports = function (src, target) {
    return function () {
        console.log("复制“" + src + "”目录下所有文件");
        return gulp.src(src).pipe(gulp.dest(target));
    };
};