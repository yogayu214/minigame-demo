/**
 * WebSocket
 * wx.connectSocket / wx.sendSocketMessage / wx.closeSocket
 */

/** 连接 WebSocket */
export function connectSocket() {
  wx.onSocketOpen(() => { console.log('连接已建立'); });
  wx.onSocketClose(() => { console.log('连接已关闭'); });
  wx.onSocketError((err: any) => { console.log('连接错误:', err.errMsg); });
  wx.onSocketMessage((res: any) => { console.log('收到消息:', res.data); });
  wx.connectSocket({ url: 'wss://echo.websocket.org' });
}

/** 发送消息 */
export function sendMessage() {
  wx.sendSocketMessage({
    data: 'Hello, MiniGame!',
    success() { wx.showToast({ title: '已发送' }); },
    fail(err: any) { console.log('发送失败:', err.errMsg); },
  });
}

/** 断开连接 */
export function closeSocket() {
  wx.closeSocket();
  wx.showToast({ title: '已断开' });
}

/** 页面销毁时清理 */
export function onUnload() {
  try { wx.closeSocket(); } catch (e) {}
}
