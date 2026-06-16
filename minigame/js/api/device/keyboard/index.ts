/**
 * 键盘
 * wx.showKeyboard / wx.hideKeyboard / wx.updateKeyboard /
 * wx.onKeyboardInput / wx.offKeyboardInput /
 * wx.onKeyboardConfirm / wx.offKeyboardConfirm /
 * wx.onKeyboardComplete / wx.offKeyboardComplete /
 * wx.onKeyboardHeightChange / wx.offKeyboardHeightChange /
 * wx.onKeyDown / wx.offKeyDown / wx.onKeyUp / wx.offKeyUp
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/keyboard/wx.showKeyboard.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

const listeners: Record<string, any> = {};

/** 显示软键盘 */
export function showKeyboard() {
  wx.showKeyboard({
    defaultValue: '',
    maxLength: 20,
    multiple: false,
    confirmHold: false,
    confirmType: 'done',
    keyboardType: 'default',
    success() {
      display.text('软键盘已弹出');
    },
    fail(err: any) {
      display.text(`弹出键盘失败：${err?.errMsg || '未知错误'}`);
    },
  } as any);
}

/** 隐藏软键盘 */
export function hideKeyboard() {
  wx.hideKeyboard({
    success() {
      display.text('软键盘已隐藏');
    },
    fail(err: any) {
      display.text(`隐藏键盘失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 更新软键盘默认值 */
export function updateKeyboard() {
  wx.updateKeyboard({
    value: '更新-' + Date.now(),
    success() {
      display.text('已更新软键盘内容');
    },
    fail(err: any) {
      display.text(`更新键盘失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 监听键盘输入 + 确认 + 完成 + 高度变化 */
export function listenSoftKeyboard() {
  listeners.input = (res: any) => display.text(`事件: input\n值: ${res.value}`);
  listeners.confirm = (res: any) =>
    display.text(`事件: confirm\n值: ${res.value}`);
  listeners.complete = (res: any) =>
    display.text(`事件: complete\n值: ${res.value}`);
  listeners.height = (res: any) =>
    display.text(`事件: heightChange\n高度: ${res.height}`);

  wx.onKeyboardInput(listeners.input);
  wx.onKeyboardConfirm(listeners.confirm);
  wx.onKeyboardComplete(listeners.complete);
  wx.onKeyboardHeightChange(listeners.height);
  display.text('已注册软键盘 4 个事件');
}

/** 停止软键盘监听 */
export function stopSoftKeyboard() {
  if (listeners.input) wx.offKeyboardInput(listeners.input);
  if (listeners.confirm) wx.offKeyboardConfirm(listeners.confirm);
  if (listeners.complete) wx.offKeyboardComplete(listeners.complete);
  if (listeners.height) wx.offKeyboardHeightChange(listeners.height);
  ['input', 'confirm', 'complete', 'height'].forEach(
    (k) => delete listeners[k]
  );
  display.text('已停止软键盘监听');
}

/** 监听物理键盘按键（PC 端） */
export function listenHardKeyboard() {
  listeners.keydown = (res: any) =>
    display.text(`事件: keydown\n按键: ${res.key}\n编码: ${res.code}`);
  listeners.keyup = (res: any) =>
    display.text(`事件: keyup\n按键: ${res.key}\n编码: ${res.code}`);
  wx.onKeyDown(listeners.keydown);
  wx.onKeyUp(listeners.keyup);
  display.text('已注册物理键盘监听（PC 端有效）');
}

/** 停止物理键盘监听 */
export function stopHardKeyboard() {
  if (listeners.keydown) wx.offKeyDown(listeners.keydown);
  if (listeners.keyup) wx.offKeyUp(listeners.keyup);
  delete listeners.keydown;
  delete listeners.keyup;
  display.text('已停止物理键盘监听');
}

export function onUnload() {
  stopSoftKeyboard();
  stopHardKeyboard();
}
