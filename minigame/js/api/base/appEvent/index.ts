/**
 * 应用级事件
 * wx.onError / wx.offError / wx.onUnhandledRejection / wx.offUnhandledRejection /
 * wx.onAudioInterruptionBegin / wx.onAudioInterruptionEnd /
 * wx.offAudioInterruptionBegin / wx.offAudioInterruptionEnd
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/app/app-event/wx.onError.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let errorListener: ((res: any) => void) | null = null;
let rejectionListener: ((res: any) => void) | null = null;
let audioBeginListener: (() => void) | null = null;
let audioEndListener: (() => void) | null = null;
let errorCount = 0;
let rejectionCount = 0;

/** 监听全局错误事件 */
export function listenOnError() {
  if (errorListener) {
    display.text('已在监听 onError');
    return;
  }
  errorCount = 0;
  errorListener = (res: any) => {
    errorCount += 1;
    display.data({
      onError触发次数: String(errorCount),
      最近错误: String(res.message || res),
    });
  };
  wx.onError(errorListener);
  display.text('已注册 onError，点击"触发错误"测试');
}

/** 故意抛出一个错误 */
export function triggerError() {
  setTimeout(() => {
    throw new Error('测试 onError - ' + new Date().toLocaleTimeString());
  }, 10);
}

/** 停止监听全局错误 */
export function stopOnError() {
  if (errorListener) {
    wx.offError(errorListener);
    errorListener = null;
    display.text('已停止 onError 监听');
  }
}

/** 监听未处理的 Promise 异常 */
export function listenOnUnhandledRejection() {
  if (rejectionListener) {
    display.text('已在监听 onUnhandledRejection');
    return;
  }
  rejectionCount = 0;
  rejectionListener = (res: any) => {
    rejectionCount += 1;
    display.data({
      Rejection触发次数: String(rejectionCount),
      最近原因: String(res.reason),
    });
  };
  wx.onUnhandledRejection(rejectionListener);
  display.text('已注册 onUnhandledRejection');
}

/** 故意触发一个未处理的 Promise reject */
export function triggerUnhandledRejection() {
  new Promise((_, reject) => {
    setTimeout(() => reject('测试 unhandledRejection - ' + Date.now()), 10);
  });
}

/** 停止监听 Promise 异常 */
export function stopOnUnhandledRejection() {
  if (rejectionListener) {
    wx.offUnhandledRejection(rejectionListener);
    rejectionListener = null;
    display.text('已停止 onUnhandledRejection 监听');
  }
}

/** 监听音频中断（来电、其他 App 抢占音频时触发） */
export function listenAudioInterruption() {
  audioBeginListener = () => {
    display.text('🎵 音频被中断（Begin）');
  };
  audioEndListener = () => {
    display.text('🎵 音频中断结束（End）');
  };
  wx.onAudioInterruptionBegin(audioBeginListener);
  wx.onAudioInterruptionEnd(audioEndListener);
  display.text('已注册音频中断监听');
}

/** 停止监听音频中断 */
export function stopAudioInterruption() {
  if (audioBeginListener) {
    wx.offAudioInterruptionBegin(audioBeginListener);
    audioBeginListener = null;
  }
  if (audioEndListener) {
    wx.offAudioInterruptionEnd(audioEndListener);
    audioEndListener = null;
  }
  display.text('已停止音频中断监听');
}

export function onUnload() {
  stopOnError();
  stopOnUnhandledRejection();
  stopAudioInterruption();
}
