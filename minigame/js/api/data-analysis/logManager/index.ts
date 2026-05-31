/**
 * 日志上报
 * wx.getGameLogManager / wx.getMiniReportManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/data-analysis/wx.getGameLogManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let logManager: any = null;
let reportManager: any = null;

/** 写入小游戏日志（开发者可在 mp 后台查询） */
export function writeGameLog() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  logManager.log('demo log:', { ts: Date.now(), msg: 'hello' });
  logManager.info('demo info:', 'world');
  logManager.warn('demo warn:', 'something');
  logManager.error?.('demo error:', 'error sample');
  display.text('✓ 已写入 4 条 GameLog');
}

/** 实时上报指标 */
export function reportMiniMetric() {
  if (!reportManager) {
    reportManager = (wx as any).getMiniReportManager();
  }
  // API 形态：reportKeyValue / reportEvent，具体看微信版本
  try {
    reportManager.reportKeyValue?.('demo_key', 'demo_value');
    reportManager.reportEvent?.('demo_event', { ts: Date.now() });
    display.text('✓ MiniReportManager 已上报');
  } catch (e: any) {
    display.text(`上报失败：${e.message || e}`);
  }
}
