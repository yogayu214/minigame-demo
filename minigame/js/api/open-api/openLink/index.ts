/**
 * OPENLINK
 * wx.createPageManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/openlink/wx.createPageManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建页面管理器 */
export function createPageManager() {
  const pageManager: any = wx.createPageManager?.();
  if (pageManager) {
    display.text('已创建 PageManager 实例');
    display.text(`type: ${typeof pageManager}`);
  } else {
    display.text('当前版本不支持 createPageManager');
  }
}
