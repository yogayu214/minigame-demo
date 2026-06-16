/**
 * AI 推理环境
 * wx.getInferenceEnvInfo / wx.createInferenceSession
 * 注意：需在真机上测试
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 查询设备 AI 推理能力（GPU/NPU 等） */
export function getInferenceEnvInfo() {
  const tip =
    '⚠️ 此功能需要在真机上运行，模拟器不支持，\n' +
    'Demo 中调用将失败。\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/inference/wx.getInferenceEnvInfo.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    wx.getInferenceEnvInfo({
      success(res: any) {
        display.text(
          `version: ${res.ver || '-'}\n支持GPU: ${res.gpuSupport != null ? res.gpuSupport : '-'}\n支持NPU: ${res.npuSupport != null ? res.npuSupport : '-'}\n最大模型大小: ${res.maxModelSize || '-'}`
        );
      },
      fail(err: any) {
        display.text(`调用失败：${err?.errMsg || '未知错误'}`);
      },
    });
  }, 2000);
}

/** 创建推理 session（需先准备 .onnx 模型） */
export function createInferenceSession() {
  const tip =
    '⚠️ 此功能需要在真机上运行，且需准备 .onnx 模型文件，\n' +
    'Demo 中调用将失败。\n\n' +
    '接入流程：\n' +
    '1. 准备 onnx 模型文件放入小游戏包内\n' +
    '2. 在真机上调用 wx.createInferenceSession\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/inference/wx.createInferenceSession.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    if (typeof (wx as any).createInferenceSession !== 'function') {
      display.text('当前环境不支持 createInferenceSession');
      return;
    }
    session = (wx as any).createInferenceSession({
      model: 'inference/demo.onnx',
      precisionLevel: 4,
      allowQuantize: false,
    });

    if (!session) {
      display.text('创建推理 session 失败');
      return;
    }

    if (session.onLoad) {
      session.onLoad(() => {
        display.text('推理 session 已加载');
      });
    }
    if (session.onError) {
      session.onError((err: any) => {
        display.text(`调用失败：${err?.errMsg || err?.message || '未知错误'}`);
      });
    }
  }, 2000);
}

/** 销毁推理 session */
export function destroySession() {
  if (session) {
    if (session.destroy) {
      session.destroy();
    }
    session = null;
    display.text('已销毁 session');
  }
}

export function onUnload() {
  destroySession();
}
