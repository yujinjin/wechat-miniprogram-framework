/**
 * 作者：yujinjin9@126.com
 * 时间：2020-04-28
 * 描述：样式文件转换less->wxss, px->rpx
 */
const gulp = require("gulp");
let less = require("gulp-less");
let rename = require("gulp-rename");
let postcss = require("gulp-postcss");
let px2rpx = require("wx-px2rpx");

module.exports = function (src, target) {
    return function () {
        console.info("开始" + src + "的less样式转换，转换目标目标-" + target);
        return gulp
            .src(src)
            .pipe(less())
            .pipe(postcss([px2rpx({ proportion: 2 })]))
            .pipe(
                rename({
                    extname: ".wxss"
                })
            )
            .pipe(gulp.dest(target));
    };
};
