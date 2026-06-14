/**
 * 系统信息
 * wx.getSystemInfoSync / wx.getSystemInfo / wx.getSystemInfoAsync / wx.getWindowInfo /
 * wx.getSystemSetting / wx.getDeviceInfo / wx.getDeviceBenchmarkInfo /
 * wx.getAppBaseInfo / wx.getAppAuthorizeSetting /
 * wx.openSystemBluetoothSetting / wx.openAppAuthorizeSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/system/wx.getSystemInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 同步获取系统信息 */
export function getSystemInfoSync() {
  const info = wx.getSystemInfoSync();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 异步获取系统信息（回调风格） */
export function getSystemInfo() {
  wx.getSystemInfo({
    success(res: any) {
      display.text(
        Object.keys(res)
          .map((k) => `${k}: ${res[k]}`)
          .join('\n')
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 异步获取系统信息 */
export function getSystemInfoAsync() {
  wx.getSystemInfoAsync({
    success(res: any) {
      display.text(
        Object.keys(res)
          .map((k) => `${k}: ${res[k]}`)
          .join('\n')
      );
    },
  });
}

/** 获取窗口信息 */
export function getWindowInfo() {
  const info = wx.getWindowInfo();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 获取设备设置（蓝牙/Wi-Fi/定位等开关） */
export function getSystemSetting() {
  const info = wx.getSystemSetting();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 获取设备基础信息 */
export function getDeviceInfo() {
  const info = wx.getDeviceInfo();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 获取设备性能档位 */
export function getDeviceBenchmarkInfo() {
  wx.getDeviceBenchmarkInfo({
    success(res: any) {
      display.text(
        Object.keys(res)
          .map((k) => `${k}: ${res[k]}`)
          .join('\n')
      );
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 获取微信 App 基础信息 */
export function getAppBaseInfo() {
  const info = wx.getAppBaseInfo();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 获取微信 App 授权设置 */
export function getAppAuthorizeSetting() {
  const info = wx.getAppAuthorizeSetting();
  display.text(
    Object.keys(info)
      .map((k) => `${k}: ${(info as any)[k]}`)
      .join('\n')
  );
}

/** 跳转系统蓝牙设置页（仅 Android） */
export function openSystemBluetoothSetting() {
  wx.openSystemBluetoothSetting({
    success() {
      display.text('已打开蓝牙设置页');
    },
    fail(err: any) {
      display.text(`打开失败：${err.errMsg}`);
    },
  });
}

/** 跳转微信授权管理页 */
export function openAppAuthorizeSetting() {
  wx.openAppAuthorizeSetting({
    success() {
      display.text('已打开微信授权管理页');
    },
    fail(err: any) {
      display.text(`打开失败：${err.errMsg}`);
    },
  });
}
