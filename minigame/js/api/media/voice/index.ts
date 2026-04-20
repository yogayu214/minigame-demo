/**
 * 录音
 * wx.getRecorderManager / wx.createInnerAudioContext
 */

let recorder: any = null;
let audioPlayer: any = null;
let tempAudioPath: string = '';

/** 开始录音 */
export function startRecord() {
  recorder = wx.getRecorderManager();
  recorder.onStop((res: any) => {
    tempAudioPath = res.tempFilePath;
    console.log('录音完成, 路径:', res.tempFilePath);
  });
  recorder.start({ format: 'mp3' });
  console.log('录音中...');
}

/** 停止录音 */
export function stopRecord() {
  if (recorder) recorder.stop();
}

/** 播放录音 */
export function playRecord() {
  if (!tempAudioPath) { wx.showToast({ title: '请先录音', icon: 'none' }); return; }
  audioPlayer = wx.createInnerAudioContext();
  audioPlayer.src = tempAudioPath;
  audioPlayer.onEnded(() => console.log('播放结束'));
  audioPlayer.play();
  console.log('播放中...');
}

/** 停止播放 */
export function stopPlay() {
  if (audioPlayer) { audioPlayer.stop(); audioPlayer.destroy(); audioPlayer = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (recorder) recorder.stop();
  if (audioPlayer) { audioPlayer.stop(); audioPlayer.destroy(); audioPlayer = null; }
}
