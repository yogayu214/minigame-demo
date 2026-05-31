/**
 * 转发到指定好友（带 query）
 * wx.setMessageToFriendQuery
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/share/wx.setMessageToFriendQuery.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 在主动分享前设置 query，再调 shareAppMessage 即可带参 */
export function setMessageToFriendQuery() {
  const ok = wx.setMessageToFriendQuery({
    shareMessageToFriendScene: 1,
    query: 'from=demo&ts=' + Date.now(),
  });
  display.data({
    返回值: String(ok),
    说明: '调用后再分享，对方点开会带上 query',
  });
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
