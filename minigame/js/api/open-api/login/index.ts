/**
 * 微信登录
 * wx.login
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 调用 wx.login 获取临时登录凭证 code */
export function login() {
  wx.login({
    success(res: any) {
      if (res.code) {
        display.data({
          '状态': '已登录',
          'code': res.code,
          '说明': '需将 code 发送到后端换取 openid',
        });
      } else {
        wx.showModal({ title: '登录失败', content: res.errMsg, showCancel: false });
      }
    },
    fail(err: any) {
      wx.showModal({ title: '登录失败', content: err.errMsg, showCancel: false });
    },
  });
}
