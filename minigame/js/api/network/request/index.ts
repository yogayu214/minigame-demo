/**
 * 发送请求
 * wx.request / RequestTask
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/network/request/wx.request.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let requestTask: any = null;

/** 发起一个 HTTP GET 请求 */
export function sendRequest() {
  const startTime = Date.now();
  wx.showLoading({ title: '请求中...', mask: true });
  requestTask = wx.request({
    url: 'https://developers.weixin.qq.com/minigame/dev/api/',
    success(res: any) {
      wx.hideLoading();
      const dataStr =
        typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      display.text(
        formatObj({
          数据包大小: `${dataStr.length} 字符`,
          请求耗时: `${Date.now() - startTime} ms`,
        })
      );
    },
    fail(err: any) {
      wx.hideLoading();
      display.text(
        formatObj({
          状态: '请求失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 中断请求（RequestTask.abort） */
export function abortRequest() {
  if (requestTask) {
    requestTask.abort();
    requestTask = null;
    display.text('请求已中断');
  } else {
    display.text('当前无请求，无需中断');
  }
}

/** 监听请求头响应（RequestTask.onHeadersReceived） */
export function onHeadersReceived() {
  if (!requestTask) {
    display.text('请先发起请求');
    return;
  }
  requestTask.onHeadersReceived((res: any) => {
    display.text(
      formatObj({
        事件: 'onHeadersReceived',
        header: JSON.stringify(res.header || {}).slice(0, 100),
      })
    );
  });
  display.text('已注册 headersReceived 监听');
}
