/**
 * 群相关
 * wx.getGroupEnterInfo / wx.getShareInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/group/wx.getGroupEnterInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取群聊场景入参（仅在从群聊进入小游戏时有效） */
export function getGroupEnterInfo() {
  wx.getGroupEnterInfo({
    success(res: any) {
      display.data({
        encryptedData: String(res.encryptedData || '').slice(0, 40) + '...',
        iv: res.iv || '-',
      });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}（请从群聊场景进入）`);
    },
  });
}

/** 获取转发详细信息（需 shareTicket） */
export function getShareInfo() {
  wx.getShareInfo({
    shareTicket: 'demo_share_ticket',
    success(res: any) {
      display.data({
        encryptedData: String(res.encryptedData || '').slice(0, 40) + '...',
        iv: res.iv || '-',
      });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}（需要合法 shareTicket）`);
    },
  });
}
