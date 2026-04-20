/**
 * 上传文件
 * wx.uploadFile
 */

/** 上传文件到服务器 */
export function uploadFile() {
  // 先写一个临时文件用于上传
  wx.getFileSystemManager().writeFile({
    filePath: wx.env.USER_DATA_PATH + '/upload.txt',
    data: 'upload test',
    encoding: 'utf8',
    success() {
      wx.uploadFile({
        url: 'https://httpbin.org/post',
        filePath: wx.env.USER_DATA_PATH + '/upload.txt',
        name: 'file',
        success(res: any) { console.log('上传成功, statusCode:', res.statusCode); },
        fail(err: any) { console.log('上传失败:', err.errMsg); },
      });
    },
  });
}
