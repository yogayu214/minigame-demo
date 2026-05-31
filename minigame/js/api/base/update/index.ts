/**
 * 更新
 * wx.updateWeChatApp / wx.getUpdateManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/update/wx.getUpdateManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let updateManager: any = null;

function ensureManager() {
  if (!updateManager) {
    updateManager = wx.getUpdateManager();
  }
  return updateManager;
}

/** 检查小游戏是否有新版本 */
export function checkForUpdate() {
  const mgr = ensureManager();
  mgr.onCheckForUpdate((res: any) => {
    display.text(res.hasUpdate ? '✓ 检测到新版本' : '当前已是最新版本');
  });
}

/** 监听新版本下载完成 */
export function onUpdateReady() {
  const mgr = ensureManager();
  mgr.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      success(res: any) {
        if (res.confirm) mgr.applyUpdate();
      },
    });
  });
  display.text('已注册 onUpdateReady 监听');
}

/** 监听新版本下载失败 */
export function onUpdateFailed() {
  const mgr = ensureManager();
  mgr.onUpdateFailed(() => {
    display.text('✗ 新版本下载失败');
  });
  display.text('已注册 onUpdateFailed 监听');
}

/** 跳转到更新微信页面（当前微信版本过低时） */
export function updateWeChatApp() {
  wx.updateWeChatApp({
    success() {
      display.text('已跳转更新微信页面');
    },
    fail(err: any) {
      display.text(`无需更新或调用失败：${err.errMsg}`);
    },
  });
}

export function onUnload() {
  // UpdateManager 的监听无法注销，下次进入时复用同一个实例即可
  updateManager = null;
}
