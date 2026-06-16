/**
 * 分享图片菜单
 * wx.showShareImageMenu
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareImageMenu.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 截取当前画布作为分享图片，调起图片分享菜单 */
export function showShareImageMenu() {
  display.text('截取画布中...');
  try {
    const tempFilePath = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
    wx.showShareImageMenu({
      path: tempFilePath,
      success() {
        display.text('已弹出图片分享菜单');
      },
      fail(err: any) {
        display.text(`弹出失败：${err?.errMsg || '未知错误'}`);
      },
    });
  } catch (e: any) {
    display.text(`截图失败：${e.message || e}`);
  }
}
