/**
 * 蓝牙
 * wx.openBluetoothAdapter / wx.closeBluetoothAdapter / wx.getBluetoothAdapterState /
 * wx.onBluetoothAdapterStateChange / wx.offBluetoothAdapterStateChange /
 * wx.startBluetoothDevicesDiscovery / wx.stopBluetoothDevicesDiscovery /
 * wx.getBluetoothDevices
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let stateListener: ((res: any) => void) | null = null;

/** 打开蓝牙适配器 */
export function openBluetoothAdapter() {
  wx.openBluetoothAdapter({
    success() {
      display.text('蓝牙适配器已打开');
    },
    fail(err: any) {
      display.text(`打开失败：${err.errMsg}`);
    },
  });
}

/** 关闭蓝牙适配器 */
export function closeBluetoothAdapter() {
  (wx as any).closeBluetoothAdapter({
    success() {
      display.text('蓝牙适配器已关闭');
    },
  });
}

/** 获取本机蓝牙状态 */
export function getBluetoothAdapterState() {
  wx.getBluetoothAdapterState({
    success(res: any) {
      display.text(
        `discovering: ${res.discovering}\navailable: ${res.available}`
      );
    },
    fail(err: any) {
      display.text(`查询失败：${err.errMsg}`);
    },
  });
}

/** 监听蓝牙状态变化 */
export function onAdapterStateChange() {
  stateListener = (res: any) => {
    display.text(
      `事件: onBluetoothAdapterStateChange\navailable: ${res.available}\ndiscovering: ${res.discovering}`
    );
  };
  wx.onBluetoothAdapterStateChange(stateListener);
  display.text('已注册蓝牙状态监听');
}

/** 停止监听蓝牙状态 */
export function offAdapterStateChange() {
  if (stateListener) {
    (wx as any).offBluetoothAdapterStateChange(stateListener);
    stateListener = null;
    display.text('已停止蓝牙状态监听');
  }
}

/** 开始搜索附近蓝牙设备 */
export function startDevicesDiscovery() {
  wx.startBluetoothDevicesDiscovery({
    success() {
      display.text('已开始搜索附近设备');
    },
    fail(err: any) {
      display.text(`搜索失败：${err.errMsg}`);
    },
  });
}

/** 停止搜索 */
export function stopDevicesDiscovery() {
  wx.stopBluetoothDevicesDiscovery({
    success() {
      display.text('已停止搜索');
    },
  });
}

/** 获取已发现的设备列表 */
export function getDevices() {
  wx.getBluetoothDevices({
    success(res: any) {
      const list = res.devices || [];
      let info = `设备数: ${list.length}`;
      list.slice(0, 5).forEach((d: any, i: number) => {
        info += `\n设备${i + 1}: ${d.name || '-'} (${d.deviceId})`;
      });
      display.text(info);
    },
    fail(err: any) {
      display.text(`获取失败：${err.errMsg}`);
    },
  });
}

export function onUnload() {
  offAdapterStateChange();
}
