/**
 * 数据分析
 * wx.reportEvent / wx.reportScene / wx.reportMonitor
 * wx.reportUserBehaviorBranchAnalytics
 * wx.getGameExptInfo / wx.getExptInfoSync
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮上报自定义事件/场景/监控数据。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'report';
function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 自定义事件上报（需先在 mp 后台新建事件） */
export function reportEvent() {
  try {
    wx.reportEvent('demo_event', {
      action: 'click',
      ts: Date.now(),
    });
    toast('reportEvent 已调用（请在 mp 后台查看统计）');
  } catch (e: any) {
    toast(`调用失败: ${e.message || e}`);
  }
}

/** 场景上报：用户场景埋点 */
export function reportScene() {
  wx.reportScene({
    sceneId: 1001,
    success() {
      toast('reportScene 已上报');
    },
    fail(err: any) {
      toast(`上报失败: ${err?.errMsg || '未知错误'}`);
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
    toast('reportMonitor 已上报');
  } catch (e: any) {
    toast(`调用失败: ${e?.message || e}`);
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
    toast('branchAnalytics 已上报');
  } catch (e: any) {
    toast(`调用失败: ${e.message || e}`);
  }
}

/** 获取 A/B 实验信息（异步） */
export function getGameExptInfo() {
  (wx as any).getGameExptInfo({
    keyList: ['demo_key'],
    success(res: any) {
      toast(`实验信息: ${JSON.stringify(res.data || {}).slice(0, 30)}`);
    },
    fail(err: any) {
      toast(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取 A/B 实验信息（同步） */
export function getExptInfoSync() {
  try {
    const res = (wx as any).getExptInfoSync(['demo_key']);
    toast(`实验信息: ${JSON.stringify(res || {}).slice(0, 30)}`);
  } catch (e: any) {
    toast(`调用失败: ${e.message || e}`);
  }
}
