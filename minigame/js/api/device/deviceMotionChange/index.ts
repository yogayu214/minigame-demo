/**
 * 设备方向
 * wx.startDeviceMotionListening / wx.stopDeviceMotionListening
 */

/** 开始监听设备方向变化 */
export function startDeviceMotion() {
  wx.onDeviceMotionChange((res: any) => {
    console.log('alpha:', res.alpha, 'beta:', res.beta, 'gamma:', res.gamma);
  });
  wx.startDeviceMotionListening({ interval: 'normal' });
}

/** 停止监听设备方向 */
export function stopDeviceMotion() {
  wx.stopDeviceMotionListening();
  wx.showToast({ title: '已停止' });
}
