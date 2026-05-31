/**
 * Banner 广告
 * wx.createBannerAd
 */

let bannerAd: any = null;

/** 创建并显示 Banner 广告 */
export function createBannerAd() {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-2e20328227ca771b',
    adIntervals: 30, // 广告自动刷新间隔（秒），必须 ≥ 30
    style: { left: 0, top: windowHeight - 120, width: windowWidth },
  });

  wx.showLoading({ title: '广告加载中...', mask: true });

  bannerAd.onLoad(() => {
    wx.hideLoading();
    bannerAd.show();
    console.log('Banner 广告加载成功');
  });

  bannerAd.onError((res: any) => {
    wx.hideLoading();
    wx.showModal({ title: '广告错误', content: res.errMsg, showCancel: false });
  });
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
  if (bannerAd) { bannerAd.hide(); bannerAd.destroy(); bannerAd = null; }
}

export function onUnload() {
  if (bannerAd) { bannerAd.destroy(); bannerAd = null; }
}
