/**
 * Icon 推荐
 * wx.createGameIcon
 */

let gameIcon: any = null;

/** 创建 Icon 推荐 */
export function createGameIcon() {
  gameIcon = wx.createGameIcon({ adUnitId: '', count: 1, style: [{ left: 10, top: 300, appNameHidden: false }] });
  gameIcon.onLoad(() => console.log('推荐 Icon 加载成功'));
  gameIcon.onError((err: any) => console.log('错误:', err.errMsg));
}

/** 显示 */
export function show() { if (gameIcon) gameIcon.show(); }

/** 隐藏 */
export function hide() { if (gameIcon) gameIcon.hide(); }

/** 销毁 */
export function destroy() { if (gameIcon) { gameIcon.destroy(); gameIcon = null; } }

/** 页面销毁时清理 */
export function onUnload() { if (gameIcon) { gameIcon.destroy(); gameIcon = null; } }
