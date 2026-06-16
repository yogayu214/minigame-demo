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
  const res: any = (wx as any).checkIsSupportFacialRecognition?.();
  if (res) {
    display.text(`checkIsSupportFacialRecognition: ${JSON.stringify(res)}`);
  } else {
    display.text('当前版本不支持 checkIsSupportFacialRecognition');
  }
}

/** 请求人脸核验（verifyId 需从服务端获取） */
export function requestFacialVerify() {
  (wx as any).requestFacialVerify({
    verifyId: '',
    success(res: any) {
      display.text(`人脸核验结果: ${res.errMsg}`);
    },
    fail(err: any) {
      setTimeout(() => {
        display.text(`人脸核验失败: ${err.errMsg}\n提示: verifyId 需从服务端获取`);
      }, 2000);
    },
  });
}
