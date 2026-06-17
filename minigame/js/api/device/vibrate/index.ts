/**
 * 振动
 * wx.vibrateLong / wx.vibrateShort
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 长振动 - 使手机产生较长时间的振动（400ms） */
export function vibrateLong() {
  wx.vibrateLong({
    success() {
      wx.showToast({ title: '长振动已触发', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `长振动失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 短振动 - 使手机产生较短时间的振动，type 可选 heavy/medium/light */
export function vibrateShort() {
  wx.vibrateShort({
    type: 'heavy',
    success() {
      wx.showToast({ title: '短振动已触发 (heavy)', icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `短振动失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
