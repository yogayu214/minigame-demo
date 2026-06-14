/**
 * WebSocket
 * wx.connectSocket / wx.sendSocketMessage / wx.closeSocket
 * wx.onSocketOpen / wx.onSocketClose / wx.onSocketError / wx.onSocketMessage
 * SocketTask
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/network/websocket/wx.connectSocket.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let socketTask: any = null;
let onOpen: any = null;
let onClose: any = null;
let onError: any = null;
let onMessage: any = null;

/** 连接 WebSocket（使用 SocketTask） */
export function connectSocket() {
  if (socketTask) {
    display.text('请先断开当前连接');
    return;
  }

  const url = '';
  if (!url) {
    display.text('请下载 Demo 并填入对应参数即可查看效果');
    return;
  }

  socketTask = wx.connectSocket({
    url,
    fail(err: any) {
      display.text(formatObj({ 状态: '连接失败', 原因: err.errMsg }));
      socketTask = null;
    },
  });

  onOpen = () => {
    display.text('WebSocket 已连接');
  };
  onClose = () => {
    display.text('WebSocket 已关闭');
    socketTask = null;
  };
  onError = (err: any) => {
    display.text(
      formatObj({
        事件: 'onError',
        原因: err.errMsg,
      })
    );
    socketTask = null;
  };
  onMessage = (res: any) => {
    display.text(
      formatObj({
        事件: 'onMessage',
        data: String(res.data).slice(0, 100),
      })
    );
  };

  socketTask.onOpen(onOpen);
  socketTask.onClose(onClose);
  socketTask.onError(onError);
  socketTask.onMessage(onMessage);

  display.text('连接已发起...');
}

/** 发送消息（优先使用 SocketTask） */
export function sendMessage() {
  const msg = 'Hello, MiniGame!';
  if (socketTask) {
    socketTask.send({
      data: msg,
      success() {
        display.text(`已发送：${msg}`);
      },
      fail(err: any) {
        display.text(
          formatObj({
            状态: '发送失败',
            原因: err.errMsg,
          })
        );
      },
    });
  } else {
    wx.sendSocketMessage({
      data: msg,
      success() {
        display.text(`已发送：${msg}`);
      },
      fail(err: any) {
        display.text(`发送失败：${err.errMsg}`);
      },
    });
  }
}

/** 断开连接（优先使用 SocketTask） */
export function closeSocket() {
  if (socketTask) {
    socketTask.close();
    socketTask = null;
  } else {
    wx.closeSocket();
  }
  display.text('已断开');
}

export function onUnload() {
  try {
    if (socketTask) {
      socketTask.close();
      socketTask = null;
    }
  } catch (e) {
    console.error('close error:', e);
  }
  onOpen = onClose = onError = onMessage = null;
}
