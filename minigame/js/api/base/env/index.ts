/**
 * 环境变量
 * wx.env：小游戏运行环境的常量集合
 *   - USER_DATA_PATH：本地用户文件目录路径（仅小程序/小游戏可用）
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

export function getEnv() {
  const env = wx.env;
  display.text(Object.keys(env).map(k => `${k}: ${env[k]}`).join('\n'));
}