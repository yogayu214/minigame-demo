/**
 * 横竖屏切换
 * wx.setDeviceOrientation
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 切换为横屏 */
export function switchToLandscape() {
  wx.setDeviceOrientation({
    value: 'landscape',
    success() { display.text('当前方向：横屏'); },
  });
}

/** 切换为竖屏 */
export function switchToPortrait() {
  wx.setDeviceOrientation({
    value: 'portrait',
    success() { display.text('当前方向：竖屏'); },
  });
}
