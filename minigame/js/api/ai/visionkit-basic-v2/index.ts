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
  const tip =
    '⚠️ 此功能需要在真机上运行，且需要相机权限，\n' +
    '模拟器不支持\n\n' +
    '接入流程：\n' +
    '1. 在 game.json 中配置 requiredBackgroundModes: ["camera"]\n' +
    '2. 在真机上调用 wx.createVKSession 并指定 version: "v2"\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    if (typeof wx.createVKSession !== 'function') {
      display.text('当前环境不支持 createVKSession');
      return;
    }
    session = wx.createVKSession({
      track: { plane: { mode: 3 } },
      version: 'v2',
    });

    if (!session) {
      display.text('创建 VKSession 失败');
      return;
    }

    session.start((err: any) => {
      if (err) {
        display.text(`调用失败：${err}`);
        return;
      }
      display.text('VisionKit v2 已启动');
    });
  }, 2000);
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
