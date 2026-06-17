/**
 * 屏幕常亮
 * wx.setKeepScreenOn
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 开启屏幕常亮 */
export function enableKeepScreenOn() {
  wx.setKeepScreenOn({
    keepScreenOn: true,
    success() {
      wx.showToast({ title: '已开启屏幕常亮', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `开启屏幕常亮失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 关闭屏幕常亮 */
export function disableKeepScreenOn() {
  wx.setKeepScreenOn({
    keepScreenOn: false,
    success() {
      wx.showToast({ title: '已关闭屏幕常亮', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `关闭屏幕常亮失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
