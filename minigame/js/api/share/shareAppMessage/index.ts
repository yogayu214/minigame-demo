/**
 * 主动分享
 * wx.shareAppMessage
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html
 */

/** 主动拉起转发面板 */
export function shareToFriend() {
  let imageUrl = '';
  try {
    imageUrl = canvas.toTempFilePathSync({
      x: 0,
      y: 0,
      width: canvas.width,
      height: (canvas.width * 4) / 5,
    });
  } catch (e: any) {
    console.error('[shareAppMessage] toTempFilePathSync 失败', e);
  }
  wx.shareAppMessage({
    title: '小游戏 API 示例',
    imageUrl,
  });
}
