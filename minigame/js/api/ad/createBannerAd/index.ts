/**
 * Banner 广告
 * wx.createBannerAd
 * 注意：adUnitId 需替换为你在 mp 后台申请的真实广告位 ID
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let bannerAd: any = null;

/** 创建并显示 Banner 广告 */
export function createBannerAd() {
  const tip =
    '⚠️ 此功能需要在 mp 后台申请真实的广告位 ID（adUnitId），\n' +
    'Demo 中使用占位 ID，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 mp 后台创建广告位获取 adUnitId\n' +
    '2. 调用 wx.createBannerAd 传入真实 adUnitId\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.createBannerAd.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-xxxxxxxx',
      adIntervals: 30,
      style: {
        left: 0,
        top: windowHeight - 120,
        width: windowWidth,
        height: 120,
      },
    });

    bannerAd.onLoad(() => {
      bannerAd.show();
      display.text('Banner 广告加载成功，已展示');
    });

    bannerAd.onError((res: any) => {
      display.text(`调用失败：${res.errMsg}`);
    });
  }, 2000);
}

/** 显示广告 */
export function show() {
  if (bannerAd) {
    bannerAd.show();
    display.text('Banner 广告已显示');
  } else {
    display.text('请先创建 Banner 广告');
  }
}

/** 隐藏广告 */
export function hide() {
  if (bannerAd) {
    bannerAd.hide();
    display.text('Banner 广告已隐藏');
  }
}

/** 销毁广告 */
export function destroy() {
  if (bannerAd) {
    bannerAd.hide();
    bannerAd.destroy();
    bannerAd = null;
    display.text('Banner 广告已销毁');
  }
}

export function onUnload() {
  if (bannerAd) {
    bannerAd.destroy();
    bannerAd = null;
  }
}
