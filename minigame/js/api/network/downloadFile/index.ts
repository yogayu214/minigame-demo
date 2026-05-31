/**
 * 下载文件
 * wx.downloadFile
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 下载远程图片 */
export function downloadFile() {
  wx.showLoading({ title: '下载中...', mask: true });
  wx.downloadFile({
    url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/logo.png',
    success(res: any) {
      wx.hideLoading();
      display.image(res.tempFilePath);
    },
    fail(err: any) {
      wx.hideLoading();
      wx.showModal({ title: '下载失败', content: err.errMsg || '下载失败', showCancel: false });
    },
  });
}
