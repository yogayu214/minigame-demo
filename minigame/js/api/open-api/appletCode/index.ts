/**
 * 二维码
 * wx.cloud 获取小程序码
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 通过云函数获取小程序码 */
export function getAppletCode() {
  wx.showLoading({ title: '获取中...', mask: true });
  wx.cloud.callFunction({
    name: 'getQRCode',
    success(res: any) {
      wx.hideLoading();
      const result = res.result;
      if (typeof result === 'string' && result.startsWith('data:image')) {
        saveBase64AndShow(result);
      } else if (result?.base64) {
        saveBase64AndShow(result.base64);
      } else if (result?.tempFilePath) {
        display.image(result.tempFilePath);
      } else {
        wx.showModal({ title: '获取成功（原始数据）', content: JSON.stringify(result, null, 2), showCancel: false });
      }
    },
    fail(err: any) {
      wx.hideLoading();
      wx.showModal({ title: '获取失败', content: err.errMsg || '获取失败', showCancel: false });
    },
  });
}

function saveBase64AndShow(base64: string) {
  const data = base64.replace(/^data:image\/\w+;base64,/, '');
  const filePath = wx.env.USER_DATA_PATH + '/qrcode_' + Date.now() + '.png';
  wx.getFileSystemManager().writeFile({
    filePath,
    data,
    encoding: 'base64',
    success() { display.image(filePath); },
    fail(err: any) {
      wx.showModal({ title: '保存二维码失败', content: err.errMsg, showCancel: false });
    },
  });
}
