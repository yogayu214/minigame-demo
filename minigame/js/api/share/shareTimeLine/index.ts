/**
 * 分享到朋友圈
 * wx.shareTimeLine
 */

/** 主动分享到朋友圈 */
export function shareTimeLine() {
  // @ts-ignore
  wx.shareTimeLine({
    imageUrl: canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    }),
    query: `pathName=${window.router.getNowPageName()}`,
  });
}
