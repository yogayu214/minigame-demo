/**
 * 内部音频
 * wx.createInnerAudioContext / wx.setInnerAudioOption / wx.getAvailableAudioSources
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createInnerAudioContext.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SRC = 'https://res.wx.qq.com/wxa-game/api-demo/bgm.mp3';
let audio: any = null;

function ensure() {
  if (audio) return audio;
  audio = wx.createInnerAudioContext({ useWebAudioImplement: false });
  audio.src = SRC;
  audio.onPlay(() => display.data({ 状态: '▶ 播放中', src: SRC.slice(-20) }));
  audio.onPause(() => display.text('⏸ 已暂停'));
  audio.onStop(() => display.text('⏹ 已停止'));
  audio.onEnded(() => display.text('✓ 播放结束'));
  audio.onError((err: any) => display.text(`✗ 错误: ${err.errMsg}`));
  return audio;
}

/** 播放 */
export function play() { ensure().play(); }
/** 暂停 */
export function pause() { ensure().pause(); }
/** 停止 */
export function stop() { ensure().stop(); }
/** 跳到 5 秒 */
export function seek5() { ensure().seek(5); }

/** 设置音频选项（在创建上下文之前调用，下次创建生效） */
export function setOption() {
  wx.setInnerAudioOption({
    mixWithOther: true,
    obeyMuteSwitch: false,
    success() {
      display.text('✓ 已设置 mixWithOther=true');
    },
  });
}

/** 查询可用录音音源 */
export function getAvailableSources() {
  wx.getAvailableAudioSources({
    success(res: any) {
      display.data({
        音源数: String((res.audioSources || []).length),
        列表: (res.audioSources || []).join(', '),
      });
    },
  });
}

export function onUnload() {
  if (audio) {
    audio.destroy();
    audio = null;
  }
}
