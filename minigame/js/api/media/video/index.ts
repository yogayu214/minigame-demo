/**
 * 视频
 * wx.createVideo
 */

let video: any = null;

/** 创建并初始化视频 */
export function onLoad() {
  const { windowWidth, windowHeight } = wx.getSystemInfoSync();
  video = wx.createVideo({
    x: 0,
    y: windowHeight / 3,
    width: windowWidth,
    height: windowWidth * 0.6,
    controls: true,
    enablePlayGesture: true,
    src: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4',
  });

  video.onPlay(() => { wx.showToast({ title: '播放成功', icon: 'success', duration: 1000 }); });
  video.onPause(() => { wx.showToast({ title: '暂停成功', icon: 'success', duration: 1000 }); });
  video.onEnded(() => { wx.showToast({ title: '播放结束', icon: 'success', duration: 1000 }); });
  video.onWaiting(() => { wx.showToast({ title: '视频缓冲中', icon: 'none', duration: 1000 }); });
  video.onError((res: any) => {
    wx.showModal({ title: '视频错误', content: res.errMsg, showCancel: false });
  });
}

/** 播放 */
export function play() {
  if (video) video.play();
}

/** 暂停 */
export function pause() {
  if (video) video.pause();
}

/** 销毁 */
export function destroy() {
  if (video) { video.destroy(); video = null; }
}

export function onUnload() {
  if (video) { video.destroy(); video = null; }
}
