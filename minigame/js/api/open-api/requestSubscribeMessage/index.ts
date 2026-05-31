/**
 * 一次性订阅消息
 * wx.requestSubscribeMessage
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 请求订阅消息 */
export function requestSubscribeMessage() {
  wx.requestSubscribeMessage({
    tmplIds: ['模板ID_需要替换'],
    success(res: any) {
      display.data(res as any);
    },
    fail(err: any) {
      wx.showModal({ title: '订阅失败', content: err.errMsg || String(err), showCancel: false });
    },
  });
}
