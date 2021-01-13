/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-30
 * 描述：根据配置文件，更新project.config.json相关配置
 */
const gulp = require("gulp");
const jeditor = require("gulp-json-editor");
const decache = require("decache");

module.exports = function (projectConfigPath, configPath) {
    return function () {
        return gulp
            .src(projectConfigPath)
            .pipe(
                jeditor((json) => {
                    // 清理文件引入缓存，因为文件有变化时，引入的文件数据仍是修改前的数据
                    decache(configPath);
                    const config = require(configPath).default;
                    if (config.appId) {
                        json.appid = config.appId;
                    }
                    return json;
                })
            )
            .pipe(gulp.dest(projectConfigPath.substr(0, projectConfigPath.lastIndexOf("\\"))));
    };
};
