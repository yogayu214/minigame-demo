/**
 * 目录操作
 * FileSystemManager.mkdir / FileSystemManager.rmdir
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 创建目录 */
export function mkdir() {
  const path = wx.env.USER_DATA_PATH + '/testDir';
  wx.getFileSystemManager().mkdir({
    dirPath: path,
    success() { display.data({ '路径': path, '状态': '✓ 创建成功' }); },
    fail(err: any) {
      wx.showModal({ title: '创建失败', content: err.errMsg, showCancel: false });
    },
  });
}

/** 删除目录 */
export function rmdir() {
  const path = wx.env.USER_DATA_PATH + '/testDir';
  wx.getFileSystemManager().rmdir({
    dirPath: path,
    success() { display.data({ '路径': path, '状态': '✓ 删除成功' }); },
    fail(err: any) {
      wx.showModal({ title: '删除失败', content: err.errMsg, showCancel: false });
    },
  });
}
