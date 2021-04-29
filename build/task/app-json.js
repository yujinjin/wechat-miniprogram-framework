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
    console.info("开始生成小程序页面配置JSON");
    return function () {
        return gulp
            .src(appJsonPath)
            .pipe(
                jeditor((json) => {
                    // 初始化app.json页面路径
                    json.pages = [];
                    json.tabBar.list = [];
                    if (json.subpackages && json.subpackages.length > 0) {
                        for (let i = 0; i < json.subpackages.length; i++) {
                            json.subpackages[i].pages = [];
                        }
                    }
                    json.tabBar.list = [];
                    // 清理文件引入缓存，因为文件有变化时，引入的文件数据仍是修改前的数据
                    decache(routerPath);
                    const routers = require(routerPath).default;
                    const changPagePath = function (pagePath, root) {
                        if (pagePath.startsWith("/")) {
                            pagePath = pagePath.substr(1);
                        }
                        if (root) {
                            if (pagePath.startsWith(root + "/")) {
                                // 子包就在当前目录下
                                pagePath = pagePath.substr(root.length + 1);
                            } else if (fs.pathExistsSync(path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))))) {
                                // 如果需要迁移的目录文件还存在就去移动文件（不存在的原因可能是因为当前是watch模式）
                                let newPagePath = pagePath;
                                if (newPagePath.startsWith("pages/")) {
                                    // 如果当前子目录是pages/开头，就去掉pages目录
                                    newPagePath = newPagePath.substr("pages/".length);
                                }
                                // 如果当前页面的路径第一个目录和根目录最后一个目录重复，就会去掉，
                                // 比如：pagePath: pages/others/contents/index, root: pages/subpackages/others
                                // 最终生成的子包目录是：pages/subpackages/others/contents/index,去掉了中间的pages/others路径
                                if (newPagePath.substr(0, newPagePath.indexOf("/")) === root.substr(root.lastIndexOf("/") + 1)) {
                                    newPagePath = newPagePath.substr(newPagePath.indexOf("/") + 1);
                                }
                                let pageDir = path.join(context, src + "/" + root + "/" + newPagePath.substr(0, newPagePath.lastIndexOf("/")));
                                if (!fs.pathExistsSync(pageDir)) {
                                    fs.mkdirsSync(pageDir);
                                }
                                fs.moveSync(path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))), pageDir, { overwrite: true });
                                global.movePackageDirs.push({
                                    src: path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))),
                                    target: pageDir
                                });
                                console.info("迁移目录：" + path.join(context, src + "/" + pagePath.substr(0, pagePath.lastIndexOf("/"))) + " >>>  " + pageDir);
                                return newPagePath;
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
