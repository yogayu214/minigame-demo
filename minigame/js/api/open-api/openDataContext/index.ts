/**
 * 开放数据域（主域侧）
 *
 * 主域通过 wx.getOpenDataContext().postMessage() 向子域发送消息，
 * 子域（open-data-context/index.ts）通过 wx.onMessage 监听并渲染到 sharedCanvas。
 * 主域需要将 sharedCanvas 绘制到 PIXI 舞台上才能看到子域内容，
 * 该部分由 libs/rich-configs/openDataContext.ts 的 buildTopView 负责（每帧刷纹理）。
 *
 * 本模块每个 export function 会被 rich-config 自动收集为一个按钮；
 * 需要展示子域画布的函数调用 display.showCanvas()，需要展示文本结果的调用 display.text()。
 *
 * 支持的事件：
 *   setUserRecord        - 上报随机分数（主域直接 setUserCloudStorage）
 *   showFriendRank       - 显示好友排行榜（子域渲染到 sharedCanvas）
 *   showFriendsOnlineStatus - 显示好友在线状态（子域渲染到 sharedCanvas）
 *   shareGroupRank       - 分享到群，群内点开后回流触发群排行榜
 *   showGroupRank        - 直接查看群排行榜（需 shareTicket，群场景有效）
 *   relationalChaininteractiveData - 关系链互动
 *   directedSharing      - 定向分享
 *   getUserCloudStorage  - 获取用户托管数据（仅限子域）
 *   getUserCloudStorageKeys - 获取用户托管数据 key 列表（仅限子域）
 *   modifyFriendInteractiveStorage - 修改好友互动数据（仅限子域）
 *   shareMessageToFriend - 分享消息给好友（仅限子域）
 *   subscribeSystemMessage - 订阅系统消息（好友互动 / 排行榜超越提醒）
 *   onMessage            - 监听子域发回的消息
 *   close                - 关闭开放数据域画布
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.getOpenDataContext.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 排行榜使用的托管数据 key，需与子域 data.ts 保持一致 */
const RANK_KEY = 'rankid';

let messageFn: any = null;
let onShowFn: ((res: any) => void) | null = null;

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

/** 上报随机分数（主域直接调用 setUserCloudStorage，与子域使用同一个 key） */
export function setUserRecord() {
  const score = Math.floor(Math.random() * 1000 + 1);
  wx.setUserCloudStorage({
    KVDataList: [
      {
        key: RANK_KEY,
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: Math.floor(Date.now() / 1000),
          },
        }),
      },
    ],
    success() {
      wx.showToast({
        title: `分数上报成功: ${score}分`,
        icon: 'none',
        duration: 2000,
      });
      display.text(`分数上报成功: ${score}分`);
    },
    fail(err: any) {
      display.text(`上报失败: ${err?.errMsg || ''}`);
    },
  });
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

/** 显示好友在线状态（子域会渲染 UI 到 sharedCanvas） */
export function showFriendsOnlineStatus() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showFriendsOnlineStatus',
    });
  } catch (e: any) {
    display.text(`发送失败: ${e.message}`);
  }
}

/**
 * 分享到群，群内成员点击会话卡片重新打开小游戏时，
 * 通过 onShow 携带的 shareTicket 触发群排行榜（见 onLoad 的回流检测）。
 */
export function shareGroupRank() {
  try {
    wx.shareAppMessage({
      title: '高手如云，看看群里你排第几',
      query: 'showGroup=1&pathName=openDataContext',
      imageUrl: canvas.toTempFilePathSync({
        x: 0,
        y: 0,
        width: canvas.width,
        height: (canvas.width * 4) / 5,
      }),
    });
    display.text('若分享成功，请从群里点击会话查看群排行榜');
  } catch (e: any) {
    display.text(`分享失败: ${e.message}`);
  }
}

/** 显示群排行榜（需 shareTicket，群场景有效） */
export function showGroupRank() {
  try {
    display.showCanvas?.();
    wx.getOpenDataContext().postMessage({
      event: 'showGroupRank',
      shareTicket: '',
    });
    display.text('需要在群场景打开，可点击 shareGroupRank 分享到群后查看');
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

/** 订阅系统消息（好友互动提醒 / 排行榜好友超越提醒） */
export function subscribeSystemMessage() {
  wx.requestSubscribeSystemMessage({
    msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
    success(res: any) {
      let tips = '成功订阅';
      if (res.SYS_MSG_TYPE_INTERACTIVE === 'accept') {
        tips += '好友互动提醒';
      }
      if (res.SYS_MSG_TYPE_RANK === 'accept') {
        if (tips !== '成功订阅') tips += '和';
        tips += '排行榜好友超越提醒';
      }
      display.text(tips);
    },
    fail(res: any) {
      display.text(`订阅失败: ${res?.errMsg || ''}`);
    },
  });
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

/**
 * 页面加载时注册 onShow 监听：
 * 当通过 shareGroupRank 分享的卡片从群内重新打开时，
 * 携带的 shareTicket 会触发群排行榜渲染。
 */
export function onLoad() {
  const detectGroupRank = (res: any) => {
    const q = res?.query || {};
    if (res?.shareTicket && q.showGroup === '1') {
      try {
        display.showCanvas?.();
        wx.getOpenDataContext().postMessage({
          event: 'showGroupRank',
          shareTicket: res.shareTicket,
        });
      } catch (e: any) {
        display.text(`群排行发送失败: ${e.message}`);
      }
    }
  };

  onShowFn = detectGroupRank;
  wx.onShow(detectGroupRank);

  // 启动场景也要检测一次（冷启动带 shareTicket 进来）
  try {
    detectGroupRank(wx.getLaunchOptionsSync());
  } catch (_e) {
    /* noop */
  }
}

export function onUnload() {
  if (messageFn) {
    (wx as any).offMessage?.(messageFn);
    messageFn = null;
  }
  if (onShowFn) {
    (wx as any).offShow?.(onShowFn);
    onShowFn = null;
  }
  // 关闭子域画布
  try {
    wx.getOpenDataContext().postMessage({ event: 'close' });
  } catch (_e) {
    /* noop */
  }
}
