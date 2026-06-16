/**
 * 获取转发详细信息
 * wx.getShareInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.getShareInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取分享信息（需要 shareTicket） */
export function getShareInfo() {
  // shareTicket 来自 onShareAppMessage 回调或 wx.updateShareMenu 的回调
  // 此处仅展示 API 调用方式，实际 shareTicket 需从分享回调获取
  const shareTicket = 'demo_share_ticket';
  wx.getShareInfo({
    shareTicket,
    success(res: any) {
      display.text(
        formatObj({
          shareTicket,
          errMsg: res.errMsg,
          注意: '实际开发中 shareTicket 需从 onShareAppMessage 回调获取',
        })
      );
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '获取失败',
          原因: err?.errMsg || '未知错误',
          提示: 'shareTicket 需从分享回调中获取，此处仅演示调用方式',
        })
      );
    },
  });
}
