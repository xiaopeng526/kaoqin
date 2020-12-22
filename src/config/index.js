/**
 * @description 系统全局配置
 */
export default {
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天
   */
  passCookieExpires: 1,
  /**
   * @description 此处修改网站名称
   */
  webName: 'Q-ADMIN',
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: 'Q-ADMIN-TOEKN',

  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 10000,

  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,

  /**
   * @description 固定头部
   */
  fixedHeader: true,

  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示设置的悬浮按钮
   */
  settingBtn: false,

  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,

  /**
   * 底部文字，支持html语法
   */
  footerTxt: '© 2019 Pactera <a href="http://www.pactera.com" target="_blank">北京文思海辉金信技术有限公司</a>',

  /**
   * 备案号
   */
  caseNumber: '辽ICP备11007858号-3'
}