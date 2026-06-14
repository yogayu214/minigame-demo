/**
 * 上传文件
 * wx.uploadFile / UploadTask
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/network/upload/wx.uploadFile.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let selectedFile = '';
let uploadTask: any = null;

/** 下载网络图片作为上传文件 */
export function chooseImage() {
  const url = '';
  if (!url) {
    display.text('请下载 Demo 并填入对应参数即可查看效果');
    return;
  }
  wx.showLoading({ title: '下载图片中...', mask: true });
  wx.downloadFile({
    url,
    success(res: any) {
      wx.hideLoading();
      selectedFile = res.tempFilePath;
      display.text(formatObj({ 状态: '图片已准备', 路径: selectedFile }));
    },
    fail(err: any) {
      wx.hideLoading();
      display.text(formatObj({ 状态: '下载图片失败', 原因: err.errMsg }));
    },
  });
}

/** 上传选中的图片 */
export function uploadFile() {
  const url = '';
  if (!url) {
    display.text('请下载 Demo 并填入对应参数即可查看效果');
    return;
  }
  if (!selectedFile) {
    display.text('请先选择图片');
    return;
  }
  wx.showLoading({ title: '上传中...', mask: true });
  uploadTask = wx.uploadFile({
    url,
    filePath: selectedFile,
    name: 'file',
    success(res: any) {
      wx.hideLoading();
      display.text(
        formatObj({
          状态: '上传成功',
          statusCode: String(res.statusCode),
          文件: selectedFile,
        })
      );
    },
    fail(err: any) {
      wx.hideLoading();
      display.text(
        formatObj({
          状态: '上传失败',
          原因: err.errMsg,
        })
      );
    },
  });
}

/** 监听上传进度（UploadTask.onProgressUpdate） */
export function onProgressUpdate() {
  if (!uploadTask) {
    display.text('请先开始上传');
    return;
  }
  uploadTask.onProgressUpdate((res: any) => {
    display.text(
      formatObj({
        事件: 'onProgressUpdate',
        进度: `${res.progress}%`,
        已上传: `${res.totalBytesSent} 字节`,
        总大小: `${res.totalBytesExpectedToSend} 字节`,
      })
    );
  });
  display.text('已注册上传进度监听');
}

/** 中断上传（UploadTask.abort） */
export function abortUpload() {
  if (uploadTask) {
    uploadTask.abort();
    uploadTask = null;
    display.text('上传已中断');
  } else {
    display.text('当前无上传任务，无需中断');
  }
}
