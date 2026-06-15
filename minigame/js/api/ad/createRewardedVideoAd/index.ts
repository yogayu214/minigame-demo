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
  const tip =
    '⚠️ 此功能需要在 mp 后台申请真实的广告位 ID（adUnitId），\n' +
    'Demo 中使用占位 ID，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 mp 后台创建广告位获取 adUnitId\n' +
    '2. 调用 wx.createRewardedVideoAd 传入真实 adUnitId\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.createRewardedVideoAd.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-xxxxxxxx',
    });

    rewardedVideoAd.onLoad(() => {
      display.text('激励视频加载成功，点击 show 播放');
    });

    rewardedVideoAd.onError((err: any) => {
      display.text(`调用失败：${err.errMsg}`);
    });

    rewardedVideoAd.onClose((res: any) => {
      if (res.isEnded) {
        display.text('完整观看，可发放奖励');
      } else {
        display.text('中途退出，不发放奖励');
      }
    });
  }, 2000);
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
