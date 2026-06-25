/**
 * 实时人脸检测（AR 可视化版本）
 *
 * 对齐旧版 minigame-demo/AR/face-detect：
 *   使用 VKSession 的 face + plane 追踪模式，
 *   在摄像头画面中实时标记人脸位置（绿色关键点 + 红色边框）。
 *   支持前后摄像头切换。
 *
 * 微信 API: wx.createVKSession
 * 文档: developers.weixin.qq.com/minigame/dev/api/ai/visionkit/wx.createVKSession.html
 * 注意: 仅真机可用，需相机权限
 */

import type { ARModuleConfig } from '../../../libs/rich-configs/aiAr';

export const arConfig: ARModuleConfig = {
  title: '实时人脸检测',
  tip: '提示：将摄像头对准人脸,\n检测到的人脸将会被标记出识别框和面部标记点',
  buttonName: '切换为前置摄像头',
  mode: 'faceDetect',
  vkConfig: {
    track: {
      plane: { mode: 3 },
      face: { mode: 1 },
    },
    cameraPosition: 0,
    version: 'v1',
  },
};
