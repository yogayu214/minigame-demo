/**
 * 文件读写操作
 * FileSystemManager write/read/append/copy/unlink
 */

/** 写入文件 */
export function writeFile() {
  wx.getFileSystemManager().writeFile({
    filePath: wx.env.USER_DATA_PATH + '/opTest.txt',
    data: 'Hello MiniGame!',
    encoding: 'utf8',
    success() { console.log('写入成功'); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 读取文件 */
export function readFile() {
  wx.getFileSystemManager().readFile({
    filePath: wx.env.USER_DATA_PATH + '/opTest.txt',
    encoding: 'utf8',
    success(res: any) { console.log('内容:', res.data); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 追加内容 */
export function appendFile() {
  wx.getFileSystemManager().appendFile({
    filePath: wx.env.USER_DATA_PATH + '/opTest.txt',
    data: '\nAppended!',
    encoding: 'utf8',
    success() { wx.showToast({ title: '追加成功' }); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 复制文件 */
export function copyFile() {
  wx.getFileSystemManager().copyFile({
    srcPath: wx.env.USER_DATA_PATH + '/opTest.txt',
    destPath: wx.env.USER_DATA_PATH + '/opTest_copy.txt',
    success() { wx.showToast({ title: '复制成功' }); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}

/** 删除文件 */
export function unlinkFile() {
  wx.getFileSystemManager().unlink({
    filePath: wx.env.USER_DATA_PATH + '/opTest.txt',
    success() { console.log('删除成功'); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
