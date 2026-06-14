/**
 * 光标 / 指针锁定（仅 PC 端）
 * wx.setCursor / wx.requestPointerLock / wx.isPointerLocked / wx.exitPointerLock
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/cursor/wx.setCursor.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

function isPC(): boolean {
  try {
    const { platform } = wx.getSystemInfoSync();
    return (
      platform === 'windows' || platform === 'mac' || platform === 'devtools'
    );
  } catch {
    return false;
  }
}

function checkPC(): boolean {
  if (!isPC()) {
    const { platform } = wx.getSystemInfoSync();
    display.text(`该功能仅支持 PC 端，当前环境为 ${platform}`);
    return false;
  }
  return true;
}

/** 设置鼠标光标样式（PC 端） */
export function setCursorDefault() {
  if (!checkPC()) return;
  (wx as any).setCursor('default');
  display.text('已设为 default');
}

/** 设置为手型 */
export function setCursorPointer() {
  if (!checkPC()) return;
  (wx as any).setCursor('pointer');
  display.text('已设为 pointer');
}

/** 请求指针锁定（FPS 游戏常用） */
export function requestPointerLock() {
  if (!checkPC()) return;
  (wx as any).requestPointerLock();
  display.text('指针锁定已请求');
}

/** 查询是否锁定 */
export function isPointerLocked() {
  if (!checkPC()) return;
  const locked = (wx as any).isPointerLocked?.() ?? false;
  display.text(formatObj({ 'isPointerLocked()': locked }));
}

/** 退出锁定 */
export function exitPointerLock() {
  if (!checkPC()) return;
  (wx as any).exitPointerLock();
  display.text('已退出指针锁定');
}
