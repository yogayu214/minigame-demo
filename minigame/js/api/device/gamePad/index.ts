/**
 * 手柄
 * wx.onGamepadConnected / wx.offGamepadConnected /
 * wx.onGamepadDisconnected / wx.offGamepadDisconnected
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/gamepad/wx.onGamepadConnected.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let connectListener: any = null;
let disconnectListener: any = null;

/** 监听手柄连接/断开 */
export function listenGamepad() {
  if (connectListener) {
    display.text('已在监听');
    return;
  }
  connectListener = (res: any) => {
    display.data({ 事件: 'connected', id: res.id, mapping: res.mapping });
  };
  disconnectListener = (res: any) => {
    display.data({ 事件: 'disconnected', id: res.id });
  };
  wx.onGamepadConnected(connectListener);
  wx.onGamepadDisconnected(disconnectListener);
  display.text('✓ 已注册手柄监听，请插拔手柄');
}

/** 停止监听 */
export function stopListen() {
  if (connectListener) (wx as any).offGamepadConnected(connectListener);
  if (disconnectListener) (wx as any).offGamepadDisconnected(disconnectListener);
  connectListener = disconnectListener = null;
  display.text('✓ 已停止手柄监听');
}

export function onUnload() {
  stopListen();
}
