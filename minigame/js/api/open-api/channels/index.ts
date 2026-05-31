/**
 * 视频号 / 直播
 * wx.getChannelsLiveInfo / wx.getChannelsLiveNoticeInfo
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/channels/wx.getChannelsLiveInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 查询直播间信息 */
export function getChannelsLiveInfo() {
  wx.getChannelsLiveInfo({
    finderUserName: '',  // 视频号
    success(res: any) {
      display.data({
        status: String(res.status),
        nickname: res.nickname || '-',
        nonceId: res.nonceId || '-',
      });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}（需填合法 finderUserName）`);
    },
  });
}

/** 查询直播预告信息 */
export function getChannelsLiveNoticeInfo() {
  wx.getChannelsLiveNoticeInfo({
    finderUserName: '',
    success(res: any) {
      display.data({ 详情: JSON.stringify(res).slice(0, 100) });
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}`);
    },
  });
}
