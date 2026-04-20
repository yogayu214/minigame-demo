/**
 * 相机
 * wx.createCamera
 */

let camera: any = null;

/** 创建相机 */
export function onLoad() {
  camera = wx.createCamera({
    x: 0, y: 0, width: 300, height: 300,
    devicePosition: 'front',
  });
}

/** 拍照 */
export function takePhoto() {
  if (camera) camera.takePhoto({
    quality: 'high',
    success(res: any) { console.log('照片路径:', res.tempImagePath); },
  });
}

/** 开始录像 */
export function startRecordVideo() {
  if (camera) camera.startRecord({
    success() { console.log('录像中...'); },
  });
}

/** 停止录像 */
export function stopRecordVideo() {
  if (camera) camera.stopRecord({
    success(res: any) { console.log('录像路径:', res.tempVideoPath); },
  });
}

/** 销毁 */
export function destroy() {
  if (camera) { camera.destroy(); camera = null; }
}

/** 页面销毁时清理 */
export function onUnload() {
  if (camera) { camera.destroy(); camera = null; }
}
