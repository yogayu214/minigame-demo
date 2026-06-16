/**
 * 人脸检测
 * wx.initFaceDetect / wx.faceDetect / wx.stopFaceDetect
 * 注意：需在真机上测试，模拟器不支持
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let inited = false;

/** 初始化人脸检测 */
export function initFaceDetect() {
  const tip =
    '⚠️ 此功能需要在真机上运行，且需要相机权限，\n' +
    '模拟器不支持。\n\n' +
    '接入流程：\n' +
    '1. 在 game.json 中配置 requiredBackgroundModes: ["camera"]\n' +
    '2. 在真机上调用 wx.initFaceDetect\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ai/facedetect/wx.initFaceDetect.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    (wx as any).initFaceDetect({
      success() {
        inited = true;
        display.text('initFaceDetect 成功\n请点击 faceDetect 检测');
      },
      fail(err: any) {
        display.text(`调用失败：${err?.errMsg || '请确认在真机上运行'}`);
      },
    });
  }, 2000);
}

/** 人脸检测（需先 initFaceDetect） */
export function faceDetect() {
  if (!inited) {
    display.text('请先点击 initFaceDetect 初始化');
    return;
  }
  (wx as any).faceDetect({
    success(res: any) {
      const count = res.faceInfo?.length || 0;
      let info = `faceDetect 检测到 ${count} 张人脸`;
      if (res.faceInfo && res.faceInfo.length > 0) {
        const f = res.faceInfo[0];
        info += `\nx: ${f.x}, y: ${f.y}\nwidth: ${f.width}, height: ${f.height}\nangle: ${f.angle ?? '无'}`;
      }
      display.text(info);
    },
    fail(err: any) {
      display.text(`faceDetect 失败\n${err?.errMsg || '未知错误'}`);
    },
    complete() {
      // 单次检测完成
    },
  });
}

/** 停止人脸检测 */
export function stopFaceDetect() {
  (wx as any).stopFaceDetect({
    success() {
      inited = false;
      display.text('stopFaceDetect 成功\n人脸检测已停止');
    },
    fail(err: any) {
      display.text(`stopFaceDetect 失败\n${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 页面销毁时清理 */
export function onUnload() {
  if (inited && typeof (wx as any).stopFaceDetect === 'function') {
    (wx as any).stopFaceDetect({});
    inited = false;
  }
}
