/**
 * 状态栏
 * wx.setStatusBarStyle
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/status-bar/wx.setStatusBarStyle.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

/** 设置状态栏为深色样式（白字） */
export function setStatusBarDark() {
  wx.setStatusBarStyle({
    style: 'black',
    success() {
      display.text('状态栏已设为深色（白字）');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '设置失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}

/** 设置状态栏为浅色样式（黑字） */
export function setStatusBarLight() {
  wx.setStatusBarStyle({
    style: 'white',
    success() {
      display.text('状态栏已设为浅色（黑字）');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '设置失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}
