/**
 * 屏幕亮度
 * wx.getScreenBrightness / wx.setScreenBrightness
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea();
export { onInfoTextReady, infoArea };

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
      else setInfo(`当前屏幕亮度: ${res?.value}`);
    },
    fail(err: any) {
      setInfo(`获取亮度失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 设置屏幕亮度（0~1） */
export function setScreenBrightness(value: number) {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    setInfo('亮度值须在 0~1 之间');
    return;
  }
  wx.setScreenBrightness({
    value,
    fail(err: any) {
      setInfo(`设置亮度失败：${err?.errMsg || '未知错误'}`);
    },
  });
  if (_onBrightnessChange) _onBrightnessChange(value);
  else setInfo(`屏幕亮度已设为: ${value}`);
}

/** 页面销毁时清理 */
export function onUnload() {
  _onBrightnessChange = null;
}
