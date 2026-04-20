/**
 * 查看目录内容
 * FileSystemManager.readdir
 */

/** 读取用户目录下的文件列表 */
export function readdir() {
  wx.getFileSystemManager().readdir({
    dirPath: wx.env.USER_DATA_PATH,
    success(res: any) { console.log('目录内容:', res.files); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
