/**
 * 系统信息
 * wx.getSystemInfoSync / wx.getSystemInfoAsync / wx.getWindowInfo /
 * wx.getSystemSetting / wx.getDeviceInfo / wx.getDeviceBenchmarkInfo /
 * wx.getAppBaseInfo / wx.getAppAuthorizeSetting /
 * wx.openSystemBluetoothSetting / wx.openAppAuthorizeSetting
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/system/wx.getSystemInfo.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

/** 把任意对象拍平成 Record<string, string> 供 display.data 展示 */
function toDisplay(obj: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const key of Object.keys(obj)) {
    const v = (obj as any)[key];
    if (v === null || v === undefined) {
      out[key] = '-';
    } else if (typeof v === 'object') {
      // 嵌套对象（如 host、safeArea）转 JSON 字符串
      try {
        out[key] = JSON.stringify(v);
      } catch {
        out[key] = String(v);
      }
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

/** 同步获取系统信息 */
export function getSystemInfoSync() {
  display.data(toDisplay(wx.getSystemInfoSync()));
}

/** 异步获取系统信息 */
export function getSystemInfoAsync() {
  wx.getSystemInfoAsync({
    success(res: any) {
      display.data(toDisplay(res));
    },
  });
}

/** 获取窗口信息 */
export function getWindowInfo() {
  display.data(toDisplay(wx.getWindowInfo()));
}

/** 获取设备设置（蓝牙/Wi-Fi/定位等开关） */
export function getSystemSetting() {
  display.data(toDisplay(wx.getSystemSetting()));
}

/** 获取设备基础信息 */
export function getDeviceInfo() {
  display.data(toDisplay(wx.getDeviceInfo()));
}

/** 获取设备性能档位 */
export function getDeviceBenchmarkInfo() {
  wx.getDeviceBenchmarkInfo({
    success(res: any) {
      display.data(toDisplay(res));
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 获取微信 App 基础信息 */
export function getAppBaseInfo() {
  display.data(toDisplay(wx.getAppBaseInfo()));
}

/** 获取微信 App 授权设置 */
export function getAppAuthorizeSetting() {
  display.data(toDisplay(wx.getAppAuthorizeSetting()));
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
