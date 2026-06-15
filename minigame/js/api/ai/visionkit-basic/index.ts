/**
 * VisionKit 基础
 * VisionKit v1 - 平面追踪
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 创建 VisionKit v1 会话 */
export function createVKSession() {
  const tip =
    '⚠️ 此功能需要在真机上运行，且需要相机权限，\n' +
    '模拟器不支持。\n\n' +
    '接入流程：\n' +
    '1. 在 game.json 中配置 requiredBackgroundModes: ["camera"]\n' +
    '2. 在真机上调用 wx.createVKSession\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    session = wx.createVKSession({
      track: { plane: { mode: 3 } },
      version: 'v1',
    });
    session.start((err: any) => {
      if (err) {
        display.text(`调用失败：${err}`);
        return;
      }
      display.text('VisionKit v1 已启动');
    });
  }, 2000);
}

/** 销毁会话 */
export function destroySession() {
  if (session) {
    if (typeof session.stop === 'function') session.stop();
    if (typeof session.destroy === 'function') session.destroy();
    session = null;
    display.text('VisionKit v1 已销毁');
  }
}

export function onUnload() {
  destroySession();
}
