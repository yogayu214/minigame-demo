/**
 * 获取文件信息
 * FileSystemManager.getFileInfo
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取文件信息 */
export function getFileInfo() {
  const path = wx.env.USER_DATA_PATH + '/opTest.txt';
  wx.getFileSystemManager().getFileInfo({
    filePath: path,
    success(res: any) {
      display.text(`路径: ${path}\n文件大小: ${res.size} 字节`);
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}
