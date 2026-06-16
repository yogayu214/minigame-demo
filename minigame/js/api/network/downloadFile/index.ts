/**
 * 下载文件
 * wx.downloadFile / DownloadTask
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/network/download/wx.downloadFile.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let downloadTask: any = null;

/** 下载远程图片 */
export function downloadFile() {
  wx.showLoading({ title: '下载中...', mask: true });
  downloadTask = wx.downloadFile({
    url: 'https://mmgame.qpic.cn/image/50e4b673d8b0743ba48ce2a8b5e655b12ca05f9e0b530650d2dfd8e64c53ee31/0',
    success(res: any) {
      wx.hideLoading();
      display.text(formatObj(res));
    },
    fail(err: any) {
      wx.hideLoading();
      display.text(
        formatObj({
          状态: '下载失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}

/** 监听下载进度（DownloadTask.onProgressUpdate） */
export function onProgressUpdate() {
  if (!downloadTask) {
    display.text('请先开始下载');
    return;
  }
  downloadTask.onProgressUpdate((res: any) => {
    display.text(
      formatObj({
        事件: 'onProgressUpdate',
        进度: `${res.progress}%`,
        已下载: `${res.totalBytesWritten} 字节`,
        总大小: `${res.totalBytesExpectedToWrite} 字节`,
      })
    );
  });
  display.text('已注册下载进度监听');
}

/** 中断下载（DownloadTask.abort） */
export function abortDownload() {
  if (downloadTask) {
    downloadTask.abort();
    downloadTask = null;
    display.text('下载已中断');
  } else {
    display.text('当前无下载任务，无需中断');
  }
}

export function onUnload() {
  if (downloadTask) {
    downloadTask.abort();
    downloadTask = null;
  }
}
