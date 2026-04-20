/**
 * 激励视频广告
 * wx.createRewardedVideoAd
 */

let rewardedVideoAd: any = null;

/** 创建激励视频广告 */
export function createRewardedVideoAd() {
  rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-rewarded-demo' });
  rewardedVideoAd.onLoad(() => console.log('激励视频加载成功'));
  rewardedVideoAd.onError((err: any) => console.log('广告错误:', err.errMsg));
  rewardedVideoAd.onClose((res: any) => {
    console.log(res.isEnded ? '完整观看，发放奖励' : '中途退出，不发放奖励');
  });
}

/** 播放激励视频 */
export function show() {
  if (rewardedVideoAd) rewardedVideoAd.show().catch(() => {
    rewardedVideoAd.load().then(() => rewardedVideoAd.show());
  });
}

/** 页面销毁时清理 */
export function onUnload() {
  rewardedVideoAd = null;
}
