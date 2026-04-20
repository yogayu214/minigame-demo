/**
 * 水平面 AR
 * VisionKit v1 - 平面追踪，触碰屏幕生成 3D 模型
 */

/** 创建 VisionKit v1 会话（平面追踪） */
export function createVKSession() {
  // @ts-ignore
  const session = wx.createVKSession({
    track: { plane: { mode: 3 } },
    version: 'v1',
  });
  session.start((err: any) => {
    if (err) { console.error('VK session 启动失败:', err); return; }
    console.log('VisionKit v1 平面追踪已启动');
  });
}
