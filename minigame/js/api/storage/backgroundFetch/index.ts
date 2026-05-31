/**
 * 周期性后台数据更新
 * wx.getBackgroundFetchToken / wx.getBackgroundFetchData / wx.onBackgroundFetchData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/storage/background-fetch/wx.getBackgroundFetchData.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let listener: any = null;

/** 查询 BackgroundFetch token（验证 mp 后台配置） */
export function getToken() {
  wx.getBackgroundFetchToken({
    success(res: any) {
      display.data({ token: res.token?.slice(0, 20) + '...' });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}（需先在 mp 后台配置）`);
    },
  });
}

/** 主动获取 backgroundFetch 数据 */
export function getData() {
  wx.getBackgroundFetchData({
    fetchType: 'pre',
    success(res: any) {
      display.data({
        fetchedData: String(res.fetchedData || '').slice(0, 60),
        timeStamp: String(res.timeStamp || '-'),
      });
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 监听 backgroundFetch 数据推送 */
export function onData() {
  listener = (res: any) => {
    display.data({
      事件: 'onBackgroundFetchData',
      fetchType: res.fetchType,
      data: String(res.fetchedData || '').slice(0, 60),
    });
  };
  wx.onBackgroundFetchData(listener);
  display.text('✓ 已注册 onBackgroundFetchData 监听');
}

export function onUnload() {
  // backgroundFetch 没有显式 off 接口，置空即可
  listener = null;
}
