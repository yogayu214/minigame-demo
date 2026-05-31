/**
 * 直播推流
 * wx.createLivePusher
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/media/live/wx.createLivePusher.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let pusher: any = null;

/** 创建并启动推流（需要合法的 rtmp url） */
export function createAndStart() {
  pusher = (wx as any).createLivePusher();
  pusher.setOptions?.({
    url: 'rtmp://your-server.com/live/demo',
    mode: 'SD',
    muted: false,
    enableCamera: true,
    autoFocus: true,
  });
  pusher.onStatusChange?.((res: any) => {
    display.data({ 事件: 'statusChange', code: String(res.code) });
  });
  pusher.start?.({
    success() { display.text('✓ 推流已启动'); },
    fail(err: any) { display.text(`启动失败：${err.errMsg}`); },
  });
}

/** 停止推流 */
export function stop() {
  if (pusher) {
    pusher.stop?.();
    display.text('⏹ 推流已停止');
  }
}

/** 销毁推流器 */
export function destroy() {
  if (pusher) {
    pusher.stop?.();
    pusher = null;
    display.text('✓ 已销毁推流器');
  }
}

export function onUnload() {
  destroy();
}
