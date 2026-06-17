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
      wx.showToast({ title: `已复制: ${lastCopied}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `复制失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}

/** 读取剪贴板内容 */
export function getClipboard() {
  wx.getClipboardData({
    success(res: any) {
      wx.showToast({ title: `粘贴内容: ${res?.data ?? '（空）'}`, icon: 'none' });
    },
    fail(err: any) {
      wx.showToast({ title: `粘贴失败：${err?.errMsg || '未知错误'}`, icon: 'none' });
    },
  });
}
