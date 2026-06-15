/**
 * Grid 广告
 * wx.createGridAd
 * 注意：adUnitId 需替换为你在 mp 后台申请的真实广告位 ID
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let gridAd: any = null;

/** 创建 Grid 广告 */
export function createGridAd() {
  const tip =
    '⚠️ 此功能需要在 mp 后台申请真实的广告位 ID（adUnitId），\n' +
    'Demo 中使用占位 ID，调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 mp 后台创建广告位获取 adUnitId\n' +
    '2. 调用 wx.createGridAd 传入真实 adUnitId\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.createGridAd.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    gridAd = wx.createGridAd({
      adUnitId: 'adunit-xxxxxxxx',
      adTheme: 'white',
      gridCount: 5,
      style: { left: 0, top: 200, width: 330, height: 200 },
    });

    gridAd.onLoad(() => {
      display.text('Grid 广告加载成功');
    });

    gridAd.onError((err: any) => {
      display.text(`调用失败：${err.errMsg}`);
    });
  }, 2000);
}

/** 显示 */
export function show() {
  if (gridAd) {
    gridAd.show();
    display.text('Grid 广告已显示');
  } else {
    display.text('请先创建 Grid 广告');
  }
}

/** 隐藏 */
export function hide() {
  if (gridAd) {
    gridAd.hide();
    display.text('Grid 广告已隐藏');
  }
}

/** 销毁 */
export function destroy() {
  if (gridAd) {
    gridAd.destroy();
    gridAd = null;
    display.text('Grid 广告已销毁');
  }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (gridAd) {
    gridAd.destroy();
    gridAd = null;
  }
}
