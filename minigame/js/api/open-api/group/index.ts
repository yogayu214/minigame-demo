/**
 * 群相关
 * wx.getGroupEnterInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/group/wx.getGroupEnterInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取群聊场景入参（仅在从群聊进入小游戏时有效） */
export function getGroupEnterInfo() {
  wx.getGroupEnterInfo({
    success(res: any) {
      display.text(`群聊入参\n${formatObj(res)}`);
    },
    fail(err: any) {
      wx.showToast({ title: `查询失败: ${'请从群聊场景进入'}`, icon: 'none' });
    },
  });
}
