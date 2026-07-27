/**
 * 插屏广告
 * wx.createInterstitialAd
 */

export const setDisplay = () => {};

import { createInfoArea } from '../../../libs/info-area';
const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/展示插屏广告。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createInterstitialAd';

let interstitialAd: any = null;

const toast = (title: string) => wx.showToast({ title, icon: 'none', duration: 1000 });

/** 创建插屏广告 */
export function createInterstitialAd() {
  interstitialAd = wx.createInterstitialAd({
    adUnitId: 'adunit-4a474184cd6eb5cc',
  });

  if (!interstitialAd) {
    toast('创建插屏广告失败，当前环境可能不支持');
    return;
  }

  interstitialAd.onLoad(() => {
    toast('插屏广告加载成功，点击 show 展示');
  });

  interstitialAd.onError((err: any) => {
    toast(`调用失败：${err?.errMsg || '未知错误'}`);
  });

  interstitialAd.onClose(() => {
    toast('插屏广告已关闭');
  });

  interstitialAd.load().catch((err: any) => {
    toast(`加载失败：${err?.errMsg || '未知错误'}`);
  });
}

/** 显示插屏广告 */
export function show() {
  if (interstitialAd) {
    interstitialAd
      .show()
      .catch((err: any) => toast(`展示失败: ${err?.errMsg || '未知错误'}`));
  } else {
    toast('请先创建插屏广告');
  }
}

/** 销毁 */
export function destroy() {
  if (interstitialAd) {
    interstitialAd.destroy();
    interstitialAd = null;
    toast('插屏广告已销毁');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (interstitialAd) {
    interstitialAd.destroy();
    interstitialAd = null;
  }
}
