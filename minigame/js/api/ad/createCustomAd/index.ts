/**
 * 自定义广告
 * wx.createCustomAd
 */

export const setDisplay = () => {};

import { createInfoArea } from '../../../libs/info-area';
const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮创建/显示/隐藏/销毁自定义广告。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'createCustomAd';

let customAd: any = null;

const toast = (title: string) => wx.showToast({ title, icon: 'none' });

/** 创建自定义广告 */
export function createCustomAd() {
  const win = wx.getWindowInfo();
  customAd = (wx as any).createCustomAd({
    adUnitId: 'adunit-2e20328227ca771b',
    adIntervals: 30,
    style: {
      left: 0,
      top: 450,
      width: win.windowWidth,
      fixed: true,
    },
  });

  if (!customAd) {
    toast('创建自定义广告失败');
    return;
  }

  customAd.onLoad(() => toast('自定义广告加载完成，点击 show 展示'));
  customAd.onError((err: any) => toast(`调用失败：${err?.errMsg || '未知错误'}`));
  customAd.onClose(() => toast('用户关闭了广告'));
}

/** 显示自定义广告 */
export function show() {
  if (customAd) {
    customAd
      .show()
      .then(() => toast('自定义广告已展示'))
      .catch((err: any) => toast(`展示失败: ${err?.errMsg || '未知错误'}`));
  } else {
    toast('请先创建自定义广告');
  }
}

/** 隐藏自定义广告 */
export function hide() {
  if (customAd) {
    customAd.hide();
    toast('已隐藏自定义广告');
  }
}

/** 销毁自定义广告 */
export function destroy() {
  if (customAd) {
    customAd.destroy();
    customAd = null;
    toast('已销毁自定义广告');
  }
}

export function onUnload() {
  if (customAd) {
    customAd.hide();
    customAd.destroy();
    customAd = null;
  }
}
