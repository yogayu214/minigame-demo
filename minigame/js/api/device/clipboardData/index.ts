/**
 * 剪贴板
 * wx.setClipboardData / wx.getClipboardData
 */

/** 复制文本到剪贴板 */
export function setClipboard() {
  wx.setClipboardData({
    data: 'Hello MiniGame!',
    success() {
      wx.showToast({ title: '已复制' });
    },
  });
}

/** 读取剪贴板内容 */
export function getClipboard() {
  wx.getClipboardData({
    success(res: any) {
      console.log('剪贴板内容:', res.data);
    },
  });
}
