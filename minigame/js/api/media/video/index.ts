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
    src: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4',
  });
  video.onPlay(() => console.log('播放中'));
  video.onEnded(() => console.log('播放结束'));
  video.onError((err: any) => console.log('错误:', err.errMsg));
}

/** 播放 */
export function play() {
  if (video) video.play();
}

/** 暂停 */
export function pause() {
  if (video) video.pause();
}

/** 停止 */
export function stop() {
  if (video) video.stop();
}

/** 销毁 */
export function destroy() {
  if (video) { video.destroy(); video = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (video) { video.destroy(); video = null; }
}
