/**
 * 触摸事件
 * wx.onTouchStart / wx.offTouchStart / wx.onTouchMove / wx.offTouchMove /
 * wx.onTouchEnd / wx.offTouchEnd / wx.onTouchCancel / wx.offTouchCancel
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/touch-event/wx.onTouchStart.html
 *
 * 注意：UI 框架（PIXI 按钮）自身会消费触摸，本演示直接监听 wx 全局触摸事件。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const listeners: Record<string, any> = {};
let lastTime = 0;

function throttle(fn: () => void) {
  const now = Date.now();
  if (now - lastTime < 80) return;
  lastTime = now;
  fn();
}

/** 监听所有触摸事件 */
export function listenAll() {
  if (listeners.start) {
    display.text('已在监听');
    return;
  }
  listeners.start = (res: any) => {
    const t = res.touches?.[0];
    display.data({ 事件: 'touchstart', x: String(t?.clientX), y: String(t?.clientY), 触点数: String(res.touches?.length || 0) });
  };
  listeners.move = (res: any) => throttle(() => {
    const t = res.touches?.[0];
    display.data({ 事件: 'touchmove', x: String(t?.clientX), y: String(t?.clientY) });
  });
  listeners.end = (res: any) => {
    display.data({ 事件: 'touchend', changedTouches: String(res.changedTouches?.length || 0) });
  };
  listeners.cancel = () => display.data({ 事件: 'touchcancel', 说明: '被打断' });

  wx.onTouchStart(listeners.start);
  wx.onTouchMove(listeners.move);
  wx.onTouchEnd(listeners.end);
  wx.onTouchCancel(listeners.cancel);
  display.text('已注册触摸 4 事件，请在屏幕上滑动');
}

/** 停止所有触摸监听 */
export function stopAll() {
  if (listeners.start) wx.offTouchStart(listeners.start);
  if (listeners.move) wx.offTouchMove(listeners.move);
  if (listeners.end) wx.offTouchEnd(listeners.end);
  if (listeners.cancel) wx.offTouchCancel(listeners.cancel);
  Object.keys(listeners).forEach((k) => delete listeners[k]);
  display.text('✓ 已停止触摸监听');
}

export function onUnload() {
  stopAll();
}
