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
          display.data({
            '状态': '保存成功',
            '保存路径': res.savedFilePath,
          });
        },
        fail(err: any) {
          wx.showModal({ title: '保存失败', content: err.errMsg, showCancel: false });
        },
      });
    },
  });
}
