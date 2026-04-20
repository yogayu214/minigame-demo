/**
 * 插屏广告
 * wx.createInterstitialAd
 */

let interstitialAd: any = null;

/** 创建插屏广告 */
export function createInterstitialAd() {
  interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-interstitial-demo' });
  interstitialAd.onLoad(() => console.log('插屏广告加载成功'));
  interstitialAd.onError((err: any) => console.log('广告错误:', err.errMsg));
  interstitialAd.onClose(() => console.log('插屏广告已关闭'));
}

/** 显示插屏广告 */
export function show() {
  if (interstitialAd) interstitialAd.show().catch((err: any) => console.log('显示失败:', err.errMsg));
}

/** 销毁 */
export function destroy() {
  if (interstitialAd) { interstitialAd.destroy(); interstitialAd = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (interstitialAd) { interstitialAd.destroy(); interstitialAd = null; }
}
