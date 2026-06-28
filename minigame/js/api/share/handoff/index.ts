/**
 * PC 接力
 * wx.setHandoffQuery / wx.onHandoff / wx.offHandoff / wx.checkHandoffEnabled
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

let handoffFn: any = null;

/** 设置接力 query（同步接口，返回 Boolean） */
export function setHandoffQuery() {
  const query = 'from=demo&ts=' + Date.now();
  const ok = (wx as any).setHandoffQuery(query);
  toast(`query: ${query} | 设置结果: ${ok ? '成功' : '失败'}`);
}

/** 监听接力事件 */
export function onHandoff() {
  handoffFn = (res: any) => {
    toast(`onHandoff 事件 | query: ${res.query ?? '-'}`);
  };
  (wx as any).onHandoff(handoffFn);
  toast('已监听接力事件');
}

/** 取消监听接力 */
export function offHandoff() {
  if (handoffFn) {
    (wx as any).offHandoff(handoffFn);
    handoffFn = null;
    toast('已取消监听接力');
  } else {
    toast('当前无监听，无需取消');
  }
}

/** 检查接力是否可用（异步接口） */
export function checkHandoffEnabled() {
  (wx as any).checkHandoffEnabled({
    success(res: any) {
      toast(`接力可用: ${!!res.isEnabled} | errCode: ${res.errCode ?? '-'}`);
    },
    fail(err: any) {
      toast(`查询失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

export function onUnload() {
  if (handoffFn) {
    (wx as any).offHandoff(handoffFn);
    handoffFn = null;
  }
}
