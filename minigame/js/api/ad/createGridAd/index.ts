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
  gridAd = wx.createGridAd({
    adUnitId: 'adunit-xxxxxxxx', // 请替换为真实 adUnitId
    adTheme: 'white',
    gridCount: 5,
    style: { left: 0, top: 200, width: 330, height: 200 },
  });
  display.text('Grid 广告创建中...');

  gridAd.onLoad(() => {
    display.text('Grid 广告加载成功');
  });

  gridAd.onError((err: any) => {
    display.text(`Grid 广告错误: ${err.errMsg}`);
  });
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
