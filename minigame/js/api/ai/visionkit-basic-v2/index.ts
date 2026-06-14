/**
 * VisionKit 基础 v2
 * VisionKit v2 - 平面追踪
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 创建 VisionKit v2 会话 */
export function createVKSession() {
  session = wx.createVKSession({
    track: { plane: { mode: 3 } },
    version: 'v2',
  });
  display.text('VisionKit v2 创建中...');
  session.start((err: any) => {
    if (err) {
      display.text(`VK session 启动失败: ${err}`);
      return;
    }
    display.text('VisionKit v2 已启动');
  });
}

/** 销毁会话 */
export function destroySession() {
  if (session) {
    if (typeof session.stop === 'function') session.stop();
    if (typeof session.destroy === 'function') session.destroy();
    session = null;
    display.text('VisionKit v2 已销毁');
  }
}

export function onUnload() {
  destroySession();
}
