/**
 * 作者：yujinjin9@126.com
 * 时间：2018-12-12
 * 描述：公用API接口
 */
import request from "./request";
import config from "@js/config/index.js";

export default {
    // 图片上传
    imageUpload(file) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: config.uploadImgServer,
                filePath: file,
                name: "file",
                success: ({ data }) => {
                    try {
                        data = JSON.parse(data);
                        resolve(data.result.imgUrl);
                    } catch (error) {
                        reject(new Error("上传失败"));
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    // 获取url参数
    queryLinkParamertersById(inputData, ajaxOptions) {
        return request(
            Object.assign(
                {
                    url: "api/LinkParamertersById",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    }
};
