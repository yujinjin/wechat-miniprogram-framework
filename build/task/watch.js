/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：监控文件变化
 */

const { series, watch } = require("gulp");
// 文件操作对象
const fs = require("fs-extra");
// 文件系统路径
const path = require("path");
// 项目根路径
const context = process.cwd();

module.exports = function ({ gulpConfig, configPath, esConfigPath, options, excludes, target, appJsonPath, esRouterPath, uploadConfigPath, projectConfigPath }) {
    // 当前是本地运行模式
    console.info("开始监控文件变化，热更新模式...");
    const filesChange = [];
    const watcher = watch([`${gulpConfig.srcDir}/**/*`], { delay: 500, queue: true, cwd: path.join(context) }, (callbackFun) => {
        if (filesChange.length > 0) {
            // 复制并清理当前数组
            const _files_change = filesChange.splice(0);
            // 0:less 1:update-sys-config 2: task/image-min, 3: alias-replace 4:es-transform, 5:app-json 6:update-project-config 7: alias-replace 8: eslint
            const watcherTasks = [];
            _files_change.forEach((filteItem) => {
                if (filteItem.stats == "unlink" || filteItem.stats == "unlinkDir") {
                    // 删除文件
                    if (fs.pathExistsSync(filteItem.destFilePath)) {
                        fs.removeSync(filteItem.destFilePath);
                    }
                    if (global.movePackageDirs.length > 0) {
                        // 判断当前目录是否是已迁移的目录
                        const i = global.movePackageDirs.findIndex((item) => item.src == filteItem.destFilePath);
                        if (i != -1) {
                            global.movePackageDirs.splice(i, 1);
                            if (fs.pathExistsSync(global.movePackageDirs[i].target)) {
                                fs.removeSync(global.movePackageDirs[i].target);
                            }
                        }
                    }
                } else if (filteItem.stats == "add" || filteItem.stats == "change") {
                    if (/.less$/.test(filteItem.srcFilePath)) {
                        // Less文件特殊处理
                        if (!watcherTasks[0]) {
                            watcherTasks[0] = [];
                        }

                        // 判断当前目录是否是已迁移的目录
                        let destFilePath = filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"));
                        const i = global.movePackageDirs.findIndex((item) => destFilePath == item.src);
                        if (i != -1) {
                            filteItem.destFilePath = global.movePackageDirs[i].target + filteItem.destFilePath.substr(filteItem.destFilePath.lastIndexOf("\\"));
                            console.info("迁移目录改动: ====>" + filteItem.destFilePath);
                        }
                        watcherTasks[0].push(require("./less")(path.join(context, filteItem.srcFilePath), filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"))));
                        return;
                    }
                    // 添加文件
                    fs.copySync(filteItem.srcFilePath, filteItem.destFilePath);
                    if (filteItem.destFilePath == configPath) {
                        // 系统配置文件有变化
                        watcherTasks[1] = [require("./update-sys-config")(configPath, uploadConfigPath, options)];
                        watcherTasks[6] = [require("./update-project-config")(projectConfigPath, esConfigPath)];
                    } else if (configPath.substr(0, configPath.lastIndexOf("\\")) == filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"))) {
                        // 其他环境变量的配置文件变化
                        watcherTasks[6] = [require("./update-project-config")(projectConfigPath, esConfigPath)];
                    } else if (/.(png|jpg|jpeg|svg|gif|ico)$/.test(filteItem.destFilePath)) {
                        // 图片文件
                        if (!watcherTasks[2]) {
                            watcherTasks[2] = [];
                        }
                        watcherTasks[2].push(require("./image-min")(filteItem.destFilePath, filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"))));
                    } else if (filteItem.destFilePath == appJsonPath) {
                        if (!watcherTasks[5]) {
                            // 重新生成路由app.json
                            watcherTasks[5] = [require("./app-json")(appJsonPath, esRouterPath, context, target)];
                        }
                    } else {
                        if (filteItem.destFilePath.startsWith(path.join(context, `${target}/${gulpConfig.jsDir}/router`)) && /.js$/.test(filteItem.destFilePath)) {
                            // 如果当前JS的路由目录，
                            if (!watcherTasks[3]) {
                                watcherTasks[3] = [];
                            }
                            watcherTasks[3].push(
                                require("./alias-replace")(filteItem.destFilePath, gulpConfig.aliasConfig, filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\")))
                            );
                            if (!watcherTasks[4]) {
                                watcherTasks[4] = [require("./es-transform")(`${target}/${gulpConfig.jsDir}/**/*.js`, `${target}/tempjs`)];
                            }
                            if (!watcherTasks[5]) {
                                // 重新生成路由app.json
                                watcherTasks[5] = [require("./app-json")(appJsonPath, esRouterPath, context, target)];
                            }
                            return;
                        }
                        if (global.movePackageDirs.length > 0) {
                            // 判断当前目录是否是已迁移的目录
                            let destFilePath = filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"));
                            const i = global.movePackageDirs.findIndex((item) => destFilePath == item.src);
                            if (i != -1) {
                                fs.copySync(destFilePath, global.movePackageDirs[i].target);
                                fs.removeSync(destFilePath);
                                filteItem.destFilePath = global.movePackageDirs[i].target + filteItem.destFilePath.substr(filteItem.destFilePath.lastIndexOf("\\"));
                                console.info("迁移目录改动: ====>" + filteItem.destFilePath);
                            }
                        }
                    }
                    if (/.(js|wxml|txt)$/.test(filteItem.destFilePath)) {
                        if (!watcherTasks[7]) {
                            watcherTasks[7] = [];
                        }
                        // 路径别名替换
                        watcherTasks[7].push(require("./alias-replace")(filteItem.destFilePath, gulpConfig.aliasConfig, filteItem.destFilePath.substr(0, filteItem.destFilePath.lastIndexOf("\\"))));
                    }
                    if (/.js$/.test(filteItem.destFilePath)) {
                        if (!watcherTasks[4] && filteItem.destFilePath.startsWith(path.join(context, `${target}/${gulpConfig.jsDir}/`))) {
                            watcherTasks[4] = [require("./es-transform")(`${target}/${gulpConfig.jsDir}/**/*.js`, `${target}/tempjs`)];
                        }
                        if (!watcherTasks[8]) {
                            watcherTasks[8] = [require("./eslint")([`${target}/**/*.js`, `!${target}/tempjs/**/*.js`].concat(excludes), target)];
                        }
                    }
                }
            });
            if (watcherTasks.length > 0) {
                let tasks = [];
                watcherTasks.forEach((item) => {
                    if (item) tasks.push(...item);
                });
                series(tasks)((error) => {
                    if (error) {
                        console.error(error);
                        process.exit(1);
                    }
                    console.info("文件变化任务执行完毕 ͡[๏̯͡๏] ​​​");
                });
            }
        }
        // 文件删除处理：文件删除（判断文件是否是迁移目录）
        // 文件变化：JS文件-》copy,replace,
        callbackFun();
    });
    watcher.on("all", function (stats, filePath) {
        let destFilePath = path.join(context, gulpConfig.compileDir, filePath.substr(gulpConfig.srcDir.length + 1));
        if (/.less$/.test(filePath)) {
            // Less文件特殊处理
            // 变成.wxss
            destFilePath = destFilePath.substr(0, destFilePath.length - 4) + "wxss";
        }
        console.log(`File ${filePath} was ${stats}, target File ${destFilePath}`);
        filesChange.push({
            stats,
            srcFilePath: filePath,
            destFilePath
        });
    });
};
