/**
 * 隐私授权
 * wx.requirePrivacyAuthorize / wx.openPrivacyContract /
 * wx.onNeedPrivacyAuthorization / wx.getPrivacySetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 主动唤起隐私授权确认弹窗 */
export function requirePrivacyAuthorize() {
  wx.requirePrivacyAuthorize({
    success() {
      display.text('用户已同意隐私协议');
    },
    fail(err: any) {
      display.text(`授权失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 打开隐私协议页面 */
export function openPrivacyContract() {
  wx.openPrivacyContract({
    success() {
      display.text('已打开隐私协议');
    },
    fail(err: any) {
      display.text(`打开失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 查询隐私授权状态 */
export function getPrivacySetting() {
  wx.getPrivacySetting({
    success(res: any) {
      display.text(
        `needAuthorization: ${res.needAuthorization}\nprivacyContractName: ${res.privacyContractName || '-'}`
      );
    },
    fail(err: any) {
      display.text(`查询失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

let privacyCallback: any = null;

/** 监听用户操作隐私协议事件 */
export function onNeedPrivacyAuthorization() {
  if (privacyCallback) {
    display.text('已在监听中');
    return;
  }
  privacyCallback = (resolve: any) => {
    display.text('收到 onNeedPrivacyAuthorization 回调，自动同意');
    resolve({ event: 'agree', buttonId: 'agree-btn' });
  };
  wx.onNeedPrivacyAuthorization?.(privacyCallback);
  display.text('已注册 onNeedPrivacyAuthorization 监听');
}

export function onUnload() {
  if (privacyCallback) {
    wx.offNeedPrivacyAuthorization?.(privacyCallback);
    privacyCallback = null;
  }
}
