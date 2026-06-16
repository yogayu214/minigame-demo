/**
 * 电量
 * wx.getBatteryInfo
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取设备电量信息 */
export function getBatteryInfo() {
  wx.getBatteryInfo({
    success(res: any) {
      display.text(
        `当前电量: ${res.level}%\n电池状态: ${res.isCharging ? '充电中' : '未充电'}`
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
