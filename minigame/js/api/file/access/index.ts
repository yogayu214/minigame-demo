/**
 * 判断文件/目录是否存在
 * FileSystemManager.access
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 判断文件是否存在 */
export function accessFile() {
  const path = wx.env.USER_DATA_PATH + '/opTest.txt';
  wx.getFileSystemManager().access({
    path,
    success() {
      display.text(`路径: ${path}\n状态: 文件存在`);
    },
    fail() {
      display.text(`路径: ${path}\n状态: 文件不存在`);
    },
  });
}

/** 判断目录是否存在 */
export function accessDir() {
  const path = wx.env.USER_DATA_PATH + '/testDir';
  wx.getFileSystemManager().access({
    path,
    success() {
      display.text(`路径: ${path}\n状态: 目录存在`);
    },
    fail() {
      display.text(`路径: ${path}\n状态: 目录不存在`);
    },
  });
}
