/**
 * 定向分享
 * 拉取同玩好友/可能感兴趣的好友列表，在小游戏内完成分享
 */

/** 发起定向分享（向开放数据域发送事件） */
export function showDirectedSharing() {
  wx.getOpenDataContext().postMessage({ event: 'directedSharing' });
  console.log('已发送定向分享事件到开放数据域');
}
