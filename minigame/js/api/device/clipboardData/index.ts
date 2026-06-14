/**
 * 剪贴板
 * wx.setClipboardData / wx.getClipboardData
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let lastCopied = '';

/** 复制文本到剪贴板 */
export function setClipboard() {
  lastCopied = 'Hello MiniGame! ' + new Date().toLocaleTimeString();
  wx.setClipboardData({
    data: lastCopied,
    success() {
      display.text(`Copy: ${lastCopied}\nPaste: （点击粘贴按钮）`);
    },
    fail(err: any) {
      display.text(
        `复制失败：${err?.errMsg || '未知错误'}\n待复制: ${lastCopied}`
      );
    },
  });
}

/** 读取剪贴板内容 */
export function getClipboard() {
  wx.getClipboardData({
    success(res: any) {
      display.text(`Copy: ${lastCopied || '（无）'}\nPaste: ${res.data}`);
    },
    fail(err: any) {
      display.text(`粘贴失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
