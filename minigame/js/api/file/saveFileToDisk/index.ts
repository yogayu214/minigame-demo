/**
 * 保存文件到本机（PC 端）
 * wx.saveFileToDisk
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/file/wx.saveFileToDisk.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SAMPLE_URL = 'https://res.wx.qq.com/wxa-game/dev_doc/images/cover.jpg';

/** 下载一张图片，再保存到 PC 本机（仅 PC 微信生效） */
export function saveFileToDisk() {
  display.text('下载中...');
  wx.downloadFile({
    url: SAMPLE_URL,
    success(d: any) {
      if (typeof wx.saveFileToDisk !== 'function') {
        display.text('当前版本不支持 saveFileToDisk（仅 PC 端）');
        return;
      }
      wx.saveFileToDisk({
        filePath: d.tempFilePath,
        success() {
          display.text('已保存到本机（用户在弹窗里选了路径）');
        },
        fail(err: any) {
          display.text(`保存失败: ${err?.errMsg || '未知错误'}`);
        },
      });
    },
    fail(err: any) {
      display.text(`下载失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
