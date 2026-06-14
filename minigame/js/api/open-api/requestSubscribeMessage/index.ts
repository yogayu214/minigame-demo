/**
 * 订阅消息
 * wx.requestSubscribeMessage / wx.requestSubscribeSystemMessage
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeSystemMessage.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 请求一次性订阅消息 */
export function requestSubscribeMessage() {
  wx.requestSubscribeMessage({
    tmplIds: ['模板ID_需要替换'],
    success(res: any) {
      const lines = Object.keys(res)
        .map((k) => `${k}: ${res[k]}`)
        .join('\n');
      display.text(`一次性订阅结果:\n${lines}`);
    },
    fail(err: any) {
      display.text(`一次性订阅失败: ${err.errMsg}`);
    },
  });
}

/** 请求永久订阅系统消息（好友互动提醒 / 排行榜超越提醒） */
export function requestSubscribeSystemMessage() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) {
      let tips = '永久订阅成功: ';
      if (res.SYS_MSG_TYPE_INTERACTIVE === 'accept') {
        tips += '好友互动提醒';
      }
      if (res.SYS_MSG_TYPE_RANK === 'accept') {
        if (tips !== '永久订阅成功: ') tips += '、';
        tips += '排行榜好友超越提醒';
      }
      display.text(tips);
    },
    fail(err: any) {
      display.text(`永久订阅失败: ${err.errMsg}`);
    },
  });
}
