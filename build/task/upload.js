/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：小程序代码上传
 */
const decache = require("decache");
const miniprogramCi = require("miniprogram-ci");

module.exports = function (uploadConfigPath, options) {
    return async function () {
        // 创建项目对象
        decache(uploadConfigPath);
        const uploadConfig = require(uploadConfigPath);
        console.info("开始构建NPM");
        if (uploadConfig.packageJsonPath) {
            // 自定义 node_modules 位置的构建 npm
            let packResult = await miniprogramCi.packNpmManually({
                packageJsonPath: uploadConfig.packageJsonPath,
                miniprogramNpmDistDir: uploadConfig.miniprogramNpmDistDir
            });
            console.log("构建NPM完毕, packResult:", packResult);
        }
        const projectInstance = new miniprogramCi.Project({
            appid: uploadConfig.appid,
            type: uploadConfig.type,
            projectPath: uploadConfig.projectPath,
            privateKeyPath: uploadConfig.privateKeyPath,
            ignores: uploadConfig.ignores
        });
        if (!uploadConfig.packageJsonPath) {
            // 构建npm
            const warning = await miniprogramCi.packNpm(projectInstance, {
                ignores: ["pack_npm_ignore_list"],
                reporter: (infos) => {
                    console.log(infos);
                }
            });
            console.warn(warning);
        }
        if (options.mode == "1") {
            console.info("开始小程序上传");
            // 开始上传
            const uploadResult = await miniprogramCi.upload({
                project: projectInstance,
                version: uploadConfig.list[0].version,
                desc: uploadConfig.list[0].desc,
                setting: uploadConfig.setting,
                onProgressUpdate: console.log
            });
            console.log(uploadResult);
            console.info("小程序上传完成...");
        }
    };
};
