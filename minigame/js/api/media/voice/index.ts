/**
 * 录音
 * wx.getRecorderManager / wx.createInnerAudioContext
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let recorderManager: any = null;
let innerAudioContext: any = null;
let rebooting: any = null;
let recordDuration = 0;

/** 开始录音 */
export function startRecord() {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager();
  }

  recorderManager.onStart(() => {
    display.text('录音中...');
  });

  recorderManager.onStop((res: any) => {
    recordDuration = res?.duration || 0;
    // 销毁旧的音频实例
    if (innerAudioContext) {
      innerAudioContext.destroy();
      innerAudioContext = null;
    }
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = res?.tempFilePath || '';
    display.text(
      formatObj({
        状态: '录音完成',
        时长: `${(recordDuration / 1000).toFixed(1)}s`,
        文件: res?.tempFilePath || '',
      })
    );
  });

  recorderManager.start({ duration: 600000 });
}

/** 停止录音 */
export function stopRecord() {
  if (recorderManager) recorderManager.stop();
}

/** 播放录音 */
export function playRecord() {
  if (!innerAudioContext) {
    display.text('请先录音');
    return;
  }
  innerAudioContext.play();
  display.text(`播放中... (时长 ${(recordDuration / 1000).toFixed(1)}s)`);

  innerAudioContext.onEnded(() => {
    display.text('播放结束');
  });

  innerAudioContext.onPause(() => {
    new Promise((resolve) => {
      rebooting = resolve;
      wx.onAudioInterruptionEnd(rebooting);
      wx.onShow(rebooting);
    }).then(() => {
      wx.offShow(rebooting);
      wx.offAudioInterruptionEnd(rebooting);
      rebooting = null;
    });
  });
}

/** 停止播放 */
export function stopPlay() {
  if (innerAudioContext) {
    innerAudioContext.stop();
    innerAudioContext.offEnded();
    innerAudioContext.offPause();
    display.text('已停止播放');
  }
}

/** 删除录音 */
export function deleteRecord() {
  if (innerAudioContext) {
    innerAudioContext.destroy();
    innerAudioContext = null;
  }
  recordDuration = 0;
  wx.offAudioInterruptionEnd(rebooting);
  display.text('录音已删除');
}

export function onUnload() {
  if (recorderManager) recorderManager.stop();
  if (innerAudioContext) {
    innerAudioContext.destroy();
    innerAudioContext = null;
  }
  if (rebooting) {
    wx.offShow(rebooting);
    wx.offAudioInterruptionEnd(rebooting);
  }
  recordDuration = 0;
}
