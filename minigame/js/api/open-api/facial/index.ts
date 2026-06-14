/**
 * 人脸检测
 * wx.requestFacialRecognition / wx.requestFacialVerify /
 * wx.checkIsSupportFacialRecognition
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.requestFacialRecognition.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.requestFacialVerify.html
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/facial/wx.checkIsSupportFacialRecognition.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 检查是否支持人脸识别 */
export function checkIsSupportFacialRecognition() {
  const res: any = wx.checkIsSupportFacialRecognition?.();
  if (res) {
    display.text(`checkIsSupportFacialRecognition: ${JSON.stringify(res)}`);
  } else {
    display.text('当前版本不支持 checkIsSupportFacialRecognition');
  }
}

/** 请求人脸识别认证 */
export function requestFacialRecognition() {
  wx.requestFacialRecognition({
    name: '', // 请填写真实姓名
    idCardNumber: '', // 请填写身份证号
    success(res: any) {
      display.text(`人脸识别结果: ${res.errMsg}`);
    },
    fail(err: any) {
      display.text(`人脸识别失败: ${err.errMsg}`);
    },
  } as any);
}

/** 请求人脸核验 */
export function requestFacialVerify() {
  wx.requestFacialVerify({
    name: '', // 请填写真实姓名
    idCardNumber: '', // 请填写身份证号
    success(res: any) {
      display.text(`人脸核验结果: ${res.errMsg}`);
    },
    fail(err: any) {
      display.text(`人脸核验失败: ${err.errMsg}`);
    },
  } as any);
}
