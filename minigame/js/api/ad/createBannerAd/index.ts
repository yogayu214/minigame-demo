/**
 * Banner 广告
 * wx.createBannerAd
 */

let bannerAd: any = null;

/** 创建 Banner 广告 */
export function createBannerAd() {
  bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-6f8b0ead7e932f2b',
    style: { left: 0, top: 0, width: 320 },
  });
  bannerAd.onLoad(() => console.log('广告加载成功'));
  bannerAd.onError((err: any) => console.log('广告错误:', err.errMsg));
}

/** 显示广告 */
export function show() {
  if (bannerAd) bannerAd.show();
}

/** 隐藏广告 */
export function hide() {
  if (bannerAd) bannerAd.hide();
}

/** 销毁广告 */
export function destroy() {
  if (bannerAd) { bannerAd.destroy(); bannerAd = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (bannerAd) { bannerAd.destroy(); bannerAd = null; }
}
