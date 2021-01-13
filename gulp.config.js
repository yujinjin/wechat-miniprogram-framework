/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-16
 * 描述：gulp文件流配置
 */
module.exports = {
    // 打包编译后的根目录名
    compileDir: "dist",
    // 源码目录
    srcDir: "src",
    // JS目录,目前用于获取JS目录下的路由配置来改变app.json的
    jsDir: "js",
    // 包管理目录
    npmDir: ["miniprogram_npm", "node_modules"],
    // 引用路径别名配置
    aliasConfig: {
        "@js": "/js",
        "@components": "/components",
        "@pages": "/pages",
        "@imgs": "/imgs"
    }
};
