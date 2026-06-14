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
      display.text('已开启屏幕常亮');
    },
  });
}

/** 关闭屏幕常亮 */
export function disableKeepScreenOn() {
  wx.setKeepScreenOn({
    keepScreenOn: false,
    success() {
      display.text('已关闭屏幕常亮');
    },
  });
}
