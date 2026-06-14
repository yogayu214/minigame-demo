/**
 * 第三方平台
 * wx.getExtConfigSync / wx.getExtConfig
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 同步获取第三方平台自定义数据 */
export function getExtConfigSync() {
  try {
    const res = wx.getExtConfigSync();
    const keys = Object.keys(res || {});
    if (keys.length === 0) {
      display.text('getExtConfigSync\n返回数据为空\n当前非第三方平台小程序');
    } else {
      display.text(
        `getExtConfigSync\n字段数: ${keys.length}\n${keys.map((k) => `${k}: ${res[k]}`).join('\n')}`
      );
    }
  } catch (e: any) {
    display.text(`getExtConfigSync 失败\n${e?.message || e}`);
  }
}

/** 异步获取第三方平台自定义数据 */
export function getExtConfig() {
  wx.getExtConfig({
    success(res: any) {
      const keys = Object.keys(res || {});
      if (keys.length === 0) {
        display.text('getExtConfig\n返回数据为空\n当前非第三方平台小程序');
      } else {
        display.text(
          `getExtConfig\n字段数: ${keys.length}\n${keys.map((k) => `${k}: ${res[k]}`).join('\n')}`
        );
      }
    },
    fail(err: any) {
      display.text(`getExtConfig 失败\n${err?.errMsg || '未知错误'}`);
    },
  });
}
