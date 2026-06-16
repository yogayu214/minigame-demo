/**
 * TCP Socket
 * wx.createTCPSocket / TCPSocket
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/network/tcp/wx.createTCPSocket.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let socket: any = null;

/** 创建 TCP socket 并连接 */
export function connect() {
  const address = '';
  if (!address) {
    display.text('请下载 Demo 并填入对应参数即可查看效果');
    return;
  }
  socket = wx.createTCPSocket();
  socket.onConnect((res: any) =>
    display.text(
      formatObj({
        事件: 'connect',
        详情: JSON.stringify(res),
      })
    )
  );
  socket.onMessage((res: any) => {
    const view = new Uint8Array(res.message);
    display.text(
      formatObj({
        事件: 'message',
        length: String(view.byteLength),
        preview: String.fromCharCode.apply(null, Array.from(view).slice(0, 50)),
      })
    );
  });
  socket.onClose(() => display.text('连接关闭'));
  socket.onError((err: any) =>
    display.text(
      formatObj({
        状态: '错误',
        原因: err?.errMsg || '未知错误',
      })
    )
  );

  socket.connect({ address, port: 80 });
  display.text('connect 已发起...');
}

/** 发送一段测试消息 */
export function sendData() {
  if (!socket) {
    display.text('请先 connect');
    return;
  }
  const text = 'Hello TCP Echo Server!';
  socket.write(text);
  display.text(`已发送：${text}`);
}

/** 关闭 */
export function close() {
  if (socket) {
    socket.close();
    socket = null;
    display.text('已关闭');
  }
}

export function onUnload() {
  close();
}
