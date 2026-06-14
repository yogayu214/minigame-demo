/**
 * 平台组件
 * wx.getRankManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/platform-component/wx.getRankManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取排行榜管理器 */
export function getRankManager() {
  const rankManager: any = wx.getRankManager?.();
  if (rankManager) {
    display.text('已获取 RankManager 实例');
    display.text(`type: ${typeof rankManager}`);
  } else {
    display.text('当前版本不支持 getRankManager');
  }
}
