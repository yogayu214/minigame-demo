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
      display.data({ 'Copy': lastCopied, 'Paste': '（点击粘贴按钮）' });
    },
  });
}

/** 读取剪贴板内容 */
export function getClipboard() {
  wx.getClipboardData({
    success(res: any) {
      display.data({ 'Copy': lastCopied || '（无）', 'Paste': res.data });
    },
  });
}
