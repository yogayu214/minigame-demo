/**
 * 性能
 * wx.triggerGC / wx.getPerformance
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/performance/wx.getPerformance.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 主动触发 JavaScriptCore 垃圾回收 */
export function triggerGC() {
  wx.triggerGC();
  display.text('✓ triggerGC 已调用（GC 时机由引擎控制）');
}

/** 获取 Performance 对象并打印 now() */
export function getPerformance() {
  const perf: any = wx.getPerformance();
  const now = perf.now();
  display.data({
    'performance.now()': String(now),
    单位: '微秒（μs）',
  });
}

/** 连续两次 now() 计算时间差，验证计时精度 */
export function measureDelta() {
  const perf: any = wx.getPerformance();
  const t1 = perf.now();
  // 做点小事
  let sum = 0;
  for (let i = 0; i < 100000; i++) sum += i;
  const t2 = perf.now();
  display.data({
    起始时刻: String(t1),
    结束时刻: String(t2),
    耗时: `${(t2 - t1).toFixed(2)} μs`,
    校验和: String(sum),
  });
}
