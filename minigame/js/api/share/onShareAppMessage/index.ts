/**
 * 转发
 * wx.onShareAppMessage / wx.offShareAppMessage
 */

/** 开启被动转发监听 */
export function enableShare() {
  wx.onShareAppMessage(() => ({
    title: '小游戏 API 示例',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: canvas.width * 4 / 5 }),
  }));
  wx.showToast({ title: '已开启' });
}

/** 关闭转发 */
export function disableShare() {
  wx.offShareAppMessage();
  wx.showToast({ title: '已关闭' });
}
