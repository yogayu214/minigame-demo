/**
 * 设置
 * wx.getSetting / wx.openSetting
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SCOPE_LABELS: Record<string, string> = {
  'scope.userInfo': '用户信息',
  'scope.userLocation': '地理位置',
  'scope.werun': '微信运动',
  'scope.writePhotosAlbum': '保存到相册',
  'scope.camera': '摄像头',
  'scope.record': '录音',
  'scope.WxFriendInteraction': '好友互动',
  'scope.addPhoneContact': '通讯录',
};

function renderSettings(authSetting: Record<string, boolean>) {
  const data: Record<string, string> = {};
  Object.keys(SCOPE_LABELS).forEach((scope) => {
    const value = authSetting[scope];
    const status = value === true ? '✓ 已授权' : value === false ? '✗ 已拒绝' : '— 未设置';
    data[SCOPE_LABELS[scope]] = status;
  });
  display.data(data);
}

/** 获取用户当前设置 */
export function getSetting() {
  wx.getSetting({
    success(res: any) { renderSettings(res.authSetting); },
  });
}

/** 打开设置页面 */
export function openSetting() {
  wx.openSetting({
    success(res: any) { renderSettings(res.authSetting); },
  });
}
