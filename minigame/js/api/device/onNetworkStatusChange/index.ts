/**
 * 监听网络状态变化
 * wx.onNetworkStatusChange / wx.offNetworkStatusChange
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let listener: any = null;

/** 开始监听网络状态变化 */
export function startListening() {
  if (listener) {
    display.text('已在监听');
    return;
  }
  listener = (res: any) => {
    display.text(
      `连接状态: ${res.isConnected ? '已连接' : '已断开'}\n网络类型: ${res.networkType}`
    );
  };
  wx.onNetworkStatusChange(listener);
  display.text('已开始监听（请切换网络以查看变化）');
}

/** 停止监听 */
export function stopListening() {
  if (listener) {
    wx.offNetworkStatusChange(listener);
    listener = null;
    display.text('已停止监听');
  }
}

export function onUnload() {
  if (listener) {
    wx.offNetworkStatusChange(listener);
    listener = null;
  }
}
