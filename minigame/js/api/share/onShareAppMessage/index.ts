/**
 * 转发
 * wx.onShareAppMessage / wx.offShareAppMessage / wx.showShareMenu
 */

let transpondFn: any = null;

/** 开启被动转发监听 */
export function enableShare() {
  wx.showShareMenu({ withShareTicket: true });

  transpondFn = () => ({
    title: '小游戏 API 示例',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: canvas.width * 4 / 5 }),
    query: `pathName=${window.router.getNowPageName()}`,
  });
  wx.onShareAppMessage(transpondFn);
  wx.showToast({ title: '已开启' });
}

/** 关闭转发 */
export function disableShare() {
  if (transpondFn) {
    wx.offShareAppMessage(transpondFn);
    transpondFn = null;
  }
  wx.showToast({ title: '已关闭' });
}

export function onUnload() {
  if (transpondFn) { wx.offShareAppMessage(transpondFn); transpondFn = null; }
}
