/**
 * 用户授权
 * wx.authorize / wx.getSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/authorize/wx.authorize.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 请求用户信息授权 */
export function authorizeUserInfo() {
  wx.authorize({
    scope: 'scope.userInfo',
    success() {
      display.text('scope.userInfo 已授权');
    },
    fail(err: any) {
      display.text(`授权失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 请求录音授权 */
export function authorizeRecord() {
  wx.authorize({
    scope: 'scope.record',
    success() {
      display.text('scope.record 已授权');
    },
    fail(err: any) {
      display.text(`授权失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 请求写相册授权 */
export function authorizeAlbum() {
  wx.authorize({
    scope: 'scope.writePhotosAlbum',
    success() {
      display.text('scope.writePhotosAlbum 已授权');
    },
    fail(err: any) {
      display.text(`授权失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 查询当前已授权的 scope */
export function getSetting() {
  wx.getSetting({
    success(res: any) {
      const auth = res?.authSetting || {};
      const lines = Object.keys(auth).map((k) => `${k}: ${auth[k]}`);
      display.text(lines.length ? lines.join('\n') : '暂无授权信息');
    },
    fail(err: any) {
      display.text(`查询失败：${err?.errMsg || '未知错误'}`);
    },
  });
}
