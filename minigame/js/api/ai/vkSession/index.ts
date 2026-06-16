/**
 * VKSession - 视觉算法套件
 * wx.isVKSupport / wx.createVKSession
 * 注意：本分类已有更具体的 visionkit-basic / visionkit-basic-v2 / face-detect / plane-ar，
 * 这里仅演示版本检测和 session 创建/销毁的基础形态。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 检测 VK 支持情况 */
export function checkVKSupport() {
  const tip =
    '⚠️ 此功能需要在真机上运行，模拟器不支持，\n' +
    'Demo 中调用将返回不支持。\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.isVKSupport.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    const v1 =
      (typeof wx.isVKSupport === 'function' && wx.isVKSupport('v1')) || false;
    const v2 =
      (typeof wx.isVKSupport === 'function' && wx.isVKSupport('v2')) || false;
    display.text(`isVKSupport(v1): ${v1}\nisVKSupport(v2): ${v2}`);
  }, 2000);
}

/** 创建 VK Session（v1） */
export function createSessionV1() {
  const tip =
    '⚠️ 此功能需要在真机上运行，且需要相机权限，\n' +
    '模拟器不支持，Demo 中调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 在 game.json 中配置 requiredBackgroundModes: ["camera"]\n' +
    '2. 在真机上调用 wx.createVKSession\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    if (!(typeof wx.isVKSupport === 'function' && wx.isVKSupport('v1'))) {
      display.text('调用失败：当前环境不支持 VK v1');
      return;
    }
    session = wx.createVKSession({
      version: 'v1',
      track: { plane: { mode: 1 } },
    });

    if (!session) {
      display.text('创建 VKSession 失败');
      return;
    }

    if (typeof session.start === 'function') {
      session.start((errCode: number) => {
        display.text(
          errCode === 0 ? 'VK Session v1 已启动' : `调用失败：${errCode}`
        );
      });
    }
  }, 2000);
}

/** 销毁 Session */
export function destroySession() {
  if (session) {
    if (typeof session.stop === 'function') session.stop();
    if (typeof session.destroy === 'function') session.destroy();
    session = null;
    display.text('已销毁 Session');
  }
}

export function onUnload() {
  destroySession();
}
