/**
 * 目录操作
 * FileSystemManager.mkdir / FileSystemManager.rmdir
 */

/** 创建目录 */
export function mkdir() {
  wx.getFileSystemManager().mkdir({
    dirPath: wx.env.USER_DATA_PATH + '/testDir',
    success() { wx.showToast({ title: '创建成功' }); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 删除目录 */
export function rmdir() {
  wx.getFileSystemManager().rmdir({
    dirPath: wx.env.USER_DATA_PATH + '/testDir',
    success() { wx.showToast({ title: '删除成功' }); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
