/**
 * 音频
 * wx.createInnerAudioContext
 */

let audio: any = null;

/** 创建并播放音频 */
export function play() {
  audio = wx.createInnerAudioContext();
  audio.src = 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/bgm.mp3';
  audio.onEnded(() => console.log('播放结束'));
  audio.play();
  console.log('播放中...');
}

/** 暂停 */
export function pause() {
  if (audio) audio.pause();
}

/** 停止并销毁 */
export function stop() {
  if (audio) { audio.stop(); audio.destroy(); audio = null; }
}
