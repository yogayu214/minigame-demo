/**
 * 屏幕亮度
 * wx.getScreenBrightness / wx.setScreenBrightness
 */

/** 获取屏幕亮度 */
export function getScreenBrightness() {
  wx.getScreenBrightness({
    success(res: any) {
      console.log('当前屏幕亮度:', res.value);
    },
  });
}

/** 设置屏幕亮度为 0.5 */
export function setHalfBrightness() {
  wx.setScreenBrightness({
    value: 0.5,
    success() {
      wx.showToast({ title: '已设置' });
    },
  });
}

/** 恢复屏幕亮度为 1 */
export function restoreBrightness() {
  wx.setScreenBrightness({
    value: 1,
    success() {
      wx.showToast({ title: '已恢复' });
    },
  });
}
