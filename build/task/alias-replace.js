/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * @param srcDir 操作目录
 * @param aliasConfig 引用路径别名配置，
 * 描述：引用路径别名替换
 */
const gulp = require("gulp");
const through = require("through2");

module.exports = function (srcDir, aliasConfig, target) {
    return function () {
        console.info("开始" + srcDir + "目录引用路径别名替换");
        return gulp
            .src(srcDir)
            .pipe(
                through.obj(function (file, enc, cb) {
                    //如果文件为空，不做任何操作，转入下一个操作，即下一个pipe
                    if (file.isNull()) {
                        console.info("file is null!");
                    } else if (file.isStream()) {
                        //插件不支持对stream直接操作，抛出异常
                        console.log("isStream");
                        this.emit("error");
                    } else {
                        //内容转换，处理好后，再转成Buffer形式
                        let content = file.contents.toString("utf-8");
                        // 内容转换，处理好后，再转成Buffer形式
                        for (let key in aliasConfig) {
                            const aliasPaths = aliasConfig[key].split("\\");
                            const filePaths = file.path.split("\\");
                            filePaths.pop();
                            let i = 0;
                            for (; i < aliasPaths.length; i++) {
                                if (filePaths.length <= i || aliasPaths[i] != filePaths[i]) {
                                    break;
                                }
                            }
                            let replacePath = "";
                            if (i == 0) {
                                throw new Error("需要替换的文件(" + file.path + ")中的(" + key + ")不在同一个目录");
                            } else if (i >= filePaths.length) {
                                replacePath = ".";
                            } else {
                                replacePath = filePaths
                                    .slice(i)
                                    .map(() => "..")
                                    .join("/");
                            }
                            if (aliasPaths.length > i) {
                                replacePath += "/" + aliasPaths.slice(i).join("/");
                            }
                            content = content.replace(new RegExp(key + "/", "gm"), replacePath + "/");
                        }
                        file.contents = Buffer.from(content);
                    }
                    // if (file.path == "D:\\weChartWorkspaces\\XCX.CI\\dist\\js\\router\\index.js") {
                    //     console.info(file.contents.toString("utf-8"));
                    // } else {
                    //     console.info(file.path + "==>" + (file.path == "D:\\weChartWorkspaces\\XCX.CI\\dist\\js\\router\\index.js"));
                    // }
                    // this.push(file);
                    return cb(null, file);
                })
            )
            .pipe(gulp.dest(target));
    };
};
