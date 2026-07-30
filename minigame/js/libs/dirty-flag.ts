/**
 * 脏标记渲染控制模块
 *
 * PIXI 4.x Application 通过 ticker.add(this.render, this) 注册渲染回调，
 * 内部持有原始函数引用，override app.render 无效。
 *
 * 正确方案：直接 override renderer.render()，这是真正执行 Canvas 2D 绘制的入口。
 * ticker 照常运行，动画回调正常执行，但最终的 Canvas 绑制被脏标记控制。
 */

let dirty = true;
let installed = false;
let animationCount = 0;

/**
 * 标记画面为脏，下次 render 调用时会真正执行绑制。
 */
export function markDirty() {
  dirty = true;
}

/**
 * 开始持续动画模式（每帧渲染）。
 * 返回 stop 函数，调用后退出持续渲染。
 */
export function startAnimation(): () => void {
  animationCount++;
  let stopped = false;
  return () => {
    if (!stopped) {
      stopped = true;
      animationCount = Math.max(0, animationCount - 1);
    }
  };
}

/**
 * 初始化脏标记渲染。
 * Override renderer.render()，只在 dirty 时才真正执行 Canvas 2D 绘制。
 */
export function initDirtyRender(pixiApp: any) {
  if (installed) return;
  installed = true;

  const renderer = pixiApp.renderer;
  const originalRender = renderer.render.bind(renderer);

  renderer.render = function (stage: any, ...args: any[]) {
    if (animationCount > 0) dirty = true;
    if (dirty) {
      dirty = false;
      originalRender(stage, ...args);
    }
  };
}
