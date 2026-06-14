/**
 * 微信客服
 * wx.openCustomerServiceChat
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-service/wx.openCustomerServiceChat.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 打开微信客服会话 */
export function openCustomerService() {
  wx.openCustomerServiceChat({
    // @ts-expect-error 微信官方API，extInfo属性在类型定义中缺失
    extInfo: { corpId: '请填写企业ID', url: '请填写客服URL' },
    showMessageCard: true,
    success() {
      display.text('已打开微信客服会话');
    },
    fail(err: any) {
      display.text(`打开失败：${err.errMsg}`);
    },
  });
}
