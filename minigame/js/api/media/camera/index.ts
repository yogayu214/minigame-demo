/**
 * 相机
 * wx.createCamera
 */

import { createDisplay } from '../../../libs/display-slot';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

let camera: any = null;

/** 授权相机权限 */
function authorizeCamera(): Promise<void> {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res: any) {
        if (res.authSetting['scope.camera']) {
          resolve();
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              resolve();
            },
            fail: reject,
          });
        }
      },
      fail: reject,
    });
  });
}

/** 创建相机 */
export function createCamera() {
  authorizeCamera()
    .then(() => {
      if (camera) {
        camera.destroy();
        camera = null;
      }
      const sysInfo = wx.getSystemInfoSync();
      const windowWidth = sysInfo?.windowWidth || 375;
      const windowHeight = sysInfo?.windowHeight || 667;
      const camSize = Math.min(windowWidth, 300);
      const x = (windowWidth - camSize) / 2;
      const y = windowHeight * 0.5;

      camera = wx.createCamera({
        x,
        y,
        width: camSize,
        height: camSize,
        devicePosition: 'front',
      });
      display.text('相机已创建');
    })
    .catch(() => {
      display.text('需要授权相机权限才能使用相机');
    });
}

/** 切换前后摄像头 */
export function switchCamera() {
  if (!camera) {
    display.text('请先创建相机');
    return;
  }
  camera.devicePosition = camera.devicePosition === 'back' ? 'front' : 'back';
  display.text(
    `切换到：${camera.devicePosition === 'front' ? '前置' : '后置'}摄像头`
  );
}

/** 拍照 */
export function takePhoto() {
  if (!camera) {
    display.text('请先创建相机');
    return;
  }
  camera
    .takePhoto()
    .then((res: any) => {
      if (!res.tempImagePath) {
        display.text('拍照失败：相机还没有完全启动');
        return;
      }
      display.image(res.tempImagePath);
    })
    .catch(() => {
      display.text('拍照失败');
    });
}

/** 开始录像 */
export function startRecord() {
  if (!camera) {
    display.text('请先创建相机');
    return;
  }
  camera.startRecord();
  display.text('录像中...');
}

/** 停止录像 */
export function stopRecord() {
  if (!camera) return;
  camera
    .stopRecord()
    .then((res: any) => {
      display.text(
        formatObj({
          状态: '录像成功',
          视频路径: res.tempVideoPath,
          封面路径: res.tempThumbPath || '-',
        })
      );
    })
    .catch((res: any) => {
      if (res?.errMsg === 'operateCamera:fail:is not recording') {
        display.text('输出失败：没有点击开始录制');
      } else if (res?.errMsg === 'operateCamera:fail:stop error') {
        display.text('输出失败：录制的时间过短');
      } else {
        display.text(`输出失败：${res?.errMsg || '未知错误'}`);
      }
    });
}

export function onUnload() {
  if (camera) {
    camera.destroy();
    camera = null;
  }
}
