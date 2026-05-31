/**
 * 图片选择与预览
 * wx.chooseImage / wx.chooseMedia / wx.chooseMessageFile /
 * wx.previewImage / wx.previewMedia /
 * wx.compressImage / wx.saveImageToPhotosAlbum
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.chooseImage.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let lastImagePath = '';

/** 选择图片（相机/相册） */
export function chooseImage() {
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res: any) {
      lastImagePath = res.tempFilePaths?.[0] || '';
      display.data({
        数量: String(res.tempFiles?.length || 0),
        路径: lastImagePath.slice(-30),
      });
    },
    fail(err: any) {
      display.text(`选择失败：${err.errMsg}`);
    },
  });
}

/** 选择多媒体（图片/视频） */
export function chooseMedia() {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image', 'video'],
    sourceType: ['album', 'camera'],
    success(res: any) {
      const f = res.tempFiles?.[0];
      lastImagePath = f?.tempFilePath || '';
      display.data({
        type: res.type,
        size: f ? `${f.size} B` : '-',
        路径: lastImagePath.slice(-30),
      });
    },
    fail(err: any) {
      display.text(`选择失败：${err.errMsg}`);
    },
  });
}

/** 从聊天会话选择文件 */
export function chooseMessageFile() {
  wx.chooseMessageFile({
    count: 1,
    type: 'image',
    success(res: any) {
      const f = res.tempFiles?.[0];
      lastImagePath = f?.path || '';
      display.data({
        name: f?.name || '-',
        size: f ? `${f.size} B` : '-',
        路径: lastImagePath.slice(-30),
      });
    },
    fail(err: any) {
      display.text(`选择失败：${err.errMsg}`);
    },
  });
}

/** 预览上一张图 */
export function previewImage() {
  if (!lastImagePath) {
    display.text('请先选择一张图');
    return;
  }
  wx.previewImage({
    urls: [lastImagePath],
    current: lastImagePath,
    success() { display.text('✓ 预览中'); },
    fail(err: any) { display.text(`预览失败：${err.errMsg}`); },
  });
}

/** 预览图片/视频媒体 */
export function previewMedia() {
  if (!lastImagePath) {
    display.text('请先选择一张图/视频');
    return;
  }
  wx.previewMedia({
    sources: [{ url: lastImagePath, type: 'image' }],
    success() { display.text('✓ 预览中'); },
    fail(err: any) { display.text(`预览失败：${err.errMsg}`); },
  });
}

/** 压缩上一张图 */
export function compressImage() {
  if (!lastImagePath) {
    display.text('请先选择一张图');
    return;
  }
  wx.compressImage({
    src: lastImagePath,
    quality: 50,
    success(res: any) {
      display.data({ 状态: '✓ 已压缩', 新路径: res.tempFilePath.slice(-30) });
    },
    fail(err: any) {
      display.text(`压缩失败：${err.errMsg}`);
    },
  });
}

/** 保存到相册 */
export function saveImageToPhotosAlbum() {
  if (!lastImagePath) {
    display.text('请先选择一张图');
    return;
  }
  wx.saveImageToPhotosAlbum({
    filePath: lastImagePath,
    success() { display.text('✓ 已保存到相册'); },
    fail(err: any) { display.text(`保存失败：${err.errMsg}`); },
  });
}
