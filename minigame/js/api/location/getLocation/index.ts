/**
 * 获取位置
 * wx.getLocation
 */

/** 获取当前地理位置 */
export function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    success(res: any) {
      console.log('纬度:', res.latitude, '经度:', res.longitude, '速度:', res.speed);
    },
    fail(err: any) { console.log('获取失败:', err.errMsg); },
  });
}
