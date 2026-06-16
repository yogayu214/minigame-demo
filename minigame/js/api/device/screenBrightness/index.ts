/**
 * 屏幕亮度
 * wx.getScreenBrightness / wx.setScreenBrightness
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let _onBrightnessChange: ((value: number) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnBrightnessChange(fn: ((value: number) => void) | null) {
  _onBrightnessChange = fn;
}

/** 获取当前屏幕亮度 */
export function getScreenBrightness() {
  wx.getScreenBrightness({
    success(res: any) {
      if (_onBrightnessChange) _onBrightnessChange(res?.value);
      else display.text(`当前屏幕亮度: ${res?.value}`);
    },
    fail(err: any) {
      display.text(`获取亮度失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 设置屏幕亮度（0~1） */
export function setScreenBrightness(value: number) {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    display.text('亮度值须在 0~1 之间');
    return;
  }
  wx.setScreenBrightness({
    value,
    fail(err: any) {
      display.text(`设置亮度失败：${err?.errMsg || '未知错误'}`);
    },
  });
  if (_onBrightnessChange) _onBrightnessChange(value);
  else display.text(`屏幕亮度已设为: ${value}`);
}

/** 页面销毁时清理 */
export function onUnload() {
  _onBrightnessChange = null;
}
