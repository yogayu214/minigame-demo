/**
 * 上传文件
 * wx.uploadFile（配合 wx.chooseImage）
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let selectedFile = '';

/** 选择本地图片 */
export function chooseImage() {
  wx.chooseImage({
    count: 1,
    success(res: any) {
      selectedFile = res.tempFilePaths[0];
      display.image(selectedFile);
    },
    fail() { wx.showToast({ title: '已取消', icon: 'none' }); },
  });
}

/** 上传选中的图片 */
export function uploadFile() {
  if (!selectedFile) {
    wx.showToast({ title: '请先选择图片', icon: 'none' });
    return;
  }
  wx.showLoading({ title: '上传中...', mask: true });
  wx.uploadFile({
    url: 'https://httpbin.org/post',
    filePath: selectedFile,
    name: 'file',
    success(res: any) {
      wx.hideLoading();
      display.data({
        '状态': '上传成功',
        'statusCode': String(res.statusCode),
        '文件': selectedFile,
      });
    },
    fail(err: any) {
      wx.hideLoading();
      wx.showModal({ title: '上传失败', content: err.errMsg || '上传失败', showCancel: false });
    },
  });
}
