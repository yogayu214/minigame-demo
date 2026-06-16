/**
 * 视频
 * wx.createVideo
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let video: any = null;

/** 创建并初始化视频（缩小尺寸避免遮挡 UI） */
export function onLoad() {
  if (video) video.destroy();

  const sysInfo = wx.getSystemInfoSync();
  const windowWidth = sysInfo?.windowWidth || 375;
  const windowHeight = sysInfo?.windowHeight || 667;
  const vWidth = Math.min(windowWidth - 40, 300);
  const vHeight = vWidth * 0.56;
  const x = (windowWidth - vWidth) / 2;
  const y = windowHeight * 0.5;

  video = wx.createVideo({
    x,
    y,
    width: vWidth,
    height: vHeight,
    controls: true,
    enablePlayGesture: true,
    src: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/video.mp4',
  });

  video.onPlay(() => {
    display.text('视频播放中');
  });
  video.onPause(() => {
    display.text('视频已暂停');
  });
  video.onEnded(() => {
    display.text('视频播放结束');
  });
  video.onWaiting(() => {
    display.text('视频缓冲中');
  });
  video.onError((res: any) => {
    display.text(`视频错误: ${res?.errMsg || '未知错误'}`);
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

/** 停止 */
export function stop() {
  if (video) video.stop();
}

/** 跳到 5 秒 */
export function seek5() {
  if (video) video.seek(5);
}

/** 销毁 */
export function onUnload() {
  if (video) {
    video.destroy();
    video = null;
  }
}
