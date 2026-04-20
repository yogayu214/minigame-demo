/**
 * 重命名
 * FileSystemManager.rename
 */

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
        success() { wx.showToast({ title: '重命名成功' }); },
        fail(err: any) { console.log('失败:', err.errMsg); },
      });
    },
  });
}
