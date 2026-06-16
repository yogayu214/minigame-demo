/**
 * 激励视频广告
 * wx.createRewardedVideoAd
 */

export const setDisplay = () => {};

let rewardedVideoAd: any = null;
let firstLoaded = false;

const toast = (title: string) => wx.showToast({ title, icon: 'none', duration: 1000 });

/** 创建激励视频广告 */
export function createRewardedVideoAd() {
  rewardedVideoAd = wx.createRewardedVideoAd({
    adUnitId: Math.round(Math.random())
      ? 'adunit-367ee566b15d46b3' // 长视频
      : 'adunit-52baa2f38c69b5f7', // 短视频
  });

  if (!rewardedVideoAd) {
    toast('创建激励视频广告失败，当前环境可能不支持');
    return;
  }

  firstLoaded = false;
  rewardedVideoAd.onLoad(() => {
    if (!firstLoaded) {
      firstLoaded = true;
      toast('激励视频加载成功，点击 show 播放');
    }
  });

  rewardedVideoAd.onError((err: any) => {
    toast(`调用失败：${err?.errMsg || '未知错误'}`);
  });

  rewardedVideoAd.onClose((res: any) => {
    if (res?.isEnded) {
      toast('完整观看，可发放奖励');
    } else {
      toast('中途退出，不发放奖励');
    }
  });

  rewardedVideoAd.load().catch((err: any) => {
    toast(`加载失败：${err?.errMsg || '未知错误'}`);
  });
}

/** 播放激励视频 */
export function show() {
  if (rewardedVideoAd) {
    rewardedVideoAd.show().catch((err) => {
        toast(`重新加载失败: ${err?.errMsg || '未知错误'}`);
    });
    toast('正在加载激励视频...');
  } else {
    toast('请先创建激励视频广告');
  }
}

/** 销毁激励视频 */
export function destroy() {
  if (rewardedVideoAd) {
    rewardedVideoAd.destroy();
    rewardedVideoAd = null;
    toast('激励视频广告已销毁');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (rewardedVideoAd) {
    rewardedVideoAd.destroy();
    rewardedVideoAd = null;
  }
}
