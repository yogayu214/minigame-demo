/**
 * 屏幕常亮
 * wx.setKeepScreenOn
 */

/** 开启屏幕常亮 */
export function enableKeepScreenOn() {
  wx.setKeepScreenOn({
    keepScreenOn: true,
    success() {
      wx.showToast({ title: '已开启' });
    },
  });
}

/** 关闭屏幕常亮 */
export function disableKeepScreenOn() {
  wx.setKeepScreenOn({
    keepScreenOn: false,
    success() {
      wx.showToast({ title: '已关闭' });
    },
  });
}
