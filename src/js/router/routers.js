/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-08
 * 描述：小程序路由列表
 * {
 *  path:页面文件路径（无需带有子包目录名）
 *  name: 页面名称,
 *  isNavigationPage: 当前页面是否是导航页,默认false,
 *  share: boolean或者对象类型，如果值为true会走默认分享，如果是对象类型会指定分享信息,
 *  authType: 当前页面的登录权限，0: 游客权限（用户微信未登录授权，系统保存用户信息）， 1：访客权限（用户微信已授权，但未注册手机号）， 2： 登录权限（用户已注册手机号） 默认情况下是需要登录注册才能放访问的
 *  app: {
 *    tabBar: {
 *      text: tab 上按钮文字,
 *      iconPath: 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。
 *      selectedIconPath: 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。
 *      ...其他相关参数
 *    }, 导航页的JSON配置，如果isNavigationPage为true则必配
 *    packageName: 页面所属的包名称，没有值时默认是主包内的页面
 *  } 小程序的APP.json配置
 * }
 *
 * 由于当前开发目录做了扁平化，抹去了子包的概念。但最终编译后的源码还是遵循小程序目录结构。
 * 小程序页面分包还是要遵循的，具体原则如下：
 *
 * 打包原则
 *  1.声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到 app（主包） 中
 *  2.app（主包）也可以有自己的 pages（即最外层的 pages 字段）
 *  3.subpackage 的根目录不能是另外一个 subpackage 内的子目录
 *  4.tabBar 页面必须在 app（主包）内
 *
 * 引用原则
 *  1.packageA 无法 require packageB JS 文件，但可以 require app、自己 package 内的 JS 文件
 *  2.packageA 无法 import packageB 的 template，但可以 require app、自己 package 内的 template
 *  3.packageA 无法使用 packageB 的资源，但可以使用 app、自己 package 内的资源
 *
 */
import user from "./user.js";
import other from "./other.js";
import tabBar from "./tab-bar.js";

// 当前项目的页面列表
export default [...user, ...other, ...tabBar];
