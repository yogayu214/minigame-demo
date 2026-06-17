/**
 * 第三方平台
 * wx.getExtConfigSync / wx.getExtConfig
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 同步获取第三方平台自定义数据 */
export function getExtConfigSync() {
  try {
    const res = wx.getExtConfigSync();
    const keys = Object.keys(res || {});
    if (keys.length === 0) {
      wx.showToast({ title: '当前非第三方平台小程序', icon: 'none', duration: 1000 });
    } else {
      display.text(`getExtConfigSync\n${formatObj(res)}`);
    }
  } catch (e: any) {
    wx.showToast({ title: `获取失败：${e?.message || '未知错误'}`, icon: 'none', duration: 1000 });
  }
}

/** 异步获取第三方平台自定义数据 */
export function getExtConfig() {
  wx.getExtConfig({
    success(res: any) {
      const keys = Object.keys(res || {});
      if (keys.length === 0) {
        wx.showToast({ title: '当前非第三方平台小程序', icon: 'none', duration: 1000 });
      } else {
        display.text(`getExtConfig\n${formatObj(res)}`);
      }
    },
    fail(err: any) {
      wx.showToast({ title: `获取失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
  });
}
