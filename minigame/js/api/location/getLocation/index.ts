/**
 * 获取位置
 * wx.getLocation / wx.getFuzzyLocation
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取当前地理位置（精确） */
export function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    success(res: any) {
      display.text(
        `经度 E: ${res.longitude.toFixed(6)}\n纬度 N: ${res.latitude.toFixed(6)}\n速度: ${res.speed} m/s`
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取模糊位置（无需用户授权） */
export function getFuzzyLocation() {
  if (typeof (wx as any).getFuzzyLocation !== 'function') {
    display.text('当前环境不支持 wx.getFuzzyLocation');
    return;
  }
  (wx as any).getFuzzyLocation({
    success(res: any) {
      display.text(
        `经度 E: ${res.longitude.toFixed(6)}\n纬度 N: ${res.latitude.toFixed(6)}\n类型: 模糊位置`
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
