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

## 小程序上传配置说明

```json
// upload.config.json
{
    "project": "MyProject", // 项目名，用于后台设置的账号密码匹配
    "type": 1, // 发布类型（默认0：上传完成不做任何操作；1：仅设置体验版；2：仅送审；3：设置体验版并送审）
    "list": [
        {
            "version": "0.0.1", // 本次发布的版本号，如果与上个版本号一样会自动加1
            "uploadDesc": "上传备注信息",
            "publishDesc": "送审备注信息", // 送审时（type为2或3）此条为必填项
            "author": "jackyu" // 发布版本作者
        }
    ] // 历史版本列表, 最新的版本索引位置为0
}
```
