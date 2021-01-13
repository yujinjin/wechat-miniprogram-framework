/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：修改配置文件信息
 *   ①.更新releaseTime发布时间。
 *   ②.根据当前的命令更新isDebug状态，如果是运行状态就是isDebug为true，如果是构建状态就为false
 *   ③.根据upload.config.json文件，修改innerVersion版本号配置
 *   ④.根据运行命令修改当前的运行环境env的配置
 */
const gulp = require("gulp");
const jeditor = require("gulp-json-editor");
const fs = require("fs-extra");
const path = require("path");
const decache = require("decache");

module.exports = function (appJsonPath, routerPath, context, src) {
    return function () {
        return gulp
            .src(appJsonPath)
            .pipe(
                jeditor((json) => {
                    // 清理文件引入缓存，因为文件有变化时，引入的文件数据仍是修改前的数据
                    decache(routerPath);
                    const routers = require(routerPath).default;
                    const changPagePath = function (pagePath, root) {
                        if (pagePath.startsWith("/")) {
                            pagePath = pagePath.substr(1);
                        }
                        if (root) {
                            if (pagePath.startsWith(root + "/")) {
                                pagePath = pagePath.substr(root.length + 1);
                            } else {
                                // 移动文件
                                let pageDir = path.join(context, src + "/" + root + "/" + pagePath.substr(0, pagePath.lastIndexOf("/")));
                                if (!fs.pathExistsSync(pageDir)) {
                                    fs.mkdirsSync(pageDir);
                                }
                                fs.moveSync(path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))), pageDir, { overwrite: true });
                                global.movePackageDirs.push({
                                    src: path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))),
                                    target: pageDir
                                });
                                console.info("迁移目录：" + path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))) + " >>>  " + pageDir);
                            }
                        }
                        return pagePath;
                    };
                    routers.forEach((route) => {
                        if (!route.path) {
                            throw new Error("小程序路由页面没有配置路径!");
                        }
                        if (route.isNavigationPage) {
                            // 当前页面是导航页
                            if (!route.app && !route.app.tabBar) {
                                throw new Error("小程序导航页（" + route.path + "）没有导航配置!");
                            }
                            const pagePath = changPagePath(route.path);
                            json.tabBar.list.push(Object.assign({ pagePath: pagePath }, route.app.tabBar));
                            json.pages.push(pagePath);
                        } else if (route.app && route.app.packageName) {
                            // 当前是子包页面
                            let i = json.subpackages.findIndex((item) => item.name == route.app.packageName);
                            if (i == -1) {
                                throw new Error("小程序页面（" + route.path + "）子包名：" + route.app.packageName + " 无法找到!");
                            }
                            json.subpackages[i].pages.push(changPagePath(route.path, json.subpackages[i].root));
                        } else {
                            // 主包页面
                            json.pages.push(changPagePath(route.path));
                        }
                    });
                    return json;
                })
            )
            .pipe(gulp.dest(src));
    };
};
