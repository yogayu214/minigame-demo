/**
 * 查看目录内容
 * FileSystemManager.readdir
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 读取用户目录下的文件列表 */
export function readdir() {
  wx.getFileSystemManager().readdir({
    dirPath: wx.env.USER_DATA_PATH,
    success(res: any) {
      if (res.files.length === 0) {
        display.text('目录为空');
        return;
      }
      const list = res.files
        .map((f: string, i: number) => `[${i + 1}] ${f}`)
        .join('\n');
      display.text(`目录: ${wx.env.USER_DATA_PATH}\n${list}`);
    },
    fail(err: any) {
      display.text(`读取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
