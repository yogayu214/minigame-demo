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
  const tip =
    '⚠️ 此功能需要在 mp 后台申请真实的广告位 ID（adUnitId），\n' +
    'Demo 中使用占位 ID，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 mp 后台创建广告位获取 adUnitId\n' +
    '2. 调用 wx.createInterstitialAd 传入真实 adUnitId\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.createInterstitialAd.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-xxxxxxxx',
    });

    interstitialAd.onLoad(() => {
      display.text('插屏广告加载成功，点击 show 展示');
    });

    interstitialAd.onError((err: any) => {
      display.text(`调用失败：${err.errMsg}`);
    });

    interstitialAd.onClose(() => {
      display.text('插屏广告已关闭');
    });
  }, 2000);
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
