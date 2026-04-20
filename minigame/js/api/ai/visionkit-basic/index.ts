/**
 * VisionKit 基础
 * VisionKit v1 - 平面追踪
 */

/** 创建 VisionKit v1 会话 */
export function createVKSession() {
  // @ts-ignore
  const session = wx.createVKSession({
    track: { plane: { mode: 3 } },
    version: 'v1',
  });
  session.start((err: any) => {
    if (err) { console.error('VK session 启动失败:', err); return; }
    console.log('VisionKit v1 已启动');
  });
}
