/**
 * 开放数据域
 * 主域通过 wx.getOpenDataContext().postMessage() 向子域发送消息，
 * 子域（open-data-context/index.ts）通过 wx.onMessage 监听并渲染到 sharedCanvas。
 * api调用 请全部看open-data-context子域代码
 * 主域需要将 sharedCanvas 绘制到 PIXI 舞台上才能看到子域内容。
 *
 * 支持的事件：
 *   showFriendRank        - 显示好友排行榜
 *   showGroupRank         - 显示群排行榜（需 shareTicket）
 *   relationalChaininteractiveData - 关系链互动
 *   directedSharing       - 定向分享
 *   getUserCloudStorage   - 获取用户托管数据（仅限子域）
 *   getUserCloudStorageKeys - 获取用户托管数据 key 列表（仅限子域）
 *   modifyFriendInteractiveStorage - 修改好友互动数据（仅限子域）
 *   shareMessageToFriend  - 分享消息给好友（仅限子域）
 *   close                 - 关闭开放数据域画布
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

/** 显示好友排行榜（子域会渲染 UI 到 sharedCanvas） */
export function showFriendRank() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showFriendRank',
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 显示群排行榜（子域会渲染 UI 到 sharedCanvas） */
export function showGroupRank() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showGroupRank',
      shareTicket: '',
    });
    display.text(`需要在群场景打开`)
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 关系链互动（好友排行 + 互动按钮，子域会渲染 UI 到 sharedCanvas） */
export function relationalChainInteractiveData() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'relationalChaininteractiveData',
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 定向分享（可能感兴趣的好友，子域会渲染 UI 到 sharedCanvas） */
export function directedSharing() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'directedSharing',
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 获取用户托管数据（仅限子域，通过 postMessage 触发，结果渲染到 sharedCanvas） */
export function getUserCloudStorage() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'getUserCloudStorage',
      keyList: ['score'],
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 获取用户托管数据的 key 列表（仅限子域，通过 postMessage 触发，结果渲染到 sharedCanvas） */
export function getUserCloudStorageKeys() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'getUserCloudStorageKeys',
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 修改好友互动数据（仅限子域，通过 postMessage 触发，结果渲染到 sharedCanvas） */
export function modifyFriendInteractiveStorage() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'modifyFriendInteractiveStorage',
      key: '1',
      opNum: 1,
      operation: 'add',
      toUser: '', // 好友 openId，需替换
    });
    display.text('需在 demo 代码中填写目标好友 openId 后才可使用');
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/** 分享消息给好友（仅限子域，通过 postMessage 触发，结果渲染到 sharedCanvas） */
export function shareMessageToFriend() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'shareMessageToFriend',
      openId: '', // 好友 openId，需替换
    });
    display.text('需在 demo 代码中填写目标好友 openId 后才可使用');
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
    display.text('关闭画布');
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
  // 关闭子域画布
  try {
    wx.getOpenDataContext().postMessage({ event: 'close' });
  } catch (_e) { /* noop */ }
}
