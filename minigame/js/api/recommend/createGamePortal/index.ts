/**
 * Portal 推荐
 * wx.createGamePortal
 */

let gamePortal: any = null;

/** 创建 Portal 推荐 */
export function createGamePortal() {
  gamePortal = wx.createGamePortal({ adUnitId: '' });
  gamePortal.onLoad(() => console.log('推荐 Portal 加载成功'));
  gamePortal.onError((err: any) => console.log('错误:', err.errMsg));
}

/** 显示 */
export function show() { if (gamePortal) gamePortal.show(); }

/** 销毁 */
export function destroy() { if (gamePortal) { gamePortal.destroy(); gamePortal = null; } }
