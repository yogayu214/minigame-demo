/**
 * 内存预警
 * wx.onMemoryWarning / wx.offMemoryWarning
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/memory/wx.onMemoryWarning.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let listener: ((res: any) => void) | null = null;
let warningCount = 0;

/** 监听内存预警 */
export function onMemoryWarning() {
  if (listener) {
    display.text('已在监听');
    return;
  }
  warningCount = 0;
  listener = (res: any) => {
    warningCount += 1;
    display.data({
      触发次数: String(warningCount),
      警告等级: String(res.level),
      说明: '5=临界 10=低 15=中 20=高',
    });
  };
  wx.onMemoryWarning(listener);
  display.text('✓ 已注册 onMemoryWarning（系统主动触发，难手工模拟）');
}

/** 停止监听 */
export function offMemoryWarning() {
  if (listener) {
    wx.offMemoryWarning(listener);
    listener = null;
    display.text('✓ 已停止监听');
  }
}

export function onUnload() {
  offMemoryWarning();
}
