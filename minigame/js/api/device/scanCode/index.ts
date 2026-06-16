/**
 * 扫码
 * wx.scanCode
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/scan/wx.scanCode.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 调起扫码（相机 + 相册皆可） */
export function scanCode() {
  wx.scanCode({
    success(res: any) {
      display.text(
        `result: ${res.result}\nscanType: ${res.scanType}\ncharSet: ${res.charSet || '-'}`
      );
    },
    fail(err: any) {
      display.text(`扫码失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 仅相机扫码（onlyFromCamera:true） */
export function scanCodeCameraOnly() {
  wx.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode', 'barCode'],
    success(res: any) {
      display.text(`result: ${res.result}\nscanType: ${res.scanType}`);
    },
    fail(err: any) {
      display.text(`扫码失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
