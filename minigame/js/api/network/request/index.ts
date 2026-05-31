/**
 * 发送请求
 * wx.request
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 发起一个 HTTP GET 请求 */
export function sendRequest() {
  const startTime = Date.now();
  wx.showLoading({ title: '请求中...', mask: true });
  wx.request({
    url: 'https://developers.weixin.qq.com/minigame/dev/api/',
    success(res: any) {
      wx.hideLoading();
      const dataStr = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      display.data({
        '数据包大小': `${dataStr.length} 字符`,
        '请求耗时': `${Date.now() - startTime} ms`,
      });
    },
    fail(err: any) {
      wx.hideLoading();
      wx.showModal({ title: '请求失败', content: err.errMsg || '请求失败', showCancel: false });
    },
  });
}
