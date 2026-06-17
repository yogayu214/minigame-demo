/**
 * 网络类型
 * wx.getNetworkType
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取手机当前网络类型 */
export function getNetworkType() {
  wx.getNetworkType({
    success(res: any) {
      wx.showToast({ title: `当前网络类型：${res.networkType}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `获取失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
