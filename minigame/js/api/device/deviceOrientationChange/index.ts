/**
 * 横竖屏切换
 * wx.setDeviceOrientation
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 切换为横屏，1秒后自动切换回竖屏 */
export function switchToLandscape() {
  wx.setDeviceOrientation({
    value: 'landscape',
    success() {
      wx.showToast({ title: '已切换为横屏', icon: 'none' });
      // setTimeout(() => {
      //   wx.setDeviceOrientation({
      //     value: 'portrait',
      //     success() {
      //       wx.showToast({ title: '已恢复竖屏', icon: 'none' });
      //     },
      //     fail(err: any) {
      //       wx.showToast({ title: `恢复竖屏失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
      //     },
      //   });
      // }, 1000);
    },
    fail(err: any) {
      wx.showToast({ title: `切换横屏失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 切换为竖屏 */
export function switchToPortrait() {
  wx.setDeviceOrientation({
    value: 'portrait',
    success() {
      wx.showToast({ title: '当前方向：竖屏', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `切换竖屏失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
