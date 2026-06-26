/**
 * 微信登录
 * wx.login / wx.checkSession
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 调用 wx.login 获取临时登录凭证 code */
export function login() {
  wx.login({
    success(res: any) {
      if (res.code) {
        display.text(
          `已登录\ncode: ${res.code}\n`
        );
      } else {
        display.text(`登录失败: ${res?.errMsg || '未知错误'}`);
      }
    },
    fail(err: any) {
      display.text(`登录失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 检查当前 session 是否有效 */
export function checkSession() {
  wx.checkSession({
    success() {
      wx.showToast({ title: 'checkSession: 登录态未过期', icon: 'none' });
    },
    fail(err: any) {
      display.text(
        `checkSession: 登录态已过期\n${err?.errMsg || '需重新调用 login'}`
      );
    },
  });
}
