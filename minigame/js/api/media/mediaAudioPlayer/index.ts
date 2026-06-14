/**
 * 媒体音频播放器
 * wx.createMediaAudioPlayer
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/audio/wx.createMediaAudioPlayer.html
 *
 * 注意：MediaAudioPlayer 专门配合 VideoDecoder 播放音频流，
 * 不支持 src 直接播放网络音频，没有 onEnded/onError 事件。
 * start/stop/addAudioSource/removeAudioSource 返回 Promise。
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let player: any = null;

/** 创建媒体音频播放器 */
export function createPlayer() {
  if (typeof (wx as any).createMediaAudioPlayer !== 'function') {
    display.text('当前环境不支持 wx.createMediaAudioPlayer');
    return;
  }
  if (player) {
    player.destroy();
    player = null;
  }
  player = (wx as any).createMediaAudioPlayer();
  player.volume = 0.5;
  display.text(
    formatObj({
      状态: '已创建 MediaAudioPlayer',
      volume: player.volume,
    })
  );
}

/** 启动播放器 */
export function start() {
  if (!player) {
    display.text('请先创建播放器');
    return;
  }
  player
    .start()
    .then(() => {
      display.text(
        formatObj({
          状态: '已启动',
        })
      );
    })
    .catch((err: any) => {
      display.text(`启动失败: ${err.errMsg || err}`);
    });
}

/** 停止播放器 */
export function stop() {
  if (!player) {
    display.text('请先创建播放器');
    return;
  }
  player
    .stop()
    .then(() => {
      display.text('已停止');
    })
    .catch((err: any) => {
      display.text(`停止失败: ${err.errMsg || err}`);
    });
}

/** 销毁播放器 */
export function destroy() {
  if (player) {
    player
      .destroy()
      .then(() => {
        display.text('已销毁播放器');
        player = null;
      })
      .catch((err: any) => {
        display.text(`销毁失败: ${err.errMsg || err}`);
      });
  }
}

export function onUnload() {
  if (player) {
    player.destroy();
    player = null;
  }
}
