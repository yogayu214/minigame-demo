/**
 * 账号信息
 * wx.getAccountInfoSync
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/account-info/wx.getAccountInfoSync.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取当前小游戏的账号信息（appId / envVersion） */
export function getAccountInfoSync() {
  const info: any = wx.getAccountInfoSync();
  display.data({
    appId: info.miniProgram?.appId || '-',
    envVersion: info.miniProgram?.envVersion || '-',
    version: info.miniProgram?.version || '-',
  });
}
