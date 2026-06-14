/**
 * 插屏广告
 * wx.createInterstitialAd
 * 注意：adUnitId 需替换为你在 mp 后台申请的真实广告位 ID
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let interstitialAd: any = null;

/** 创建插屏广告 */
export function createInterstitialAd() {
  interstitialAd = wx.createInterstitialAd({
    adUnitId: 'adunit-xxxxxxxx', // 请替换为真实 adUnitId
  });
  display.text('插屏广告创建中...');

  interstitialAd.onLoad(() => {
    display.text('插屏广告加载成功，点击 show 展示');
  });

  interstitialAd.onError((err: any) => {
    display.text(`插屏广告错误: ${err.errMsg}`);
  });

  interstitialAd.onClose(() => {
    display.text('插屏广告已关闭');
  });
}

/** 显示插屏广告 */
export function show() {
  if (interstitialAd) {
    interstitialAd
      .show()
      .then(() => display.text('插屏广告已展示'))
      .catch((err: any) => display.text(`展示失败: ${err.errMsg}`));
  } else {
    display.text('请先创建插屏广告');
  }
}

/** 销毁 */
export function destroy() {
  if (interstitialAd) {
    interstitialAd.destroy();
    interstitialAd = null;
    display.text('插屏广告已销毁');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (interstitialAd) {
    interstitialAd.destroy();
    interstitialAd = null;
  }
}
