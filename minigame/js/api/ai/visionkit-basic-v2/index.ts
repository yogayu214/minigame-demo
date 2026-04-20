/**
 * VisionKit 基础 v2
 * VisionKit v2 - 平面追踪
 */

/** 创建 VisionKit v2 会话 */
export function createVKSession() {
  // @ts-ignore
  const session = wx.createVKSession({
    track: { plane: { mode: 3 } },
    version: 'v2',
  });
  session.start((err: any) => {
    if (err) { console.error('VK session 启动失败:', err); return; }
    console.log('VisionKit v2 已启动');
  });
}
