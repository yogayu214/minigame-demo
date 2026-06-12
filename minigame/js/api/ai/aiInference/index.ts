/**
 * AI 推理环境
 * wx.getInferenceEnvInfo / wx.createInferenceSession
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/ai/inference/wx.getInferenceEnvInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let session: any = null;

/** 查询设备 AI 推理能力（GPU/NPU 等） */
export function getInferenceEnvInfo() {
  wx.getInferenceEnvInfo({
    success(res: any) {
      display.data({
        version: res.ver || '-',
        支持GPU: String(res.gpuSupport != null ? res.gpuSupport : '-'),
        支持NPU: String(res.npuSupport != null ? res.npuSupport : '-'),
        最大模型大小: res.maxModelSize ? `${res.maxModelSize}` : '-',
      });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}`);
    },
  });
}

/** 创建推理 session（需先准备 .onnx 模型） */
export function createInferenceSession() {
  session = (wx as any).createInferenceSession({
    model: 'inference/demo.onnx',  // 需放置 onnx 模型
    precisionLevel: 4,
    allowQuantize: false,
  });
  if (session.onLoad) {
    session.onLoad(() => {
      display.text('✓ 推理 session 已加载');
    });
  }
  if (session.onError) {
    session.onError((err: any) => {
      display.text(`✗ 加载失败：${err.errMsg || err.message}`);
    });
  }
  display.text('createInferenceSession 已调用，等待 onLoad...');
}

/** 销毁推理 session */
export function destroySession() {
  if (session) {
    if (session.destroy) {
      session.destroy();
    }
    session = null;
    display.text('✓ 已销毁 session');
  }
}

export function onUnload() {
  destroySession();
}
