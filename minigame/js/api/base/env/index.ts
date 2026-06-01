/**
 * 环境变量
 * wx.env：小游戏运行环境的常量集合
 *   - USER_DATA_PATH：本地用户文件目录路径（仅小程序/小游戏可用）
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 打印 wx.env 全部字段 */
export function getEnv() {
  const env: any = wx.env || {};
  const data: Record<string, string> = {};
  for (const key of Object.keys(env)) {
    data[key] = String(env[key]);
  }
  if (Object.keys(data).length === 0) {
    display.text('wx.env 为空');
    return;
  }
  display.data(data);
  // 同时打印到控制台，便于复制查看
  console.log('wx.env =', env);
}

/** 仅展示用户文件目录路径 */
export function getUserDataPath() {
  const path = (wx.env && (wx.env as any).USER_DATA_PATH) || '';
  display.data({ USER_DATA_PATH: path || '(不可用)' });
}
