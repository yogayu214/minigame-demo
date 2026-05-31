/**
 * 光标 / 指针锁定（PC 端）
 * wx.setCursor / wx.requestPointerLock / wx.isPointerLocked / wx.exitPointerLock
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/cursor/wx.setCursor.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 设置鼠标光标样式（PC 端） */
export function setCursorDefault() {
  if (typeof (wx as any).setCursor !== 'function') {
    display.text('当前环境不支持 setCursor');
    return;
  }
  (wx as any).setCursor('default');
  display.text('✓ 已设为 default');
}

/** 设置为手型 */
export function setCursorPointer() {
  (wx as any).setCursor?.('pointer');
  display.text('✓ 已设为 pointer');
}

/** 请求指针锁定（FPS 游戏常用） */
export function requestPointerLock() {
  if (typeof (wx as any).requestPointerLock !== 'function') {
    display.text('当前环境不支持 requestPointerLock');
    return;
  }
  (wx as any).requestPointerLock();
  display.text('✓ 指针锁定已请求');
}

/** 查询是否锁定 */
export function isPointerLocked() {
  const locked = (wx as any).isPointerLocked?.() ?? false;
  display.data({ 'isPointerLocked()': String(locked) });
}

/** 退出锁定 */
export function exitPointerLock() {
  (wx as any).exitPointerLock?.();
  display.text('✓ 已退出指针锁定');
}
