/**
 * 周期性后台数据更新
 * wx.setBackgroundFetchToken / wx.getBackgroundFetchToken
 * wx.getBackgroundFetchData / wx.onBackgroundFetchData
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/storage/background-fetch/wx.getBackgroundFetchData.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let listener: any = null;

/** 设置 BackgroundFetch token */
export function setBackgroundFetchToken() {
  (wx as any).setBackgroundFetchToken({
    token: 'demo_token_' + Date.now(),
    success() {
      display.text(formatObj({ 状态: '设置 token 成功' }));
    },
    fail(err: any) {
      display.text(formatObj({ 状态: '设置 token 失败', 原因: err?.errMsg || '未知错误' }));
    },
  });
}

/** 查询 BackgroundFetch token */
export function getBackgroundFetchToken() {
  wx.getBackgroundFetchToken({
    success(res: any) {
      display.text(formatObj({ token: res.token?.slice(0, 20) + '...' }));
    },
    fail(err: any) {
      display.text(`查询失败：${err?.errMsg || '未知错误'}（需先在 mp 后台配置）`);
    },
  });
}

/** 主动获取 backgroundFetch 数据 */
export function getBackgroundFetchData() {
  wx.getBackgroundFetchData({
    fetchType: 'pre',
    success(res: any) {
      display.text(
        formatObj({
          fetchedData: String(res.fetchedData || '').slice(0, 60),
          timeStamp: String(res.timeStamp || '-'),
        })
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监听 backgroundFetch 数据推送 */
export function onBackgroundFetchData() {
  listener = (res: any) => {
    display.text(
      formatObj({
        事件: 'onBackgroundFetchData',
        fetchType: res.fetchType,
        data: String(res.fetchedData || '').slice(0, 60),
      })
    );
  };
  wx.onBackgroundFetchData(listener);
  display.text('已注册 onBackgroundFetchData 监听');
}

export function onUnload() {
  if (listener) {
    (wx as any).offBackgroundFetchData?.(listener);
  }
  listener = null;
}
