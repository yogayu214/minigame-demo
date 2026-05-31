/**
 * UDP Socket
 * wx.createUDPSocket
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/network/udp/wx.createUDPSocket.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let socket: any = null;
let boundPort = 0;

/** 创建并绑定一个随机端口 */
export function bind() {
  socket = wx.createUDPSocket();
  socket.onListening(() => display.text('▶ 已开始监听端口 ' + boundPort));
  socket.onMessage((res: any) => {
    const view = new Uint8Array(res.message);
    display.data({
      事件: 'message',
      来源: `${res.remoteInfo?.address}:${res.remoteInfo?.port}`,
      长度: String(view.byteLength),
    });
  });
  socket.onClose(() => display.text('⏹ 已关闭'));
  socket.onError((err: any) => display.text(`✗ 错误: ${err.errMsg}`));

  boundPort = socket.bind();
  display.data({ 状态: '✓ bound', port: String(boundPort) });
}

/** 向自己发送一条消息（loopback 测试） */
export function sendToSelf() {
  if (!socket || !boundPort) {
    display.text('请先 bind');
    return;
  }
  socket.send({
    address: '127.0.0.1',
    port: boundPort,
    message: 'hello UDP ' + Date.now(),
  });
  display.text('已向 127.0.0.1:' + boundPort + ' 发送数据');
}

/** 关闭 */
export function close() {
  if (socket) {
    socket.close();
    socket = null;
    boundPort = 0;
    display.text('✓ 已关闭 UDP socket');
  }
}

export function onUnload() {
  close();
}
