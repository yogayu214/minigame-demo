/**
 * Banner 推荐
 * wx.createGameBanner
 */

let gameBanner: any = null;

/** 创建 Banner 推荐 */
export function createGameBanner() {
  gameBanner = wx.createGameBanner({ adUnitId: '', style: { left: 0, top: 0 } });
  gameBanner.onLoad(() => console.log('推荐 Banner 加载成功'));
  gameBanner.onError((err: any) => console.log('错误:', err.errMsg));
}

/** 显示 */
export function show() { if (gameBanner) gameBanner.show(); }

/** 隐藏 */
export function hide() { if (gameBanner) gameBanner.hide(); }

/** 销毁 */
export function destroy() { if (gameBanner) { gameBanner.destroy(); gameBanner = null; } }

/** 页面销毁时清理 */
export function onUnload() { if (gameBanner) { gameBanner.destroy(); gameBanner = null; } }
