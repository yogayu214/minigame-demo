/**
 * 视频号 / 直播
 * wx.getChannelsLiveInfo / wx.getChannelsLiveNoticeInfo /
 * wx.reserveChannelsLive / wx.openChannelsUserProfile /
 * wx.openChannelsLive / wx.openChannelsEvent / wx.openChannelsActivity
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/channels/wx.getChannelsLiveInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 提醒用户填写视频号ID，2s 后执行回调 */
function withFinderHint(callback: () => void) {
  display.text('提示: 请先在 demo 代码中填写视频号 ID (finderUserName)');
  setTimeout(callback, 2000);
}

/** 查询直播间信息 */
export function getChannelsLiveInfo() {
  withFinderHint(() => {
    wx.getChannelsLiveInfo({
      finderUserName: '', // 视频号ID，需替换
      success(res: any) {
        display.text(
          `status: ${res.status}\nnickname: ${res.nickname || '-'}\nnonceId: ${res.nonceId || '-'}`
        );
      },
      fail(err: any) {
        display.text(`查询失败：${err?.errMsg || '未知错误'}`);
      },
    });
  });
}

/** 查询直播预告信息 */
export function getChannelsLiveNoticeInfo() {
  withFinderHint(() => {
    wx.getChannelsLiveNoticeInfo({
      finderUserName: '', // 视频号ID，需替换
      success(res: any) {
        display.text(`直播预告: ${JSON.stringify(res).slice(0, 200)}`);
      },
      fail(err: any) {
        display.text(`查询失败：${err?.errMsg || '未知错误'}`);
      },
    });
  });
}

/** 预约直播 */
export function reserveChannelsLive() {
  withFinderHint(() => {
    wx.reserveChannelsLive({
      finderUserName: '', // 视频号ID，需替换
      feedId: '', // 直播feedId，需替换
      success() {
        display.text('已预约直播');
      },
      fail(err: any) {
        display.text(`预约失败：${err?.errMsg || '未知错误'}`);
      },
    } as any);
  });
}

/** 打开视频号主页 */
export function openChannelsUserProfile() {
  withFinderHint(() => {
    wx.openChannelsUserProfile({
      finderUserName: '', // 视频号ID，需替换
      success() {
        display.text('已打开视频号主页');
      },
      fail(err: any) {
        display.text(`打开失败：${err?.errMsg || '未知错误'}`);
      },
    });
  });
}

/** 打开视频号直播 */
export function openChannelsLive() {
  withFinderHint(() => {
    wx.openChannelsLive({
      finderUserName: '', // 视频号ID，需替换
      success() {
        display.text('已打开视频号直播');
      },
      fail(err: any) {
        display.text(`打开失败：${err?.errMsg || '未知错误'}`);
      },
    });
  });
}

/** 打开视频号活动 */
export function openChannelsEvent() {
  withFinderHint(() => {
    wx.openChannelsEvent({
      finderUserName: '', // 视频号ID，需替换
      eventId: '', // 活动ID，需替换
      success() {
        display.text('已打开视频号活动');
      },
      fail(err: any) {
        display.text(`打开失败：${err?.errMsg || '未知错误'}`);
      },
    });
  });
}

/** 打开视频号活动（带商品） */
export function openChannelsActivity() {
  withFinderHint(() => {
    wx.openChannelsActivity({
      finderUserName: '', // 视频号ID，需替换
      feedId: '', // feedId，需替换
      success() {
        display.text('已打开视频号活动');
      },
      fail(err: any) {
        display.text(`打开失败：${err?.errMsg || '未知错误'}`);
      },
    } as any);
  });
}
