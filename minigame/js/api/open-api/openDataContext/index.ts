/**
 * 开放数据域
 * 主域通过 wx.getOpenDataContext().postMessage() 向子域发送消息，
 * 子域（open-data-context/index.ts）通过 wx.onMessage 监听并渲染到 sharedCanvas。
 * 主域需要将 sharedCanvas 绘制到 PIXI 舞台上才能看到子域内容。
 *
 * 支持的事件：
 *   showFriendRank        - 显示好友排行榜
 *   showGroupRank         - 显示群排行榜（需 shareTicket）
 *   setUserRecord         - 上报分数到子域
 *   relationalChaininteractiveData - 关系链互动
 *   directedSharing       - 定向分享
 *   PCHandoff              - PC 接力
 *   showFriendsOnlineStatus - 好友在线状态
 *   close                  - 关闭开放数据域画布
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getOpenDataContext.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let messageFn: any = null;

/** 获取开放数据域实例 */
export function getOpenDataContext() {
  try {
    const ctx = wx.getOpenDataContext();
    display.text(
      `获取成功，postMessage: ${typeof ctx?.postMessage === 'function' ? '可用' : '不可用'}`
    );
  } catch (e: any) {
    display.text(`获取失败: ${e.message}`);
  }
}

/** 显示好友排行榜 */
export function showFriendRank() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'showFriendRank',
    });
    display.text('已发送 showFriendRank 消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 显示群排行榜 */
export function showGroupRank() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'showGroupRank',
      shareTicket: '',
    });
    display.text('已发送 showGroupRank 消息（需从群分享入口进入才能获取数据）');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 上报分数到子域 */
export function setUserRecord() {
  const score = Math.floor(Math.random() * 1000 + 1);
  try {
    wx.getOpenDataContext().postMessage({
      event: 'setUserRecord',
      value: score,
    });
    display.text(`已发送 setUserRecord 消息，分数: ${score}`);
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 关系链互动（好友排行 + 互动按钮） */
export function relationalChainInteractiveData() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'relationalChaininteractiveData',
    });
    display.text('已发送关系链互动消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 定向分享（可能感兴趣的好友） */
export function directedSharing() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'directedSharing',
    });
    display.text('已发送定向分享消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** PC 接力 */
export function pcHandoff() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'PCHandoff',
    });
    display.text('已发送 PC 接力消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 好友在线状态 */
export function showFriendsOnlineStatus() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'showFriendsOnlineStatus',
    });
    display.text('已发送好友在线状态消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 关闭开放数据域画布 */
export function closeCanvas() {
  try {
    wx.getOpenDataContext().postMessage({
      event: 'close',
    });
    display.text('已发送关闭画布消息到开放数据域');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 监听开放数据域发回的消息 */
export function onMessage() {
  if (messageFn) {
    display.text('已存在监听，无需重复绑定');
    return;
  }
  messageFn = (res: any) => {
    display.text(
      `onMessage: ${
        typeof res === 'object'
          ? JSON.stringify(res).slice(0, 200)
          : String(res)
      }`
    );
  };
  wx.onMessage(messageFn);
  display.text('已监听开放数据域消息');
}

export function onUnload() {
  if (messageFn) {
    (wx as any).offMessage?.(messageFn);
    messageFn = null;
  }
}
