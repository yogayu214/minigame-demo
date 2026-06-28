/**
 * 日志上报
 * wx.getGameLogManager / wx.getMiniReportManager
 *
 * GameLogManager API:
 *   .log(Object param)           — 上报日志（param 含 level/tag/content/callback）
 *   .tag(string key)             → 返回 {info, warn, error, debug} 四个方法
 *   .getCommonInfo()             — 读取全局 commonInfo 对象
 *   .updateCommonInfo(Object)    — 合并更新全局 commonInfo（仅第一层属性）
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

let logManager: any = null;
let reportManager: any = null;

/** 初始化 logManager */
function getLogManager() {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  return logManager;
}

/**
 * 上报日志 — log(param)
 * param 支持设置日志等级、日志标签、日志内容和上报回调
 */
export function writeGameLog() {
  const mgr = getLogManager();
  // log 接收 Object 参数
  mgr.log({
    level: 'info',
    content: 'demo log',
    tag: 'default',
    ts: Date.now(),
    success() {
      toast('log 已上报 (level=info)');
    },
  });

  // 不同等级示例
  mgr.warn?.({
    content: 'demo warn',
    tag: 'default',
    ts: Date.now(),
  });
}

/**
 * tag 方法 — tag(key) 返回 {info, warn, error, debug}
 * 用 tag 返回的方法上报日志，不需要重复设置等级/标签，简化操作
 */
export function useTag() {
  const mgr = getLogManager();
  const t = mgr.tag?.('demo_tag');
  if (!t) {
    toast('tag 方法不可用');
    return;
  }
  // 通过 tag 返回的方法上报
  t.info?.('通过 tag.info 上报的日志');
  t.warn?.('通过 tag.warn 上报的日志');
  t.error?.('通过 tag.error 上报的日志');
  toast('已通过 tag(demo_tag) 上报 3 条日志');
}

/** 读取当前 logger 的全局 commonInfo 对象 */
export function getCommonInfo() {
  const mgr = getLogManager();
  const info = mgr.getCommonInfo?.();
  toast(`commonInfo: ${JSON.stringify(info || {})}`);
}

/** 将对象与全局 commonInfo 合并（仅第一层属性） */
export function updateCommonInfo() {
  const mgr = getLogManager();
  mgr.updateCommonInfo?.({ demo_key: 'demo_value' });
  toast('已合并更新 commonInfo: { demo_key }');
}

/** 实时上报指标（MiniReportManager） */
export function reportMiniMetric() {
  if (!reportManager) {
    reportManager = (wx as any).getMiniReportManager();
  }
  try {
    reportManager.report?.('demo_event', { ts: Date.now() });
    toast('MiniReportManager 已上报');
  } catch (e: any) {
    toast(`上报失败: ${e.message || e}`);
  }
}
