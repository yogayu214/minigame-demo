/**
 * 渲染帧率
 * wx.setPreferredFramesPerSecond
 */

/** 设置帧率为 60fps */
export function set60fps() {
  wx.setPreferredFramesPerSecond(60);
  wx.showToast({ title: '60fps' });
}

/** 设置帧率为 30fps */
export function set30fps() {
  wx.setPreferredFramesPerSecond(30);
  wx.showToast({ title: '30fps' });
}

/** 设置帧率为 15fps */
export function set15fps() {
  wx.setPreferredFramesPerSecond(15);
  wx.showToast({ title: '15fps' });
}
