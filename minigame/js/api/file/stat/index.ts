/**
 * 判断路径是否是目录
 * FileSystemManager.stat
 */

/** 获取路径 stat 信息 */
export function statPath() {
  wx.getFileSystemManager().stat({
    path: wx.env.USER_DATA_PATH,
    success(res: any) { console.log('是否目录:', res.stats.isDirectory()); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
