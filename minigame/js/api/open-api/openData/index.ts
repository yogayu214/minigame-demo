/**
 * 开放数据（主域可调用部分）
 *
 * 以下 API 可在主域直接调用：
 *   wx.setUserCloudStorage   - 上报用户托管数据
 *   wx.removeUserCloudStorage - 删除用户托管数据
 *   wx.getUserInteractiveStorage - 获取用户互动数据（需真机，返回加密数据）
 *   wx.onInteractiveStorageModified - 监听互动数据修改（需真机）
 *   wx.offInteractiveStorageModified - 取消监听互动数据修改（需真机）
 * 官方文档：
 *   https://developers.weixin.qq.com/minigame/dev/guide/open-ability/open-data.html
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
      display.text(`上报失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 删除用户托管数据（主域和子域均可调用） */
export function removeUserCloudStorage() {
  wx.removeUserCloudStorage({
    keyList: ['score'],
    success() {
      display.text('已删除 score 托管数据');
    },
    fail(err: any) {
      display.text(`删除失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

// ===== 互动数据 =====

/** 获取用户互动数据（主域可调用，需真机） */
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
          iv: res.iv,
          encryptedData: res.encryptedData,
        })
      );
    },
    fail(err: any) {
      display.text(`获取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监听互动数据修改（主域可调用，需真机） */
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

/** 取消监听互动数据修改（主域可调用，需真机） */
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

export function onUnload() {
  if (interactiveFn) {
    (wx as any).offInteractiveStorageModified?.(interactiveFn);
    interactiveFn = null;
  }
}