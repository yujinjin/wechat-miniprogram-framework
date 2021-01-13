/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：把JS进行babel编译
 */
const gulp = require("gulp");
const babel = require("gulp-babel");

module.exports = function (src, target) {
    return function () {
        console.info("目录：" + src + " 开始babel编译");
        return gulp
            .src(src)
            .pipe(
                babel({
                    presets: ["@babel/env"]
                })
            )
            .pipe(gulp.dest(target));
    };
};
