/**
 * 窗口
 * wx.setWindowSize / wx.onWindowResize / wx.offWindowResize
 * wx.onWindowStateChange / wx.offWindowStateChange
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/window/wx.onWindowResize.html
 *   https://developers.weixin.qq.com/minigame/dev/api/ui/window/wx.setWindowSize.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let resizeListener: any = null;
let stateListener: any = null;

/** 设置窗口大小 */
export function setWindowSize() {
  wx.setWindowSize({
    width: 400,
    height: 600,
    success() {
      display.text('窗口已设为 400x600');
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '设置失败',
          原因: err.errMsg,
        })
      );
    },
  } as any);
}

/** 监听窗口尺寸变化（横竖屏切换、PC 端拖拽窗口） */
export function onWindowResize() {
  resizeListener = (res: any) => {
    display.text(
      formatObj({
        事件: 'resize',
        windowWidth: String(res.windowWidth),
        windowHeight: String(res.windowHeight),
      })
    );
  };
  wx.onWindowResize(resizeListener);
  display.text('已注册 resize 监听');
}

/** 取消监听窗口尺寸变化 */
export function offWindowResize() {
  if (resizeListener) {
    wx.offWindowResize(resizeListener);
    resizeListener = null;
    display.text('已取消 resize 监听');
  } else {
    display.text('当前无监听，无需取消');
  }
}

/** 监听窗口状态变化（最大化/还原/最小化） */
export function onWindowStateChange() {
  if (typeof wx.onWindowStateChange !== 'function') {
    display.text('当前版本不支持 onWindowStateChange');
    return;
  }
  stateListener = (res: any) => {
    display.text(
      formatObj({
        事件: 'stateChange',
        state: res.state || '-',
      })
    );
  };
  wx.onWindowStateChange(stateListener);
  display.text('已注册 windowState 监听');
}

/** 取消监听窗口状态变化 */
export function offWindowStateChange() {
  if (stateListener) {
    wx.offWindowStateChange?.(stateListener);
    stateListener = null;
    display.text('已取消 windowState 监听');
  } else {
    display.text('当前无监听，无需取消');
  }
}

/** 当前窗口信息 */
export function getCurrentWindow() {
  const info: any = wx.getWindowInfo();
  display.text(
    formatObj({
      width: String(info.windowWidth),
      height: String(info.windowHeight),
      screenWidth: String(info.screenWidth),
      screenHeight: String(info.screenHeight),
      pixelRatio: String(info.pixelRatio),
    })
  );
}

export function onUnload() {
  if (resizeListener) {
    wx.offWindowResize(resizeListener);
    resizeListener = null;
  }
  if (stateListener) {
    wx.offWindowStateChange?.(stateListener);
    stateListener = null;
  }
}
