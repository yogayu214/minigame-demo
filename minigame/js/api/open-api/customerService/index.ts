/**
 * 客服
 * wx.openCustomerServiceConversation
 */

/** 打开客服会话 */
export function openCustomerService() {
  wx.openCustomerServiceConversation({
    success() { console.log('客服会话已打开'); },
    fail(err: any) { console.log('打开失败:', err.errMsg); },
  });
}
