/**
 * 陀螺仪
 * wx.startGyroscope / wx.stopGyroscope / wx.onGyroscopeChange
 */

/** 开始监听陀螺仪数据 */
export function startGyroscope() {
  wx.onGyroscopeChange((res: any) => {
    console.log('x:', res.x, 'y:', res.y, 'z:', res.z);
  });
  wx.startGyroscope({ interval: 'normal' });
}

/** 停止监听陀螺仪 */
export function stopGyroscope() {
  wx.stopGyroscope();
  wx.showToast({ title: '已停止' });
}
