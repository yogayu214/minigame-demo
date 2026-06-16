/**
 * 数据分析
 * wx.reportEvent / wx.reportScene / wx.reportMonitor
 * wx.reportUserBehaviorBranchAnalytics
 * wx.getGameExptInfo / wx.getExptInfoSync
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/data-analysis/wx.reportEvent.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 自定义事件上报（需先在 mp 后台新建事件） */
export function reportEvent() {
  try {
    wx.reportEvent('demo_event', {
      action: 'click',
      ts: Date.now(),
    });
    display.text('reportEvent 已调用（请在 mp 后台查看统计）');
  } catch (e: any) {
    display.text(`调用失败：${e.message || e}`);
  }
}

/** 场景上报：用户场景埋点 */
export function reportScene() {
  wx.reportScene({
    sceneId: 1001,
    costTime: 200,
    dimension: { custom: 'demo' },
    metric: { score: 100 },
    success() {
      display.text('reportScene 已上报');
    },
    fail(err: any) {
      display.text(`上报失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监控上报 */
export function reportMonitor() {
  try {
    (wx as any).reportMonitor({
      name: 'demo_monitor',
      value: 1,
    });
    display.text('reportMonitor 已上报');
  } catch (e: any) {
    display.text(`调用失败：${e?.message || e}`);
  }
}

/** 用户分支行为上报（用于 A/B 实验） */
export function reportUserBehaviorBranchAnalytics() {
  try {
    (wx as any).reportUserBehaviorBranchAnalytics({
      branchId: 'branch_demo_a',
      branchDim: '1',
      eventType: 1,
    });
    display.text('branchAnalytics 已上报');
  } catch (e: any) {
    display.text(`调用失败：${e.message || e}`);
  }
}

/** 获取 A/B 实验信息（异步） */
export function getGameExptInfo() {
  (wx as any).getGameExptInfo({
    keyList: ['demo_key'],
    success(res: any) {
      display.text(
        formatObj({
          实验信息: JSON.stringify(res.data || {}),
        })
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取 A/B 实验信息（同步） */
export function getExptInfoSync() {
  try {
    const res = (wx as any).getExptInfoSync(['demo_key']);
    display.text(
      formatObj({
        实验信息: JSON.stringify(res || {}),
      })
    );
  } catch (e: any) {
    display.text(`调用失败：${e.message || e}`);
  }
}
