/**
 * 跳转其他小程序 / 小游戏
 * wx.navigateToMiniProgram
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/navigate/wx.navigateToMiniProgram.html
 *
 * 注意：
 * 1) 需要在 mp 后台配置跳转白名单，否则会 fail。
 * 2) 此处的 DEMO_APPID 来自 minigame-api-test 用例，仅作演示，
 *    开发者请替换为自己已配置白名单的目标 AppID。
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const DEMO_APPID = 'wx7a727ff7d940bb3f';

/** 直接跳转 */
export function navigateToMiniProgram() {
  wx.navigateToMiniProgram({
    appId: DEMO_APPID,
    success(res: any) {
      display.text('已跳转');
      console.log('[navigateToMiniProgram] success', res);
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '跳转失败',
          原因: err?.errMsg || '未知错误',
          提示: '需要在 mp 后台配置跳转白名单',
        })
      );
    },
  });
}

/** 跳转并附带 path / envVersion / extraData */
export function navigateWithExtra() {
  wx.navigateToMiniProgram({
    appId: DEMO_APPID,
    path: '?test=123',
    envVersion: 'release',
    extraData: { from: 'minigame-demo2', ts: Date.now() },
    success(res: any) {
      display.text('已跳转（带参数）');
      console.log('[navigateToMiniProgram] success', res);
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '跳转失败',
          原因: err?.errMsg || '未知错误',
        })
      );
    },
  });
}

/** 跳转体验版（envVersion=trial） */
export function navigateToTrial() {
  wx.navigateToMiniProgram({
    appId: DEMO_APPID,
    envVersion: 'trial',
    path: '?test=123',
    success(res: any) {
      display.text('已跳转体验版');
      console.log('[navigateToMiniProgram] success', res);
    },
    fail(err: any) {
      display.text(
        formatObj({
          状态: '跳转失败',
          原因: err?.errMsg || '未知错误',
          提示: '体验版需要目标小程序存在 trial 版本',
        })
      );
    },
  });
}
