/**
 * 更新管理器
 * wx.getUpdateManager
 */

/** 检查小游戏是否有新版本 */
export function checkUpdate() {
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate((res: any) => {
    console.log('是否有新版本:', res.hasUpdate);
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
    console.log('新版本下载失败');
  });
}
