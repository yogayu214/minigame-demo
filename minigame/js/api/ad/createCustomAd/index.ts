/**
 * 自定义广告
 * wx.createCustomAd
 * 注意：adUnitId 需替换为你在 mp 后台申请的真实广告位 ID
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let customAd: any = null;

/** 创建并展示自定义广告 */
export function showCustomAd() {
  const win = wx.getWindowInfo();
  customAd = (wx as any).createCustomAd({
    adUnitId: 'adunit-xxxxxxxx', // 请替换为真实 adUnitId
    adIntervals: 30,
    style: {
      left: 10,
      top: win.windowHeight - 100,
      width: 300,
      fixed: true,
    },
  });
  customAd.onLoad(() => display.text('自定义广告加载完成'));
  customAd.onError((err: any) => display.text(`加载失败: ${err.errMsg}`));
  customAd.onClose(() => display.text('用户关闭了广告'));
  customAd
    .show()
    .then(() => display.text('自定义广告已展示'))
    .catch((err: any) => display.text(`展示失败: ${err.errMsg}`));
}

/** 隐藏自定义广告 */
export function hideCustomAd() {
  if (customAd) {
    customAd.hide();
    display.text('已隐藏自定义广告');
  }
}

/** 销毁自定义广告 */
export function destroyCustomAd() {
  if (customAd) {
    customAd.destroy();
    customAd = null;
    display.text('已销毁自定义广告');
  }
}

export function onUnload() {
  destroyCustomAd();
}
