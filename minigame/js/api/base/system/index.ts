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

/** 同步获取系统信息 */
export function getSystemInfoSync() {
  const info = wx.getSystemInfoSync();
  display.data({
    品牌: info.brand,
    型号: info.model,
    系统: `${info.platform} ${info.system}`,
    微信版本: info.version,
    SDK版本: info.SDKVersion,
    屏幕: `${info.screenWidth} x ${info.screenHeight}`,
    像素比: String(info.pixelRatio),
    机型档位: String(info.benchmarkLevel),
  });
}

/** 异步获取系统信息 */
export function getSystemInfoAsync() {
  wx.getSystemInfoAsync({
    success(res: any) {
      display.data({
        品牌: res.brand,
        型号: res.model,
        系统: `${res.platform} ${res.system}`,
        语言: res.language,
        微信版本: res.version,
        SDK版本: res.SDKVersion,
      });
    },
  });
}

/** 获取窗口信息 */
export function getWindowInfo() {
  const info: any = wx.getWindowInfo();
  display.data({
    像素比: String(info.pixelRatio),
    屏幕宽: String(info.screenWidth),
    屏幕高: String(info.screenHeight),
    窗口宽: String(info.windowWidth),
    窗口高: String(info.windowHeight),
    状态栏高: String(info.statusBarHeight),
    screenTop: String(info.screenTop),
  });
}

/** 获取设备设置（蓝牙/Wi-Fi/定位等开关） */
export function getSystemSetting() {
  const s: any = wx.getSystemSetting();
  display.data({
    蓝牙: s.bluetoothEnabled ? '开' : '关',
    WiFi: s.wifiEnabled ? '开' : '关',
    定位: s.locationEnabled ? '开' : '关',
    设备方向: s.deviceOrientation,
  });
}

/** 获取设备基础信息 */
export function getDeviceInfo() {
  const info: any = wx.getDeviceInfo();
  display.data({
    品牌: info.brand,
    型号: info.model,
    系统: info.system,
    平台: info.platform,
    内存: `${info.memorySize} MB`,
    CPU: info.cpuType || '-',
  });
}

/** 获取设备性能档位 */
export function getDeviceBenchmarkInfo() {
  wx.getDeviceBenchmarkInfo({
    success(res: any) {
      display.data({
        性能得分: String(res.benchmarkLevel),
        机型档位: String(res.modelLevel),
      });
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

/** 获取微信 App 基础信息 */
export function getAppBaseInfo() {
  const info: any = wx.getAppBaseInfo();
  display.data({
    SDK版本: info.SDKVersion,
    微信版本: info.version,
    语言: info.language,
    主题: info.theme || '-',
    字体设置: String(info.fontSizeSetting),
    Host: info.host?.env || '-',
  });
}

/** 获取微信 App 授权设置 */
export function getAppAuthorizeSetting() {
  const s: any = wx.getAppAuthorizeSetting();
  display.data({
    摄像头: String(s.cameraAuthorized),
    定位: String(s.locationAuthorized),
    麦克风: String(s.microphoneAuthorized),
    通知: String(s.notificationAuthorized),
    日历: String(s.phoneCalendarAuthorized),
  });
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
