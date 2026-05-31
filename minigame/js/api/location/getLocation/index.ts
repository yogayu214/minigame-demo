/**
 * 获取位置
 * wx.getLocation
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取当前地理位置 */
export function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    success(res: any) {
      display.data({
        '经度 E': res.longitude.toFixed(6),
        '纬度 N': res.latitude.toFixed(6),
        '速度': `${res.speed} m/s`,
      });
    },
    fail(err: any) {
      wx.showModal({ title: '获取失败', content: err.errMsg, showCancel: false });
    },
  });
}
