# wechat-miniprogram-framework

微信小程序框架

## 小程序自动化任务列表

-   1.删除 dist 目录下的所有文件
-   2.复制 src 目录下除 less 文件外下的所有文件到 dist 目录
-   3.把 upload.config.json 文件复制到 dist 目录下
-   4.修改 dist 目录下的小程序 upload.config.json 文件内容
    -   1.根据命令修改 type 类型，具体见运行命令
-   5.把 dist 目录下的路由页面文件全部配置到 dist 目录下的 app.json 文件里
    -   1.根据 routers.js 文件中的 pages 生成到 app.json 中的 pages、subpackages、tabBar 配置路径。
    -   2.在处理 subpackages 时判断文件目录路径处理（子包页面的路径也会子包也要带上子包目录名，所以这里得去掉）
-   6.修改配置文件信息
    -   1.更新 releaseTime 发布时间
    -   2.根据当前的命令更新 isDebug 状态，如果是运行状态就是 isDebug 为 true，如果是构建状态就为 false
    -   3.根据 upload.config.json 文件，修改 innerVersion 版本号配置
    -   4.根据运行命令修改当前的运行环境 env 的配置
-   7.实时监控当前开发目录下的文件变化，更新到编译目录中（本地运行模式）
-   8.通过 miniprogram-ci 进行小程序代码的上传操作（项目构建发版模式）

## 运行命令列表

-   1.UAT 环境下本地运行-R_UAT(Runing User Acceptance Test)
-   2.RPD 环境下本地运行-R_PRD(Runing Production)
-   3.UAT 环境下项目构建发体验版 B_UAT(Building User Acceptance Test)
-   4.PRD 环境下项目构建发体验版 B_PRD(Building Production)
-   5.PRD 环境下项目构建提审 BC_PRD(Building and Censorship For Production)

## 小程序自动化脚本配置

配置文件: gulp.config.js
```json
{
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
}
```

## 小程序上传配置说明

配置文件: upload.config.json

```json
{
    "project": "XCX.HealthConstitution", // 项目名
    "appid": "", // 小程序的appid,项目根据编译命令，找到环境配置文件的appid自动化生成
    "type": "miniProgram", // 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin
    "projectPath": "", // 小程序项目的工程化目录路径,项目根据编译命令，找到环境配置文件的appid自动化生成
    "privateKeyPath": "", // 小程序项目的工程化目录路径,项目自动化生成
    "packageJsonPath": "", // 小程序CI key目录路径,项目自动化生成
    "miniprogramNpmDistDir": "", // 小程序被构建 miniprogram_npm 的目标位置目标位置，项目根据project.config.json里自动配置
    "ignores": [
        "node_modules/**/*",
        "dist/node_modules/**/**",
        "src/**/**",
        "key/**/**",
        "build/**/**",
        "dist/tempjs/**/**",
        "dist/upload.config.json"
    ], // 忽略文件
    "setting": {
        "UAT": {
            "es6": true,
            "es7": true,
            "minifyJS": false,
            "minifyWXML": false,
            "minifyWXSS": false,
            "minify": false,
            "codeProtect": false,
            "autoPrefixWXSS": true
        }, // UAT环境编译设置
        "PRD": {
            "es6": true,
            "es7": true,
            "minifyJS": true,
            "minifyWXML": true,
            "minifyWXSS": true,
            "minify": true,
            "codeProtect": false,
            "autoPrefixWXSS": true
        } // PRD环境编译设置
    },
    "list": [
        {
            "version": "0.0.1", // 小程序版本号
            "desc": "中医体质小程序1.0开发", // 小程序发布项目备注
            "author": "jackyu" // 小程序的发布人
        }
    ] // 小程序所有的上传历史版本记录，最新的排在第一位。
}
```

