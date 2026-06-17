/**
 * 客服消息
 * wx.openCustomerServiceConversation
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 打开客服会话 */
export function openCustomerService() {
  wx.openCustomerServiceConversation({
    sessionFrom: 'demo',
    success() {
    },
    fail(err: any) {
      display.text(`打开失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
