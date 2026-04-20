/**
 * 实时人脸检测
 * VisionKit v1 - 人脸追踪
 */

/** 创建 VisionKit 人脸检测会话 */
export function createFaceDetectSession() {
  // @ts-ignore
  const session = wx.createVKSession({
    track: { plane: { mode: 3 }, face: { mode: 1 } },
    cameraPosition: 0,
    version: 'v1',
  });
  session.start((err: any) => {
    if (err) { console.error('人脸检测启动失败:', err); return; }
    console.log('VisionKit 人脸检测已启动');
  });
}

/** 切换前后摄像头 */
export function switchCamera() {
  console.log('切换摄像头（需在 VK session 上调用 switchCamera）');
}
