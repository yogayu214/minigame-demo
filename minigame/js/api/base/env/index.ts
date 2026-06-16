/**
 * 环境变量
 * wx.env：小游戏运行环境的常量集合
 *   - USER_DATA_PATH：本地用户文件目录路径（仅小程序/小游戏可用）
 *
 * 调用结果示例：
 *   USER_DATA_PATH: wxfile://usr
 *   CLIENT_DATA_PATH: null
 *   isSupportEmcriptenGLX: false
 *   isSupportMetal: false
 *   isAndroidHighPerformance: false
 *   isSupportStandardWorker: false
 *   HAS_SPLASHSCREEN: false
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

export function getEnv() {
  const env = wx.env;
  display.text(formatObj(env));
}
