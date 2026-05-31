/**
 * 网络类型
 * wx.getNetworkType
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取手机当前网络类型 */
export function getNetworkType() {
  wx.getNetworkType({
    success(res: any) {
      display.text(`当前网络类型：${res.networkType}`);
    },
    fail(err: any) {
      wx.showModal({ title: '获取失败', content: err.errMsg, showCancel: false });
    },
  });
}
