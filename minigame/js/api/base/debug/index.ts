/**
 * 调试与日志
 * wx.setEnableDebug / wx.getLogManager / wx.getRealtimeLogManager /
 * wx.enableOfflineModeDebug
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/debug/wx.setEnableDebug.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 打开调试模式（正式版生效，调用后会重启小游戏） */
export function enableDebug() {
  wx.setEnableDebug({
    enableDebug: true,
    success() {
      display.text('✓ 已开启调试，重启后右下角出现调试按钮');
    },
    fail(err: any) {
      display.text(`开启失败：${err.errMsg}`);
    },
  });
}

/** 关闭调试模式 */
export function disableDebug() {
  wx.setEnableDebug({
    enableDebug: false,
    success() {
      display.text('✓ 已关闭调试');
    },
    fail(err: any) {
      display.text(`关闭失败：${err.errMsg}`);
    },
  });
}

/** 写入 LogManager 各级别日志 */
export function writeLogManager() {
  const logger: any = wx.getLogManager({ level: 0 });
  logger.log('LogManager log:', { time: Date.now() });
  logger.info('LogManager info:', 'hello');
  logger.debug('LogManager debug:', 'hello');
  logger.warn('LogManager warn:', 'hello');
  display.text('已写入 4 条 LogManager 日志');
}

/** 写入 RealtimeLogManager 实时日志 */
export function writeRealtimeLog() {
  const logger: any = wx.getRealtimeLogManager();
  logger.info('realtime info:', 'hello');
  logger.warn('realtime warn:', 'hello');
  logger.error('realtime error:', 'hello');
  logger.addFilterMsg && logger.addFilterMsg('demoFilter');
  display.text('已写入 3 条实时日志（可通过 mp 后台查看）');
}

/** console 各级输出（打开 vConsole 观察） */
export function consoleAllLevels() {
  console.debug('console debug test');
  console.info('console info test');
  console.log('console log test');
  console.warn('console warn test');
  console.error('console error test');
  console.group?.('group test');
  console.log('group log inside');
  console.groupEnd?.();
  display.text('已输出 5 个级别 + 1 个分组到 console');
}

/** 开启离线调试模式 */
export function enableOfflineMode() {
  (wx as any).enableOfflineModeDebug?.({ enableDebug: true });
  display.text('✓ 已开启离线调试模式');
}

/** 关闭离线调试模式 */
export function disableOfflineMode() {
  (wx as any).enableOfflineModeDebug?.({ enableDebug: false });
  display.text('✓ 已关闭离线调试模式');
}
