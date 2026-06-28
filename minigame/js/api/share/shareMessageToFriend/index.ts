/**
 * 分享到好友
 * wx.onShareMessageToFriend / wx.offShareMessageToFriend / wx.setMessageToFriendQuery
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

let shareMsgFn: any = null;

/** 在主动分享前设置 query，再调 shareAppMessage 即可带参 */
export function setMessageToFriendQuery() {
  const ok = wx.setMessageToFriendQuery({
    shareMessageToFriendScene: 1,
    query: 'from=demo&ts=' + Date.now(),
  });
  toast(`返回值: ${ok}（调用后再分享，对方点开会带上 query）`);
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
  toast('已 setQuery + shareAppMessage');
}

/** 监听分享到好友消息 */
export function onShareMessageToFriend() {
  shareMsgFn = (res: any) => {
    toast(
      `onShareMessageToFriend | scene: ${res.shareMessageToFriendScene ?? '-'}`,
    );
  };
  wx.onShareMessageToFriend(shareMsgFn);
  toast('已监听分享到好友事件');
}

/** 取消监听分享到好友 */
export function offShareMessageToFriend() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
    toast('已取消监听分享到好友');
  } else {
    toast('当前无监听，无需取消');
  }
}

export function onUnload() {
  if (shareMsgFn) {
    wx.offShareMessageToFriend(shareMsgFn);
    shareMsgFn = null;
  }
}
