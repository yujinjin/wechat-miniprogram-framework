/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：修改dist目录下的小程序upload.config.json文件内容
 */

const gulp = require("gulp");
const jeditor = require("gulp-json-editor");
const decache = require("decache");
const path = require("path");
const context = process.cwd();
// keyPath: 微信小程序上传私钥的相对目录
module.exports = function (uploadConfigPath, esConfigPath, keyPath, projectConfigPath, target) {
    return async function () {
        console.info("重新配置微信小程序上传的配置文件...");
        return gulp
            .src(uploadConfigPath)
            .pipe(
                jeditor((json) => {
                    // 清理文件引入缓存，因为文件有变化时，引入的文件数据仍是修改前的数据
                    decache(esConfigPath);
                    const config = require(esConfigPath).default;
                    decache(projectConfigPath);
                    const projectConfig = require(projectConfigPath);
                    // 获取appid
                    json.appid = config.appId;
                    if (projectConfig.miniprogramRoot) {
                        json.packageJsonPath = path.join(context, "/package.json");
                        json.miniprogramNpmDistDir = path.join(context, projectConfig.miniprogramRoot);
                    }
                    // 获取当前项目编译路径
                    json.projectPath = path.join(context);
                    // 获取当前项目私钥的路径(私钥文件名称规则：private.{config.appId}.key)
                    json.privateKeyPath = path.join(context, `${keyPath}`, `private.${config.appId}.key`);
                    // 获取编译设置
                    let setting = projectConfig.setting || {};
                    if (json.setting[config.env]) {
                        setting = Object.assign(setting, json.setting[config.env]);
                    }
                    json.setting = setting;
                    return json;
                })
            )
            .pipe(gulp.dest(target));
    };
};
