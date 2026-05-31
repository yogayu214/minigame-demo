/**
 * 数据缓存
 * wx.setStorage / wx.getStorage / wx.removeStorage / wx.clearStorage
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const STORAGE_KEY = 'miniGameDemoData';
let lastStored = '';

/** 存储数据（带时间戳） */
export function setStorage() {
  const data = 'Hello MiniGame! ' + new Date().toLocaleTimeString();
  lastStored = data;
  wx.setStorage({
    key: STORAGE_KEY,
    data,
    success() {
      display.data({ 'key': STORAGE_KEY, 'value': data, '状态': '✓ 已存储' });
    },
  });
}

/** 读取数据 */
export function getStorage() {
  wx.getStorage({
    key: STORAGE_KEY,
    success(res: any) {
      display.data({ 'key': STORAGE_KEY, 'value': String(res.data) });
    },
    fail() {
      display.data({ 'key': STORAGE_KEY, 'value': '（未找到）' });
    },
  });
}

/** 删除指定 key */
export function removeStorage() {
  wx.removeStorage({
    key: STORAGE_KEY,
    success() {
      display.data({ 'key': STORAGE_KEY, '状态': '✓ 已删除' });
    },
  });
}

/** 清除所有缓存 */
export function clearStorage() {
  wx.clearStorage({
    success() {
      display.text('已清除全部缓存');
      lastStored = '';
    },
  });
}
