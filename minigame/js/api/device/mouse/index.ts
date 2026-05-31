/**
 * 鼠标事件（PC 端）
 * wx.onMouseDown / wx.offMouseDown / wx.onMouseUp / wx.offMouseUp /
 * wx.onMouseMove / wx.offMouseMove
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/mouse-event/wx.onMouseDown.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let downListener: any = null;
let upListener: any = null;
let moveListener: any = null;
let lastMoveAt = 0;

/** 监听所有鼠标事件 */
export function listenAll() {
  if (downListener) {
    display.text('已在监听');
    return;
  }
  downListener = (res: any) => {
    display.data({ 事件: 'mousedown', button: String(res.button), x: String(res.x), y: String(res.y) });
  };
  upListener = (res: any) => {
    display.data({ 事件: 'mouseup', button: String(res.button), x: String(res.x), y: String(res.y) });
  };
  moveListener = (res: any) => {
    const now = Date.now();
    if (now - lastMoveAt < 100) return;  // 节流
    lastMoveAt = now;
    display.data({ 事件: 'mousemove', x: String(res.x), y: String(res.y) });
  };
  wx.onMouseDown(downListener);
  wx.onMouseUp(upListener);
  wx.onMouseMove(moveListener);
  display.text('已注册鼠标监听，请在 PC 端移动 / 点击');
}

/** 停止所有鼠标监听 */
export function stopAll() {
  if (downListener) wx.offMouseDown(downListener);
  if (upListener) wx.offMouseUp(upListener);
  if (moveListener) wx.offMouseMove(moveListener);
  downListener = upListener = moveListener = null;
  display.text('✓ 已停止所有鼠标监听');
}

export function onUnload() {
  stopAll();
}
