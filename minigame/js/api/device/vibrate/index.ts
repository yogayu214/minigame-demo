/**
 * 振动
 * wx.vibrateLong / wx.vibrateShort
 */

/** 长振动 - 使手机产生较长时间的振动（400ms） */
export function vibrateLong() {
  wx.vibrateLong();
}

/** 短振动 - 使手机产生较短时间的振动，type 可选 heavy/medium/light */
export function vibrateShort() {
  wx.vibrateShort({ type: 'heavy' });
}
