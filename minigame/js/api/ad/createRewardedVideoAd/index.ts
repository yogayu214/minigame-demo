/**
 * 激励视频广告
 * wx.createRewardedVideoAd
 * 注意：adUnitId 需替换为你在 mp 后台申请的真实广告位 ID
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let rewardedVideoAd: any = null;

/** 创建激励视频广告 */
export function createRewardedVideoAd() {
  rewardedVideoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-xxxxxxxx', // 请替换为真实 adUnitId
  });
  display.text('激励视频广告创建中...');

  rewardedVideoAd.onLoad(() => {
    display.text('激励视频加载成功，点击 show 播放');
  });

  rewardedVideoAd.onError((err: any) => {
    display.text(`激励视频错误: ${err.errMsg}`);
  });

  rewardedVideoAd.onClose((res: any) => {
    if (res.isEnded) {
      display.text('完整观看，可发放奖励');
    } else {
      display.text('中途退出，不发放奖励');
    }
  });
}

/** 播放激励视频 */
export function show() {
  if (rewardedVideoAd) {
    rewardedVideoAd.show().catch(() => {
      rewardedVideoAd.load().then(() => rewardedVideoAd.show());
    });
    display.text('正在加载激励视频...');
  } else {
    display.text('请先创建激励视频广告');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  rewardedVideoAd = null;
}
