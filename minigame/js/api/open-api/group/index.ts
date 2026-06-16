/**
 * 群相关
 * wx.getGroupEnterInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/group/wx.getGroupEnterInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取群聊场景入参（仅在从群聊进入小游戏时有效） */
export function getGroupEnterInfo() {
  wx.getGroupEnterInfo({
    success(res: any) {
      display.text(
        `encryptedData: ${String(res.encryptedData || '').slice(0, 40)}...\niv: ${res.iv || '-'}`
      );
    },
    fail(err: any) {
      display.text(`查询失败：${err?.errMsg || '未知错误'}（请从群聊场景进入）`);
    },
  });
}
