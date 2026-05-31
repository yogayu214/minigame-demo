/**
 * 更新管理器
 * wx.getUpdateManager
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 检查小游戏是否有新版本 */
export function checkUpdate() {
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate((res: any) => {
    display.text(res.hasUpdate ? '✓ 有新版本可用' : '当前已是最新版本');
  });
  updateManager.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      success(res: any) {
        if (res.confirm) updateManager.applyUpdate();
      },
    });
  });
  updateManager.onUpdateFailed(() => {
    wx.showModal({ title: '更新失败', content: '新版本下载失败', showCancel: false });
  });
}
