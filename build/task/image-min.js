/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：图片压缩
 */
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");

module.exports = function (src, target) {
    return function () {
        console.info("开始" + src + "的图片压缩");
        return gulp
            .src(src)
            .pipe(cache(imagemin({})))
            .pipe(gulp.dest(target));
    };
};
