/**
 * 鼠标滚轮（PC 端）
 * wx.onWheel / wx.offWheel
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/wheel-event/wx.onWheel.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let wheelListener: any = null;
let count = 0;

/** 监听滚轮事件 */
export function onWheel() {
  if (wheelListener) {
    display.text('已在监听');
    return;
  }
  count = 0;
  wheelListener = (res: any) => {
    count += 1;
    display.text(
      `触发次数: ${count}\ndeltaX: ${res.deltaX}\ndeltaY: ${res.deltaY}\ndeltaZ: ${res.deltaZ}`
    );
  };
  wx.onWheel(wheelListener);
  display.text('已注册滚轮监听（PC 端）');
}

/** 停止监听 */
export function offWheel() {
  if (wheelListener) {
    wx.offWheel(wheelListener);
    wheelListener = null;
    display.text('已停止滚轮监听');
  }
}

export function onUnload() {
  offWheel();
}
