/**
 * 下载文件
 * wx.downloadFile
 */

/** 下载远程文件 */
export function downloadFile() {
  wx.downloadFile({
    url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4',
    success(res: any) {
      console.log('下载完成, 临时路径:', res.tempFilePath);
    },
    fail(err: any) {
      console.log('下载失败:', err.errMsg);
    },
  });
}
