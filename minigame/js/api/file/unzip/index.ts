/**
 * 解压文件
 * FileSystemManager.unzip
 */

/** 解压 zip 文件到用户目录 */
export function unzipFile() {
  wx.getFileSystemManager().unzip({
    zipFilePath: 'js/api/file/unzip/assets/test.zip',
    targetPath: wx.env.USER_DATA_PATH + '/unzipped',
    success() { wx.showToast({ title: '解压成功' }); },
    fail(err: any) { console.log('失败:', err.errMsg); },
  });
}
