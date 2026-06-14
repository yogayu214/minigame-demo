/**
 * 分享到好友
 * wx.onShareMessageToFriend / wx.offShareMessageToFriend / wx.setMessageToFriendQuery
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareMessageToFriend.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.offShareMessageToFriend.html
 *   https://developers.weixin.qq.com/minigame/dev/api/share/wx.setMessageToFriendQuery.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let shareMsgFn: any = null;

/** 在主动分享前设置 query，再调 shareAppMessage 即可带参 */
export function setMessageToFriendQuery() {
  const ok = wx.setMessageToFriendQuery({
    shareMessageToFriendScene: 1,
    query: 'from=demo&ts=' + Date.now(),
  });
  display.text(
    formatObj({
      返回值: String(ok),
      说明: '调用后再分享，对方点开会带上 query',
    })
  );
}

/** 设置 query 并立即触发分享 */
export function setAndShare() {
  wx.setMessageToFriendQuery({
    shareMessageToFriendScene: 1,
    query: 'from=demo&ts=' + Date.now(),
  });
  wx.shareAppMessage({
    title: '测试带 query 转发',
    imageUrl: '',
  });
  display.text('已 setQuery + shareAppMessage');
}

/** 监听分享到好友消息 */
export function onShareMessageToFriend() {
  shareMsgFn = (res: any) => {
    display.text(
      formatObj({
        事件: 'onShareMessageToFriend',
        shareMessageToFriendScene: res.shareMessageToFriendScene ?? '-',
      })
    );
  };
  wx.onShareMessageToFriend(shareMsgFn);
  display.text('已监听分享到好友事件');
}

/** 取消监听分享到好友 */
export function offShareMessageToFriend() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
    display.text('已取消监听分享到好友');
  } else {
    display.text('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
  }
}
