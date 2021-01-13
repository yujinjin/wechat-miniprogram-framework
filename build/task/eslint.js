/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-22
 * 描述：js代码检查
 */

const gulp = require("gulp");
const ESLint = require("gulp-eslint");

module.exports = function (srcDir, target) {
    return function () {
        console.info("开始eslint目录:" + srcDir);
        return (
            gulp
                .src(srcDir)
                // eslint（）将lint输出附加到“eslint”属性 以供其它模块使用
                .pipe(ESLint())
                // format（）将lint结果输出到控制台。
                // 或者使用eslint.formatEach（）（参见文档）。
                .pipe(ESLint.format())
                // 使进程退出时具有错误代码（1）
                // lint错误，最后将流和管道返回failAfterError。
                .pipe(ESLint.failAfterError())
                .pipe(gulp.dest(target))
        );
    };
};
