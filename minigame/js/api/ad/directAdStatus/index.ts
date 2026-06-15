/**
 * 直玩广告状态
 * wx.getDirectAdStatusSync / wx.getShowSplashAdStatus
 * wx.onDirectAdStatusChange / wx.offDirectAdStatusChange
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let onChangeFn: ((res: any) => void) | null = null;

/** 同步获取直玩广告状态 */
export function getDirectAdStatusSync() {
  const tip =
    '⚠️ 此功能需要在真机环境中使用，\n' +
    '模拟器/开发者工具中调用将失败。\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.getDirectAdStatusSync.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    try {
      const res = (wx as any).getDirectAdStatusSync();
      display.text(
        `getDirectAdStatusSync\nstatus: ${res?.status ?? '无'}\n详情: ${JSON.stringify(res)}`
      );
    } catch (e: any) {
      display.text(`调用失败：${e?.message || e}`);
    }
  }, 2000);
}

/** 获取开屏广告展示状态 */
export function getShowSplashAdStatus() {
  const tip =
    '⚠️ 此功能需要在真机环境中使用，\n' +
    '模拟器/开发者工具中调用将失败。\n\n' +
    '文档：developers.weixin.qq.com/minigame/dev/api/ad/wx.getShowSplashAdStatus.html';

  display.text(tip);

  // 2s 后发起真实调用，展示失败结果
  setTimeout(() => {
    (wx as any).getShowSplashAdStatus({
      success(res: any) {
        display.text(
          `getShowSplashAdStatus\nstatus: ${res?.status ?? '无'}\n详情: ${JSON.stringify(res)}`
        );
      },
      fail(err: any) {
        display.text(`调用失败：${err?.errMsg || '未知错误'}`);
      },
    });
  }, 2000);
}

/** 监听直玩广告状态变化 */
export function onDirectAdStatusChange() {
  if (onChangeFn) {
    display.text('已在监听中');
    return;
  }
  onChangeFn = (res: any) => {
    display.text(
      `onDirectAdStatusChange 事件\nstatus: ${res?.status ?? '无'}\n详情: ${JSON.stringify(res)}`
    );
  };
  (wx as any).onDirectAdStatusChange(onChangeFn);
  display.text('已注册 onDirectAdStatusChange 监听\n等待状态变化...');
}

/** 取消监听直玩广告状态变化 */
export function offDirectAdStatusChange() {
  if (!onChangeFn) {
    display.text('未注册监听');
    return;
  }
  (wx as any).offDirectAdStatusChange(onChangeFn);
  onChangeFn = null;
  display.text('已取消 onDirectAdStatusChange 监听');
}

/** 页面销毁时清理 */
export function onUnload() {
  if (onChangeFn) {
    (wx as any).offDirectAdStatusChange(onChangeFn);
    onChangeFn = null;
  }
}
