/**
 * WebSocket
 * wx.connectSocket / wx.sendSocketMessage / wx.closeSocket
 */

let onOpen: any = null;
let onClose: any = null;
let onError: any = null;
let onMessage: any = null;

/** 连接 WebSocket */
export function connectSocket() {
  onOpen = () => { console.log('连接已建立'); wx.showToast({ title: '已连接' }); };
  onClose = () => { console.log('连接已关闭'); };
  onError = (err: any) => { console.log('连接错误:', err.errMsg); };
  onMessage = (res: any) => { console.log('收到消息:', res.data); };

  wx.onSocketOpen(onOpen);
  wx.onSocketClose(onClose);
  wx.onSocketError(onError);
  wx.onSocketMessage(onMessage);
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

export function onUnload() {
  try { wx.closeSocket(); } catch (e) {}
  if (onOpen) wx.offSocketOpen(onOpen);
  if (onClose) wx.offSocketClose(onClose);
  if (onError) wx.offSocketError(onError);
  if (onMessage) wx.offSocketMessage(onMessage);
  onOpen = onClose = onError = onMessage = null;
}
