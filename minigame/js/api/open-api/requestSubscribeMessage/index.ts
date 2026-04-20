/**
 * 一次性订阅消息
 * wx.requestSubscribeMessage
 */

/** 请求订阅消息 */
export function requestSubscribeMessage() {
  wx.requestSubscribeMessage({
    tmplIds: ['模板ID_需要替换'],
    success(res: any) { console.log('订阅结果:', JSON.stringify(res)); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
