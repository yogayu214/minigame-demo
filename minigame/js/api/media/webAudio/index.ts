/**
 * Web Audio
 * wx.createWebAudioContext
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createWebAudioContext.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let ctx: any = null;

function ensure() {
  if (!ctx) ctx = wx.createWebAudioContext();
  return ctx;
}

/** 用 OscillatorNode 播一个 440Hz 蜂鸣音 0.5 秒 */
export function playBeep() {
  const c = ensure();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  gain.gain.value = 0.2;
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  setTimeout(() => osc.stop(), 500);
  display.data({
    sampleRate: String(c.sampleRate),
    currentTime: c.currentTime.toFixed(2),
    state: c.state,
    操作: '已播放 440Hz / 0.5s',
  });
}

/** 关闭上下文 */
export function closeContext() {
  if (ctx) {
    ctx.close?.();
    ctx = null;
    display.text('✓ 已关闭 WebAudioContext');
  }
}

export function onUnload() {
  closeContext();
}
