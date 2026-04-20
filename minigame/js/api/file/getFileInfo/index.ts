/**
 * 获取文件信息
 * FileSystemManager.getFileInfo
 */

/** 获取文件信息 */
export function getFileInfo() {
  wx.getFileSystemManager().getFileInfo({
    filePath: wx.env.USER_DATA_PATH + '/opTest.txt',
    success(res: any) { console.log('文件大小:', res.size, '字节'); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
