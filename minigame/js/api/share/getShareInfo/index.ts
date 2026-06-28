/**
 * 获取转发详细信息
 * wx.getShareInfo
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 获取分享信息（需要 shareTicket） */
export function getShareInfo() {
  // shareTicket 来自 onShareAppMessage 回调或 wx.updateShareMenu 的回调
  // 此处仅展示 API 调用方式，实际 shareTicket 需从分享回调获取
  const shareTicket = 'demo_share_ticket';
  wx.getShareInfo({
    shareTicket,
    success(res: any) {
      toast(`shareTicket: ${shareTicket} | errMsg: ${res.errMsg}`);
    },
    fail(err: any) {
      toast(`获取失败: ${err?.errMsg || '未知错误'}（shareTicket 需从分享回调获取）`);
    },
  });
}
