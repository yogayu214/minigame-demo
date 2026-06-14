/**
 * 复制链接监听
 * wx.onCopyUrl / wx.offCopyUrl
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onCopyUrl.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offCopyUrl.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let copyUrlFn: any = null;

/** 监听用户复制链接 */
export function onCopyUrl() {
  copyUrlFn = (res: any) => {
    display.text(
      formatObj({
        事件: 'onCopyUrl',
        url: res.url || '-',
      })
    );
  };
  wx.onCopyUrl(copyUrlFn);
  display.text('已监听复制链接事件');
}

/** 取消监听复制链接 */
export function offCopyUrl() {
  if (copyUrlFn) {
    (wx as any).offCopyUrl(copyUrlFn);
    copyUrlFn = null;
    display.text('已取消监听复制链接');
  } else {
    display.text('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (copyUrlFn) {
    (wx as any).offCopyUrl(copyUrlFn);
    copyUrlFn = null;
  }
}
