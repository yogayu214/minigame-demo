/**
 * 音频播放
 * wx.createInnerAudioContext
 */

let audio: any = null;
let rebooting: any = null;

/** 创建音频实例 */
export function createAudio() {
  audio = wx.createInnerAudioContext();
  audio.src = 'https://wxamusic.wx.qq.com/wxag/xingji/music/bg1.mp3';

  // 错误监听
  audio.onError((res: any) => {
    const errMap: Record<number, string> = {
      10001: '系统错误', 10002: '网络错误', 10003: '文件错误', 10004: '格式错误', [-1]: '未知错误',
    };
    wx.showModal({ title: '音频错误', content: errMap[res.errCode] || '未知错误', showCancel: false });
  });

  // 中断恢复
  audio.onPause(() => {
    if (rebooting) return;
    new Promise((resolve) => {
      rebooting = resolve;
      wx.onAudioInterruptionEnd(rebooting);
      wx.onShow(rebooting);
    }).then(() => {
      wx.offShow(rebooting);
      wx.offAudioInterruptionEnd(rebooting);
      rebooting = null;
      if (audio?.isInterruption) audio.play();
    });
  });

  console.log('音频实例已创建');
}

/** 播放 */
export function play() {
  if (!audio) { wx.showToast({ title: '请先创建音频', icon: 'none' }); return; }
  audio.play();
  audio.isInterruption = true;

  audio.onTimeUpdate(() => {
    console.log(`进度: ${audio.currentTime.toFixed(1)}s / ${audio.duration.toFixed(1)}s`);
  });
  audio.onEnded(() => {
    console.log('播放结束');
    audio.offTimeUpdate();
    audio.offEnded();
    audio.isInterruption = false;
  });
}

/** 暂停 */
export function pause() {
  if (audio) {
    audio.pause();
    audio.offTimeUpdate();
    audio.offEnded();
    audio.isInterruption = false;
  }
}

/** 停止 */
export function stop() {
  if (audio) {
    audio.stop();
    audio.offTimeUpdate();
    audio.offEnded();
    audio.isInterruption = false;
  }
}

export function onUnload() {
  if (audio) { audio.destroy(); audio = null; }
  if (rebooting) { wx.offShow(rebooting); wx.offAudioInterruptionEnd(rebooting); rebooting = null; }
}
