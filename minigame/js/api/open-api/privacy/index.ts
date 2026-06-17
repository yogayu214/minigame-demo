/**
 * 隐私授权
 * wx.requirePrivacyAuthorize / wx.openPrivacyContract / wx.getPrivacySetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 主动唤起隐私授权确认弹窗 */
export function requirePrivacyAuthorize() {
  wx.requirePrivacyAuthorize({
    success() {
      wx.showToast({ title: '用户已同意隐私协议', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `授权失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 打开隐私协议页面 */
export function openPrivacyContract() {
  wx.openPrivacyContract({
    success() {
      wx.showToast({ title: '已打开隐私协议', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `打开失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 查询隐私授权状态 */
export function getPrivacySetting() {
  wx.getPrivacySetting({
    success(res: any) {
      display.text(`隐私授权设置\n${formatObj(res)}`);
    },
    fail(err: any) {
      wx.showToast({ title: `查询失败: ${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
