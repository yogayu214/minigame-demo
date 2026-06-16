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
  // ★ 请先在小游戏后台获取模板 ID 并替换下方占位符，否则调用会报错
  const tmplIds = ['模板ID_需要替换'];
  if (tmplIds[0] === '模板ID_需要替换') {
    display.text('请先在小游戏后台「订阅消息」页面获取模板 ID，\n替换代码中的「模板ID_需要替换」后再试。\n2s 后仍将调用 API 演示流程...');
    setTimeout(() => {
      wx.requestSubscribeMessage({
        tmplIds,
        success(res: any) {
          const lines = Object.keys(res)
            .map((k) => `${k}: ${res[k]}`)
            .join('\n');
          display.text(`一次性订阅结果:\n${lines}`);
        },
        fail(err: any) {
          display.text(`一次性订阅失败: ${err?.errMsg || '未知错误'}`);
        },
      });
    }, 2000);
    return;
  }
  wx.requestSubscribeMessage({
    tmplIds,
    success(res: any) {
      const lines = Object.keys(res)
        .map((k) => `${k}: ${res[k]}`)
        .join('\n');
      display.text(`一次性订阅结果:\n${lines}`);
    },
    fail(err: any) {
      display.text(`一次性订阅失败: ${err?.errMsg || '未知错误'}`);
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
      display.text(`永久订阅失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
