/**
 * 相机
 * wx.createCamera
 */

import { createDisplay } from '../../../libs/display-slot';

const display = createDisplay();
export const setDisplay = display.setter;

let camera: any = null;

/** 创建相机 */
export function onLoad() {
  const { windowWidth } = wx.getSystemInfoSync();
  camera = wx.createCamera({
    x: 0, y: 200, width: windowWidth, height: windowWidth,
    devicePosition: 'front',
  });
}

/** 切换前后摄像头 */
export function switchCamera() {
  if (camera) {
    camera.devicePosition = camera.devicePosition === 'back' ? 'front' : 'back';
    display.text(`切换到：${camera.devicePosition === 'front' ? '前置' : '后置'}摄像头`);
  }
}

/** 拍照 */
export function takePhoto() {
  if (!camera) return;
  wx.showLoading({ title: '拍照中...', mask: true });
  camera.takePhoto().then((res: any) => {
    wx.hideLoading();
    if (!res.tempImagePath) {
      wx.showModal({ title: '拍照失败', content: '相机还没有完全启动', showCancel: false });
      return;
    }
    display.image(res.tempImagePath);
  }).catch(() => {
    wx.hideLoading();
    wx.showToast({ title: '拍照失败', icon: 'none' });
  });
}

/** 开始录像 */
export function startRecord() {
  if (camera) {
    camera.startRecord();
    display.text('● 录像中...');
  }
}

/** 停止录像 */
export function stopRecord() {
  if (!camera) return;
  wx.showLoading({ title: '输出中...', mask: true });
  camera.stopRecord().then((res: any) => {
    wx.hideLoading();
    display.data({
      '状态': '录像成功',
      '视频路径': res.tempVideoPath,
      '封面路径': res.tempThumbPath || '-',
    });
  }).catch((res: any) => {
    wx.hideLoading();
    if (res.errMsg === 'operateCamera:fail:is not recording') {
      wx.showModal({ title: '输出失败', content: '你没有点击开始录制', showCancel: false });
    } else if (res.errMsg === 'operateCamera:fail:stop error') {
      wx.showModal({ title: '输出失败', content: '录制的时间过短', showCancel: false });
    } else {
      wx.showModal({ title: '输出失败', content: res.errMsg || '未知错误', showCancel: false });
    }
  });
}

export function onUnload() {
  if (camera) { camera.destroy(); camera = null; }
}
