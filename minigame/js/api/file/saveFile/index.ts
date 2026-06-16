/**
 * 保存临时文件
 * FileSystemManager.saveFile
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 保存临时文件到本地 */
export function saveFile() {
  const fs = wx.getFileSystemManager();
  fs.writeFile({
    filePath: wx.env.USER_DATA_PATH + '/tempSave.txt',
    data: 'save test',
    encoding: 'utf8',
    success() {
      fs.saveFile({
        tempFilePath: wx.env.USER_DATA_PATH + '/tempSave.txt',
        success(res: any) {
          display.text(`状态: 保存成功\n保存路径: ${res.savedFilePath}`);
        },
        fail(err: any) {
          display.text(`保存失败: ${err?.errMsg || '未知错误'}`);
        },
      });
    },
    fail(err: any) {
      display.text(`写入失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
