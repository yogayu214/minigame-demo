/**
 * 判断文件/目录是否存在
 * FileSystemManager.access
 */

/** 判断文件是否存在 */
export function accessFile() {
  wx.getFileSystemManager().access({
    path: wx.env.USER_DATA_PATH + '/opTest.txt',
    success() { console.log('文件存在'); },
    fail() { console.log('文件不存在'); },
  });
}

/** 判断目录是否存在 */
export function accessDir() {
  wx.getFileSystemManager().access({
    path: wx.env.USER_DATA_PATH + '/testDir',
    success() { console.log('目录存在'); },
    fail() { console.log('目录不存在'); },
  });
}
