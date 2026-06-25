/**
 * 水平面 AR（AR 可视化版本）
 *
 * 对齐旧版 minigame-demo/AR/plane-ar：
 *   使用 VKSession 的 plane 追踪模式，
 *   在识别到的水平面上显示 reticle 光标，
 *   触碰屏幕可在光标位置放置跳舞的 3D 机器人模型。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

export const arConfig: ARModuleConfig = {
  title: '水平面AR',
  tip: '提示：触碰屏幕任意点,\n可在对应位置生成示例的机器小人,\n其中光标标记指示的是水平面',
  buttonName: null,
  mode: 'planeAR',
  vkConfig: {
    track: {
      plane: { mode: 3 },
    },
    version: 'v1',
  },
};
