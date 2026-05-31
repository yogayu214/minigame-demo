/**
 * 视频解码器
 * wx.createVideoDecoder / wx.createMediaAudioPlayer
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/video-decoder/wx.createVideoDecoder.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const SRC = 'https://res.wx.qq.com/wxa-game/api-demo/sample.mp4';
let decoder: any = null;
let player: any = null;

/** 创建解码器并开始解码 */
export function createDecoder() {
  decoder = wx.createVideoDecoder();
  decoder.on?.('start', (res: any) => display.text(`▶ 解码开始 ${JSON.stringify(res)}`));
  decoder.on?.('seek', () => display.text('seek done'));
  decoder.on?.('stop', () => display.text('⏹ 解码停止'));
  decoder.on?.('ended', () => display.text('✓ 解码结束'));
  decoder.start?.({ source: SRC, mode: 0 });
  display.text('createVideoDecoder 已调用');
}

/** 读取一帧 */
export function getFrame() {
  if (!decoder) {
    display.text('请先创建解码器');
    return;
  }
  const frame = decoder.getFrameData?.();
  if (frame) {
    display.data({
      width: String(frame.width),
      height: String(frame.height),
      pts: String(frame.pts),
      data: frame.data ? `${frame.data.byteLength} B` : '-',
    });
  } else {
    display.text('暂无帧数据，再试一次');
  }
}

/** 创建媒体音频播放器（解码音频流） */
export function createAudioPlayer() {
  player = wx.createMediaAudioPlayer();
  player.start?.({
    success() { display.text('✓ MediaAudioPlayer 已启动'); },
  });
}

/** 销毁 */
export function destroyAll() {
  if (decoder) { decoder.remove?.(); decoder = null; }
  if (player) { player.destroy?.(); player = null; }
  display.text('✓ 已销毁解码器与音频播放器');
}

export function onUnload() {
  destroyAll();
}
