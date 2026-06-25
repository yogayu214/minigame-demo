/**
 * VisionKit 基础（AR 可视化版本）
 *
 * 对齐旧版 minigame-demo/AR/visionkit-basic：
 *   使用 VKSession v1 的 plane 追踪模式，
 *   触碰屏幕任意位置进行 hitTest，命中平面则放置跳舞的 3D 机器人。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

export const arConfig: ARModuleConfig = {
  title: 'VisionKit基础',
  tip: '提示：触碰屏幕任意点,\n可在对应位置生成示例的机器小人',
  buttonName: null,
  mode: 'default',
  vkConfig: {
    track: {
      plane: { mode: 3 },
    },
    version: 'v1',
  },
};
