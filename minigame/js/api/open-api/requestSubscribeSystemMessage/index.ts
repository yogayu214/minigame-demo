/**
 * 永久订阅（系统消息）
 * wx.requestSubscribeSystemMessage
 */

/** 请求永久订阅系统消息 */
export function requestSubscribeSystemMessage() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) { console.log('订阅结果:', JSON.stringify(res)); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
