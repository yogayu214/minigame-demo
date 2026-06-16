/**
 * 重命名
 * FileSystemManager.rename
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 写入并重命名为 renamed.txt */
export function renameFile() {
  const fs = wx.getFileSystemManager();
  fs.writeFile({
    filePath: wx.env.USER_DATA_PATH + '/toRename.txt',
    data: 'rename test',
    encoding: 'utf8',
    success() {
      fs.rename({
        oldPath: wx.env.USER_DATA_PATH + '/toRename.txt',
        newPath: wx.env.USER_DATA_PATH + '/renamed.txt',
        success() {
          display.text('重命名成功\ntoRename.txt -> renamed.txt');
        },
        fail(err: any) {
          display.text(`重命名失败: ${err?.errMsg || '未知错误'}`);
        },
      });
    },
    fail(err: any) {
      display.text(`写入失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
