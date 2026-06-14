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
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-xxxxxxxx', // 请替换为真实 adUnitId
    adIntervals: 30,
    style: {
      left: 0,
      top: windowHeight - 120,
      width: windowWidth,
      height: 120,
    },
  });

  display.text('Banner 广告创建中...');

  bannerAd.onLoad(() => {
    bannerAd.show();
    display.text('Banner 广告加载成功，已展示');
  });

  bannerAd.onError((res: any) => {
    display.text(`Banner 广告错误: ${res.errMsg}`);
  });
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
