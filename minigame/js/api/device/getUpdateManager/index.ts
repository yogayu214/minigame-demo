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
  if (!updateManager) {
    display.text('获取更新管理器失败，当前版本可能不支持');
    return;
  }
  updateManager.onCheckForUpdate((res: any) => {
    display.text(res?.hasUpdate ? '有新版本可用' : '当前已是最新版本');
  });
  updateManager.onUpdateReady(() => {
    display.text('新版本已准备好，调用 applyUpdate 重启');
    updateManager.applyUpdate();
  });
  updateManager.onUpdateFailed(() => {
    display.text('新版本下载失败');
  });
}
