/**
 * 录音管理器
 * wx.getRecorderManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/recorder/wx.getRecorderManager.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let recorder: any = null;
let tempPath = '';

function ensure() {
  if (recorder) return recorder;
  recorder = wx.getRecorderManager();
  recorder.onStart(() => display.text('▶ 开始录音'));
  recorder.onPause(() => display.text('⏸ 录音暂停'));
  recorder.onResume(() => display.text('▶ 录音恢复'));
  recorder.onStop((res: any) => {
    tempPath = res.tempFilePath;
    display.data({
      状态: '✓ 录音结束',
      时长: `${res.duration} ms`,
      大小: `${res.fileSize} B`,
      路径: tempPath.slice(-30),
    });
  });
  recorder.onError((err: any) => display.text(`✗ 录音错误: ${err.errMsg}`));
  return recorder;
}

/** 开始录音（10s 上限） */
export function start() {
  ensure().start({
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'aac',
    frameSize: 50,
  });
}

/** 暂停 */
export function pause() { ensure().pause(); }
/** 恢复 */
export function resume() { ensure().resume(); }
/** 停止 */
export function stop() { ensure().stop(); }

/** 播放上一次录音 */
export function playLast() {
  if (!tempPath) {
    display.text('请先录一段音频');
    return;
  }
  const audio = wx.createInnerAudioContext();
  audio.src = tempPath;
  audio.onEnded(() => audio.destroy());
  audio.play();
  display.text('▶ 播放录音');
}

export function onUnload() {
  if (recorder) {
    try { recorder.stop(); } catch {}
    recorder = null;
  }
}
