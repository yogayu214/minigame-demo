/**
 * VKSession - 视觉算法套件
 * wx.isVKSupport / wx.createVKSession
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/visionkit/wx.createVKSession.html
 *
 * 注意：本分类已有更具体的 visionkit-basic / visionkit-basic-v2 / face-detect / plane-ar，
 * 这里仅演示版本检测和 session 创建/销毁的基础形态。
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 检测 VK 支持情况 */
export function checkVKSupport() {
  const v1 = wx.isVKSupport?.('v1') ?? false;
  const v2 = wx.isVKSupport?.('v2') ?? false;
  display.data({
    'isVKSupport(v1)': String(v1),
    'isVKSupport(v2)': String(v2),
  });
}

/** 创建 VK Session（v1） */
export function createSessionV1() {
  if (!wx.isVKSupport?.('v1')) {
    display.text('当前环境不支持 VK v1');
    return;
  }
  session = wx.createVKSession({ version: 'v1', track: { plane: { mode: 1 } } });
  session.start?.((errCode: number) => {
    display.text(errCode === 0 ? '✓ VK Session v1 已启动' : `✗ 启动失败: ${errCode}`);
  });
}

/** 销毁 Session */
export function destroySession() {
  if (session) {
    session.stop?.();
    session.destroy?.();
    session = null;
    display.text('✓ 已销毁 Session');
  }
}

export function onUnload() {
  destroySession();
}
