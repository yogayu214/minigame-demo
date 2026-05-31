/**
 * 屏幕亮度
 * wx.getScreenBrightness / wx.setScreenBrightness
 */

let _onBrightnessChange: ((value: number) => void) | null = null;
/** 由 rich-configs 绑定 */
export function setOnBrightnessChange(fn: ((value: number) => void) | null) { _onBrightnessChange = fn; }

/** 获取当前屏幕亮度 */
export function getScreenBrightness() {
  wx.getScreenBrightness({
    success(res: any) {
      if (_onBrightnessChange) _onBrightnessChange(res.value);
      else console.log('当前屏幕亮度:', res.value);
    },
  });
}

/** 设置屏幕亮度（0~1） */
export function setScreenBrightness(value: number) {
  wx.setScreenBrightness({ value });
  if (_onBrightnessChange) _onBrightnessChange(value);
}

/** 页面销毁时清理 */
export function onUnload() {
  _onBrightnessChange = null;
}
