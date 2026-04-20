/**
 * 电量
 * wx.getBatteryInfo
 */

/** 获取设备电量信息 */
export function getBatteryInfo() {
  wx.getBatteryInfo({
    success(res: any) {
      console.log('当前电量:', res.level + '%', '是否充电:', res.isCharging);
    },
  });
}
