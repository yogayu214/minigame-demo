/**
 * 小游戏生命周期
 * wx.onShow / wx.offShow / wx.onHide / wx.offHide /
 * wx.getLaunchOptionsSync / wx.getEnterOptionsSync
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/app/life-cycle/wx.onShow.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let showListener: ((res: any) => void) | null = null;
let hideListener: (() => void) | null = null;

/** 监听小游戏回到前台 */
export function listenOnShow() {
  if (showListener) {
    display.text('已在监听 onShow，请先停止');
    return;
  }
  showListener = (res: any) => {
    display.data({
      onShow: '已触发',
      scene: String(res.scene),
      query: JSON.stringify(res.query || {}),
    });
  };
  wx.onShow(showListener);
  display.text('已注册 onShow，切到后台再回来观察');
}

/** 停止监听 onShow */
export function stopOnShow() {
  if (showListener) {
    wx.offShow(showListener);
    showListener = null;
    display.text('已停止 onShow 监听');
  }
}

/** 监听小游戏进入后台 */
export function listenOnHide() {
  if (hideListener) {
    display.text('已在监听 onHide，请先停止');
    return;
  }
  hideListener = () => {
    console.log('[base/lifeCycle] onHide 触发');
  };
  wx.onHide(hideListener);
  display.text('已注册 onHide，请切到后台观察 console');
}

/** 停止监听 onHide */
export function stopOnHide() {
  if (hideListener) {
    wx.offHide(hideListener);
    hideListener = null;
    display.text('已停止 onHide 监听');
  }
}

/** 获取冷启动参数 */
export function getLaunchOptionsSync() {
  const res: any = wx.getLaunchOptionsSync();
  display.data({
    scene: String(res.scene),
    query: JSON.stringify(res.query || {}),
    shareTicket: res.shareTicket || '-',
    referrerInfo: JSON.stringify(res.referrerInfo || {}),
  });
}

/** 获取启动参数（冷启动和热启动均可） */
export function getEnterOptionsSync() {
  const res: any = wx.getEnterOptionsSync();
  display.data({
    scene: String(res.scene),
    query: JSON.stringify(res.query || {}),
    shareTicket: res.shareTicket || '-',
    referrerInfo: JSON.stringify(res.referrerInfo || {}),
  });
}

export function onUnload() {
  stopOnShow();
  stopOnHide();
}
