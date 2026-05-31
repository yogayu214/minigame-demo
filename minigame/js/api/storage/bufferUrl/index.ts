/**
 * BufferURL（把内存 buffer 当作 URL 喂给 image / audio 等）
 * wx.createBufferURL / wx.revokeBufferURL
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/storage/wx.createBufferURL.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SAMPLE_URL = 'https://res.wx.qq.com/wxa-game/dev_doc/images/cover.jpg';
let bufUrl = '';

/** 下载图片到 ArrayBuffer，再用 createBufferURL 包装成 URL */
export function createFromImage() {
  display.text('下载图片中...');
  wx.request({
    url: SAMPLE_URL,
    responseType: 'arraybuffer',
    success(res: any) {
      if (typeof wx.createBufferURL !== 'function') {
        display.text('当前版本不支持 createBufferURL');
        return;
      }
      bufUrl = wx.createBufferURL(res.data);
      display.data({
        size: `${res.data.byteLength} B`,
        bufferUrl: bufUrl.slice(0, 60) + '...',
      });
    },
    fail(err: any) {
      display.text(`下载失败：${err.errMsg}`);
    },
  });
}

/** 用 BufferURL 预览图片 */
export function previewBufferUrl() {
  if (!bufUrl) {
    display.text('请先 createFromImage');
    return;
  }
  wx.previewImage({ urls: [bufUrl] });
  display.text('✓ 预览中');
}

/** 释放 BufferURL */
export function revoke() {
  if (bufUrl && typeof wx.revokeBufferURL === 'function') {
    wx.revokeBufferURL(bufUrl);
    bufUrl = '';
    display.text('✓ 已 revoke');
  }
}

export function onUnload() {
  revoke();
}
