/**
 * 1.清理dist目录下所有文件
 * 2.把src目录下所有文件复制到dist目录，排除所有less文件
 * 3.把upload.config.json文件复制到dist目录
 * 4.修改dist目录下的小程序upload.config.json文件内容
 *   ①.根据命令修改type类型，具体见运行命令
 * 5.修改项目中的config文件
 * 6.压缩项目的图片
 * 7.JS目录下项目文件中的别名路径替换
 * 8.把js目录下的文件全部做ES转换到临时目录tempjs中（由于无法直接解析es6文件，去生成app.json的页面文件列表）
 * 9.把dist目录下的路由页面文件全部配置到dist目录下的app.json文件里
 *  - 1.根据routers.js文件中的pages生成到app.json中的pages、subpackages、tabBar配置路径。
 *  - 2.在处理subpackages时判断文件目录路径处理（子包页面的路径也会子包也要带上子包目录名，所以这里得去掉）
 * 10.修改项目中的配置文件（小程序开发工具配置文件）
 * 11.整个目录下项目文件中的别名路径替换
 * 12.整个项目做eslint校验
 */

const { series } = require("gulp");
// 轻量级的命令行参数解析引擎
const minimist = require("minimist");
// 文件系统路径
const path = require("path");
// 项目根路径
const context = process.cwd();
// 当前子包迁移的全局目录变量，{src,target}
global.movePackageDirs = [];
// 命令参数解析对象
const knownOptions = {
    string: ["env", "mode"],
    default: {
        env: process.env.NODE_ENV || "PRD",
        mode: "0"
    }
};
// 当前运行命令参数对象
const options = minimist(process.argv.slice(2), knownOptions);
console.info("当前命令参数：" + JSON.stringify(options));
// 当前gulp配置对象
const gulpConfig = require("../gulp.config");
// 当前编译目录相对地址
const target = gulpConfig.compileDir;
// 当前项目配置文件地址
const configPath = path.join(context, `${target}/${gulpConfig.jsDir}/config/index.js`);
// 当前ES编译后的项目配置文件地址
const esConfigPath = path.join(context, `${target}/tempjs/config/index.js`);
// 当前项目小程序上传配置地址
const uploadConfigPath = path.join(context, target, "upload.config.json");
// 小程序项目配置文件
const projectConfigPath = path.join(context, "project.config.json");
// 初始化当前引用路径别名配置
if (gulpConfig.aliasConfig) {
    for (let key in gulpConfig.aliasConfig) {
        gulpConfig.aliasConfig[key] = path.join(context, gulpConfig.compileDir, gulpConfig.aliasConfig[key]);
    }
    console.info("gulp 配置信息：" + JSON.stringify(gulpConfig));
}
// 排除目录
const excludes = (gulpConfig.npmDir || []).map((item) => `!${target}/${item}/**`);
// 当前ES编译后的路由配置文件地址
const esRouterPath = path.join(context, `${target}/tempjs/router/routers.js`);
const appJsonPath = path.join(context, `${target}/app.json`);
const tasks = [
    require("./task/clear")(path.join(context, target)),
    require("./task/copy")([`${gulpConfig.srcDir}/**/*`, `!${gulpConfig.srcDir}/**/*.less`], target),
    require("./task/copy")(path.join(context, "upload.config.json"), target),
    require("./task/less")(`${gulpConfig.srcDir}/**/*.less`, target),
    require("./task/update-sys-config")(configPath, uploadConfigPath, options),
    require("./task/image-min")(`${target}/**/*.{png,jpg,jpeg,svg,gif,ico}`, target),
    require("./task/alias-replace")([`${target}/${gulpConfig.jsDir}/**/*.{js,txt}`], gulpConfig.aliasConfig, `${target}/${gulpConfig.jsDir}`),
    require("./task/es-transform")(`${target}/${gulpConfig.jsDir}/**/*.js`, `${target}/tempjs`),
    require("./task/update-upload-config")(uploadConfigPath, esConfigPath, "key", projectConfigPath, target),
    require("./task/app-json")(appJsonPath, esRouterPath, context, target),
    require("./task/update-project-config")(projectConfigPath, esConfigPath, target),
    require("./task/alias-replace")([`${target}/**/*.{js,wxml,txt}`, `!${target}/tempjs/**`, `!${target}/${gulpConfig.jsDir}/**/*.js`].concat(excludes), gulpConfig.aliasConfig, target),
    require("./task/eslint")([`${target}/**/*.js`, `!${target}/tempjs/**/*.js`].concat(excludes), target),
    require("./task/upload")(uploadConfigPath, options)
];

series(tasks)((error) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.info("任务执行完毕 ͡[๏̯͡๏] ​​​");
    if (options.mode == "0") {
        require("./task/watch")({ gulpConfig, configPath, esConfigPath, options, excludes, target, appJsonPath, esRouterPath, uploadConfigPath, projectConfigPath });
    }
});
