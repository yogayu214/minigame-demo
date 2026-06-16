/**
 * Banner 广告
 * wx.createBannerAd
 */

export const setDisplay = () => {};

let bannerAd: any = null;

const toast = (title: string) => wx.showToast({ title, icon: 'none' });

/** 创建并显示 Banner 广告 */
export function createBannerAd() {
  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-2e20328227ca771b',
    adIntervals: 30,
    style: {
      left: 0,
      top: 450,
      width: windowWidth,
      height: 120,
    },
  });

  if (!bannerAd) {
    toast('创建 Banner 广告失败，当前环境可能不支持');
    return;
  }

  bannerAd.onLoad(() => {
    toast('Banner 广告加载成功，点击 show 可展示');
  });

  bannerAd.onError((res: any) => {
    toast(`调用失败：${res?.errMsg || '未知错误'}`);
  });
}

/** 显示广告 */
export function show() {
  if (bannerAd) {
    bannerAd.show();
    toast('Banner 广告已显示');
  } else {
    toast('请先创建 Banner 广告');
  }
}

/** 隐藏广告 */
export function hide() {
  if (bannerAd) {
    bannerAd.hide();
    toast('Banner 广告已隐藏');
  }
}

/** 销毁广告 */
export function destroy() {
  if (bannerAd) {
    bannerAd.hide();
    bannerAd.destroy();
    bannerAd = null;
    toast('Banner 广告已销毁');
  }
}

export function onUnload() {
  if (bannerAd) {
    bannerAd.hide();
    bannerAd.destroy();
    bannerAd = null;
  }
}
