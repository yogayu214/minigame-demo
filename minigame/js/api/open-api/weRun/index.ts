/**
 * 微信运动
 * wx.getWeRunData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/we-run/wx.getWeRunData.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 获取用户最近 30 天的步数（加密数据，需服务端解密） */
export function getWeRunData() {
  wx.getWeRunData({
    success(res: any) {
      display.text(
        `encryptedData: ${String(res.encryptedData || '').slice(0, 40)}...\niv: ${res.iv || '-'}\ncloudID: ${res.cloudID || '-'}\n说明: 需服务端用 session_key 解密后才能拿到步数`
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
