/**
 * 分享到朋友圈
 * wx.onShareTimeline
 */

/** 注册朋友圈分享回调 */
export function shareToTimeline() {
  wx.onShareTimeline(() => ({
    title: '小游戏 API 示例',
    imageUrl: canvas.toTempFilePathSync({ x: 0, y: 0, width: canvas.width, height: canvas.width }),
  }));
  wx.showToast({ title: '朋友圈分享已开启' });
}
