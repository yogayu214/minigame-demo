/**
 * Grid 广告
 * wx.createGridAd
 */

let gridAd: any = null;

/** 创建 Grid 广告 */
export function createGridAd() {
  gridAd = wx.createGridAd({
    adUnitId: 'adunit-grid-demo',
    adTheme: 'white',
    gridCount: 5,
    style: { left: 0, top: 200, width: 330, opacity: 0.8 },
  });
  gridAd.onLoad(() => console.log('Grid 广告加载成功'));
  gridAd.onError((err: any) => console.log('广告错误:', err.errMsg));
}

/** 显示 */
export function show() {
  if (gridAd) gridAd.show();
}

/** 隐藏 */
export function hide() {
  if (gridAd) gridAd.hide();
}

/** 销毁 */
export function destroy() {
  if (gridAd) { gridAd.destroy(); gridAd = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (gridAd) { gridAd.destroy(); gridAd = null; }
}
