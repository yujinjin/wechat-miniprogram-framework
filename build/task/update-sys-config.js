/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-17
 * 描述：把dist目录下的路由页面文件全部配置到dist目录下的app.json文件里
 *   ①.根据routers.js文件中的pages生成到app.json中的pages、subpackages、tabBar配置路径。
 *   ②.在处理subpackages时判断文件目录路径处理（子包页面的路径也会子包也要带上子包目录名，所以这里得去掉）
 */
const fs = require("fs-extra");
const generate = require("@babel/generator").default;
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const decache = require("decache");

module.exports = function (configPath, uploadConfigPath, options) {
    return async function () {
        const content = await fs.readFile(configPath, {
            encoding: "utf-8"
        });
        const ast = parse(content, {
            experimentalDecorators: true,
            experimentalAsyncFunctions: true,
            sourceType: "module",
            plugins: ["classProperties", "classPrivateProperties"]
        });
        traverse(ast, {
            VariableDeclaration(codeTree) {
                const node = codeTree.node;
                const declarations = node.declarations;
                if (declarations.length == 1 && declarations[0].id.name == "config") {
                    const properties = declarations[0].init.properties;
                    properties.forEach((propertie) => {
                        if (propertie.key.name == "releaseTime") {
                            const currentDate = new Date();
                            propertie.value.value =
                                currentDate.getFullYear() +
                                "-" +
                                (currentDate.getMonth() + 1) +
                                "-" +
                                currentDate.getDay() +
                                " " +
                                currentDate.getHours() +
                                ":" +
                                currentDate.getMinutes() +
                                ":" +
                                currentDate.getSeconds();
                        } else if (propertie.key.name == "isDebug") {
                            propertie.value.value = options.mode == "0" || options.env == "DEV";
                        } else if (propertie.key.name == "innerVersion") {
                            // 清理文件引入缓存，因为文件有变化时，引入的文件数据仍是修改前的数据
                            decache(uploadConfigPath);
                            const uploadConfig = require(uploadConfigPath);
                            propertie.value.value = uploadConfig.list[0].version;
                        } else if (propertie.key.name == "env") {
                            propertie.value.value = options.env.toUpperCase();
                        }
                    });
                    console.info("配置文件修改完成....");
                    // 停止遍历
                    codeTree.stop();
                }
            }
        });
        const { code } = generate(ast);
        await fs.writeFile(configPath, code);
    };
};
