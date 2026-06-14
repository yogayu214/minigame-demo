/**
 * 日志上报
 * wx.getGameLogManager / wx.getMiniReportManager
 * GameLogManager.log / tag / getCommonInfo / updateCommonInfo
 * MiniReportManager.report
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/data-analysis/wx.getGameLogManager.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let logManager: any = null;
let reportManager: any = null;

/** 写入小游戏日志 */
export function writeGameLog() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  logManager.log('demo log:', { ts: Date.now(), msg: 'hello' });
  logManager.info('demo info:', 'world');
  logManager.warn('demo warn:', 'something');
  logManager.error?.('demo error:', 'error sample');
  display.text('已写入 4 条 GameLog');
}

/** 设置日志标签 */
export function tag() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  logManager.tag?.('demo_tag');
  display.text('已设置日志标签: demo_tag');
}

/** 获取日志公共信息 */
export function getCommonInfo() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  const info = logManager.getCommonInfo?.();
  display.text(
    formatObj({
      commonInfo: JSON.stringify(info || {}),
    })
  );
}

/** 更新日志公共信息 */
export function updateCommonInfo() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  logManager.updateCommonInfo?.({
    key: 'demo_key',
    value: 'demo_value',
  });
  display.text('已更新日志公共信息');
}

/** 实时上报指标 */
export function reportMiniMetric() {
  if (!reportManager) {
    reportManager = (wx as any).getMiniReportManager();
  }
  try {
    reportManager.report?.('demo_event', { ts: Date.now() });
    display.text('MiniReportManager 已上报');
  } catch (e: any) {
    display.text(`上报失败：${e.message || e}`);
  }
}
