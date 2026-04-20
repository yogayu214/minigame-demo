/**
 * 加速度计
 * wx.startAccelerometer / wx.stopAccelerometer / wx.onAccelerometerChange
 */

/** 开始监听加速度数据 */
export function startAccelerometer() {
  wx.onAccelerometerChange((res: any) => {
    console.log('加速度 x:', res.x, 'y:', res.y, 'z:', res.z);
  });
  wx.startAccelerometer({ interval: 'normal' });
}

/** 停止监听加速度 */
export function stopAccelerometer() {
  wx.stopAccelerometer();
  wx.showToast({ title: '已停止' });
}
