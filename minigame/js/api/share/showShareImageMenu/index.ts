/**
 * 分享图片菜单
 * wx.showShareImageMenu
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareImageMenu.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SAMPLE_URL = 'https://res.wx.qq.com/wxa-game/dev_doc/images/cover.jpg';

/** 下载一张样例图，调起图片分享菜单 */
export function showShareImageMenu() {
  display.text('下载图片中...');
  wx.downloadFile({
    url: SAMPLE_URL,
    success(d: any) {
      wx.showShareImageMenu({
        path: d.tempFilePath,
        success() { display.text('✓ 已弹出图片分享菜单'); },
        fail(err: any) { display.text(`弹出失败：${err.errMsg}`); },
      });
    },
    fail(err: any) {
      display.text(`下载失败：${err.errMsg}`);
    },
  });
}
