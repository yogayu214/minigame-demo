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
  const tip =
    '⚠️ 此功能需要在 mp 后台申请真实的广告位 ID（adUnitId），\n' +
    'Demo 中使用占位 ID，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 mp 后台创建广告位获取 adUnitId\n' +
    '2. 调用 wx.createCustomAd 传入真实 adUnitId\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.createCustomAd.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    const win = wx.getWindowInfo();
    customAd = (wx as any).createCustomAd({
      adUnitId: 'adunit-xxxxxxxx',
      adIntervals: 30,
      style: {
        left: 10,
        top: win.windowHeight - 100,
        width: 300,
        fixed: true,
      },
    });
    customAd.onLoad(() => display.text('自定义广告加载完成'));
    customAd.onError((err: any) => display.text(`调用失败：${err.errMsg}`));
    customAd.onClose(() => display.text('用户关闭了广告'));
    customAd
      .show()
      .then(() => display.text('自定义广告已展示'))
      .catch((err: any) => display.text(`展示失败: ${err.errMsg}`));
  }, 2000);
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
