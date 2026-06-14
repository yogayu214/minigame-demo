/**
 * 开放数据（主域可调用部分）
 * wx.setUserCloudStorage / wx.getUserCloudStorage / wx.getUserCloudStorageKeys /
 * wx.removeUserCloudStorage / wx.modifyFriendInteractiveStorage /
 * wx.getUserInteractiveStorage / wx.onInteractiveStorageModified /
 * wx.offInteractiveStorageModified / wx.setMessageToFriendQuery / wx.shareAppMessage
 *
 * 注意：getFriendCloudStorage / getGroupCloudStorage / getPotentialFriendList /
 * getRelationFriendList / getGroupInfo / getGroupMembersInfo / getSharedCanvas /
 * sendGiftToFriend / getFriendSendGiftStatus 等仅限开放数据域（子域）调用，
 * 请在「开放数据域」页面通过 postMessage 触发。
 *
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/api/open-api/data/wx.setUserCloudStorage.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let interactiveFn: any = null;

// ===== 托管数据 =====

/** 上报用户托管数据 */
export function setUserCloudStorage() {
  const score = Math.floor(Math.random() * 1000 + 1);
  wx.setUserCloudStorage({
    KVDataList: [
      {
        key: 'score',
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: parseInt(String(+new Date() / 1000)),
          },
        }),
      },
    ],
    success() {
      display.text(`上报成功，分数: ${score}`);
    },
    fail(err: any) {
      display.text(`上报失败: ${err.errMsg}`);
    },
  });
}

/** 获取用户托管数据 */
export function getUserCloudStorage() {
  wx.getUserCloudStorage({
    keyList: ['score'],
    success(res: any) {
      display.text(
        formatObj({
          KVDataList: res.KVDataList,
        })
      );
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}

/** 获取用户托管数据的 key 列表 */
export function getUserCloudStorageKeys() {
  wx.getUserCloudStorageKeys({
    success(res: any) {
      display.text(`keys: ${JSON.stringify(res.keys)}`);
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}

/** 删除用户托管数据 */
export function removeUserCloudStorage() {
  wx.removeUserCloudStorage({
    keyList: ['score'],
    success() {
      display.text('已删除 score 托管数据');
    },
    fail(err: any) {
      display.text(`删除失败: ${err.errMsg}`);
    },
  });
}

// ===== 互动数据 =====

/** 修改好友互动数据 */
export function modifyFriendInteractiveStorage() {
  if (typeof (wx as any).modifyFriendInteractiveStorage !== 'function') {
    display.text('此 API 需在真机上测试，且需填写好友 openId');
    return;
  }
  display.text('提示: 请先在 demo 代码中填写好友 openId');
  setTimeout(() => {
    (wx as any).modifyFriendInteractiveStorage({
      openId: '', // 好友 openId，需替换
      num: 1,
      operation: 'add',
      success() {
        display.text('已修改好友互动数据');
      },
      fail(err: any) {
        display.text(`修改失败: ${err.errMsg}`);
      },
    });
  }, 2000);
}

/** 获取用户互动数据 */
export function getUserInteractiveStorage() {
  if (typeof (wx as any).getUserInteractiveStorage !== 'function') {
    display.text('此 API 需在真机上测试');
    return;
  }
  (wx as any).getUserInteractiveStorage({
    keyList: ['1'],
    success(res: any) {
      display.text(
        formatObj({
          KVDataList: res.KVDataList,
        })
      );
    },
    fail(err: any) {
      display.text(`获取失败: ${err.errMsg}`);
    },
  });
}

/** 监听互动数据修改 */
export function onInteractiveStorageModified() {
  if (typeof (wx as any).onInteractiveStorageModified !== 'function') {
    display.text('此 API 需在真机上测试');
    return;
  }
  interactiveFn = (res: any) => {
    display.text(
      formatObj({
        事件: 'onInteractiveStorageModified',
        openId: res.openId ?? '-',
      })
    );
  };
  (wx as any).onInteractiveStorageModified(interactiveFn);
  display.text('已监听互动数据修改事件');
}

/** 取消监听互动数据修改 */
export function offInteractiveStorageModified() {
  if (typeof (wx as any).offInteractiveStorageModified !== 'function') {
    display.text('此 API 需在真机上测试');
    return;
  }
  if (interactiveFn) {
    (wx as any).offInteractiveStorageModified(interactiveFn);
    interactiveFn = null;
    display.text('已取消监听互动数据修改');
  } else {
    display.text('当前无监听，无需取消');
  }
}

// ===== 分享 =====

/** 分享消息给好友 */
export function shareMessageToFriend() {
  if (typeof wx.setMessageToFriendQuery !== 'function') {
    display.text('此 API 需在真机上测试');
    return;
  }
  const ok = wx.setMessageToFriendQuery({
    shareMessageToFriendScene: 1,
    query: 'from=openData&ts=' + Date.now(),
  });
  wx.shareAppMessage({
    title: '来自开放数据域的分享',
    imageUrl: '',
  });
  display.text(
    formatObj({
      setMessageToFriendQuery返回: String(ok),
      说明: '已设置 query 并触发分享',
    })
  );
}

export function onUnload() {
  if (interactiveFn) {
    (wx as any).offInteractiveStorageModified?.(interactiveFn);
    interactiveFn = null;
  }
}
