/**
 * 解压文件
 * FileSystemManager.unzip
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 解压 zip 文件到用户目录 */
export function unzipFile() {
  const targetPath = wx.env.USER_DATA_PATH + '/unzipped';
  wx.getFileSystemManager().unzip({
    zipFilePath: 'js/api/file/unzip/assets/test.zip',
    targetPath,
    success() {
      display.text(`解压路径: ${targetPath}\n状态: 解压成功`);
    },
    fail(err: any) {
      display.text(`解压失败: ${err.errMsg}`);
    },
  });
}
