/**
 * 复制链接
 * wx.onCopyUrl / wx.offCopyUrl
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onCopyUrl.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offCopyUrl.html
 */

import { createDisplay } from '../../../libs/display-slot';
const display = createDisplay();
export const setDisplay = display.setter;

let copyUrlFn: any = null;

/** 基础用法：同步返回分享参数 */
export function onCopyUrl() {
  copyUrlFn = () => {
    return { query: 'a=1&b=2' };
  };
  wx.onCopyUrl(copyUrlFn);
  wx.showToast({ title: '已设置复制链接回调', icon: 'none' });
}

/** 使用 promise 异步返回分享参数 */
export function onCopyUrlAsync() {
  copyUrlFn = () => {
    return {
      query: 'a=1',
      title: '默认标题',
      promise: new Promise((resolve) => {
        setTimeout(() => {
          resolve({ query: 'a=1&b=2&async=true', title: '异步标题' });
        }, 500);
      }),
    };
  };
  wx.onCopyUrl(copyUrlFn);
  wx.showToast({ title: '已设置异步复制链接回调', icon: 'none' });
}

/** 取消绑定复制链接 */
export function offCopyUrl() {
  if (copyUrlFn) {
    wx.offCopyUrl();
    copyUrlFn = null;
    wx.showToast({ title: '已取消复制链接回调', icon: 'none' });
  } else {
    wx.showToast({ title: '当前无回调，无需取消', icon: 'none' });
  }
}

export function onUnload() {
  if (copyUrlFn) {
    wx.offCopyUrl();
    copyUrlFn = null;
  }
}
