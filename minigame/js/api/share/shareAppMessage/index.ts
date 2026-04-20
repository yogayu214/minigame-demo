/**
 * 主动转发
 * wx.shareAppMessage
 */

/** 主动拉起转发面板 */
export function shareToFriend() {
  wx.shareAppMessage({
    title: '小游戏 API 示例',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: canvas.width * 4 / 5 }),
  });
}
