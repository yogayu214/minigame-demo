/**
 * 横竖屏切换
 * wx.onDeviceOrientationChange
 */

/** 切换为横屏 */
export function switchToLandscape() {
  wx.setDeviceOrientation({
    value: 'landscape',
    success() { wx.showToast({ title: '已切换横屏' }); },
  });
}

/** 切换为竖屏 */
export function switchToPortrait() {
  wx.setDeviceOrientation({
    value: 'portrait',
    success() { wx.showToast({ title: '已切换竖屏' }); },
  });
}
