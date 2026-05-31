/**
 * TCP Socket
 * wx.createTCPSocket
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/network/tcp/wx.createTCPSocket.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let socket: any = null;

/** 创建 TCP socket 并连接 example.com:80 */
export function connect() {
  socket = wx.createTCPSocket();
  socket.onConnect((res: any) => display.data({ 事件: 'connect', 详情: JSON.stringify(res) }));
  socket.onMessage((res: any) => {
    const view = new Uint8Array(res.message);
    display.data({
      事件: 'message',
      length: String(view.byteLength),
      preview: String.fromCharCode.apply(null, Array.from(view).slice(0, 50)),
    });
  });
  socket.onClose(() => display.text('⏹ 连接关闭'));
  socket.onError((err: any) => display.text(`✗ 错误: ${err.errMsg}`));

  socket.connect({ address: 'example.com', port: 80 });
  display.text('connect 已发起...');
}

/** 发送一段 HTTP HEAD 请求测试 */
export function sendData() {
  if (!socket) {
    display.text('请先 connect');
    return;
  }
  const text = 'HEAD / HTTP/1.0\r\nHost: example.com\r\n\r\n';
  socket.write(text);
  display.text('已发送 HTTP HEAD 请求');
}

/** 关闭 */
export function close() {
  if (socket) {
    socket.close();
    socket = null;
    display.text('✓ 已关闭');
  }
}

export function onUnload() {
  close();
}
